import { z } from 'zod'

const RegistrationSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    age: z.number().min(18, "Must be at least 18 years old").max(65, "Must be 65 or younger"),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    bloodGroup: z.enum(['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE']),
    mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid India mobile number format"),
    email: z.string().email().optional().or(z.literal('')),
    addressState: z.string().min(1, "State is required"),
    addressDistrict: z.string().min(1, "District is required"),
    addressCity: z.string().min(1, "City is required"),
    pincode: z.string().regex(/^\d{6}$/, "Invalid Pincode (must be 6 digits)").optional().or(z.literal('')),
    lastDonationDate: z.string().optional().nullable(),
    medicalConditions: z.string().optional(),
    registeredCampId: z.string().min(1, "Camp selection is required")
})

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const validatedData = RegistrationSchema.parse(body)

        // 1. Verify if the camp is ACTIVE
        const camp = await prisma.camp.findUnique({
            where: { id: validatedData.registeredCampId }
        })

        if (!camp || camp.status !== 'ACTIVE') {
            throw createError({
                statusCode: 400,
                statusMessage: 'Registration is only allowed for ACTIVE camps.'
            })
        }

        // 2. Check if mobile already exists
        const existingDonor = await prisma.donor.findUnique({
            where: { mobile: validatedData.mobile }
        })

        if (existingDonor) {
            // Logic change: If donor exists, should we update their registeredCampId?
            // "REGISTERED → SCREENED → ... SCREENED can be done only once per camp"
            // For now, let's assume we update the existing donor to the new camp and reset status
            await prisma.donor.update({
                where: { id: existingDonor.id },
                data: {
                    status: 'REGISTERED',
                    registeredCampId: validatedData.registeredCampId
                }
            })

            return {
                success: true,
                message: 'Donor already exists, updated registration to current camp.',
                data: existingDonor
            }
        }

        const lastDonationDate = validatedData.lastDonationDate ? new Date(validatedData.lastDonationDate) : null
        // All new registrations start in the REGISTERED state for the current session
        const initialStatus = 'REGISTERED'

        const donor = await prisma.donor.create({
            data: {
                ...validatedData,
                lastDonationDate,
                email: validatedData.email || null,
                status: initialStatus as any
            }
        })

        return {
            success: true,
            data: donor
        }
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Validation Error',
                data: error.issues
            })
        }
        throw error
    }
})

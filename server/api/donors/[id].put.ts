import { z } from 'zod'

const DonorUpdateSchema = z.object({
    name: z.string().min(2).optional(),
    age: z.number().min(18).max(65).optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    bloodGroup: z.enum(['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE']).optional(),
    mobile: z.string().regex(/^[6-9]\d{9}$/).optional(),
    email: z.string().email().optional().or(z.literal('')).nullable(),
    addressState: z.string().min(1).optional(),
    addressDistrict: z.string().min(1).optional(),
    addressCity: z.string().min(1).optional(),
    pincode: z.string().regex(/^\d{6}$/, "Invalid Pincode").optional().or(z.literal('')).nullable(),
    lastDonationDate: z.string().optional().nullable(),
    medicalConditions: z.string().optional().nullable()
})

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    try {
        const body = await readBody(event)
        const validatedData = DonorUpdateSchema.parse(body)

        const updateData: any = { ...validatedData }
        if (validatedData.lastDonationDate) {
            updateData.lastDonationDate = new Date(validatedData.lastDonationDate)
        }

        const donor = await prisma.donor.update({
            where: { id },
            data: updateData
        })

        return {
            success: true,
            data: donor
        }
    } catch (error: any) {
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

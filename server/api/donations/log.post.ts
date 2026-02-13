import { z } from 'zod'

const DonationLogSchema = z.object({
    donorId: z.string(),
    campId: z.string().optional().nullable(),
    startTime: z.string().optional().nullable(),
    endTime: z.string().optional().nullable(),
    location: z.string().min(2, "Location is required"),
    units: z.number().default(1),
    status: z.enum(['DONATED', 'NOT_DONATED']),
    phlebotomistId: z.string().optional().nullable(),
    failureReason: z.string().optional().nullable(),
    notes: z.string().optional().nullable()
})

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const validatedData = DonationLogSchema.parse(body)

        // 1. Fetch donor to verify lifecycle status
        const donor = await prisma.donor.findUnique({
            where: { id: validatedData.donorId }
        })

        if (!donor) {
            throw createError({ statusCode: 404, statusMessage: 'Donor not found' })
        }

        // Only ELIGIBLE donors can proceed to donation
        if (donor.status !== 'ELIGIBLE') {
            throw createError({
                statusCode: 400,
                statusMessage: `Donor lifecycle mismatch: Current status is ${donor.status}. Only ELIGIBLE donors can proceed to donation.`
            })
        }

        // 2. Capture and format dates/times
        const startTime = validatedData.startTime ? new Date(validatedData.startTime) : null
        const endTime = validatedData.endTime ? new Date(validatedData.endTime) : null

        // 3. Log the donation attempt/success
        const donation = await prisma.donation.create({
            data: {
                ...validatedData,
                startTime,
                endTime,
                status: validatedData.status as any,
                date: new Date()
            }
        })

        // 4. Update donor profile with final immutability rules
        await prisma.donor.update({
            where: { id: validatedData.donorId },
            data: {
                lastDonationDate: validatedData.status === 'DONATED' ? new Date() : donor.lastDonationDate,
                status: validatedData.status as any
            }
        })

        return {
            success: true,
            data: donation
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

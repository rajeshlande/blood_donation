import { z } from 'zod'

const DonationUpdateSchema = z.object({
    location: z.string().min(2, "Location is required").optional(),
    units: z.number().positive("Units must be positive").optional(),
    status: z.enum(['DONATED', 'NOT_DONATED', 'DEFERRED']).optional(),
    notes: z.string().optional().nullable(),
    date: z.string().transform((str) => new Date(str)).optional()
})

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    try {
        const body = await readBody(event)
        const validatedData = DonationUpdateSchema.parse(body)

        const donation = await prisma.donation.update({
            where: { id },
            data: validatedData
        })

        // If the status was changed, we might need to re-evaluate the donor's last donation date.
        // However, to keep it simple and robust, we'll fetch the latest 'DONATED' record for that donor.
        const latestDonation = await prisma.donation.findFirst({
            where: {
                donorId: donation.donorId,
                status: 'DONATED'
            },
            orderBy: { date: 'desc' }
        })

        await prisma.donor.update({
            where: { id: donation.donorId },
            data: { lastDonationDate: latestDonation ? latestDonation.date : null }
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

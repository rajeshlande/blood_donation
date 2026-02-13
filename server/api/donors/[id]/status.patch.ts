import { z } from 'zod'

const StatusUpdateSchema = z.object({
    status: z.enum(['DONATED', 'NOT_DONATED', 'LOW_HB', 'NOT_ELIGIBLE'])
})

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    try {
        const body = await readBody(event)
        const { status } = StatusUpdateSchema.parse(body)

        const donor = await prisma.donor.update({
            where: { id },
            data: { status }
        })

        return {
            success: true,
            data: donor
        }
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid status provided'
            })
        }
        throw error
    }
})

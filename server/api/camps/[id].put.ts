import { z } from 'zod'

const CampUpdateSchema = z.object({
    name: z.string().min(2).optional(),
    date: z.string().transform((str) => new Date(str)).optional(),
    location: z.string().min(2).optional(),
    organizer: z.string().optional().nullable(),
    status: z.enum(['UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED']).optional()
})

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    try {
        const body = await readBody(event)
        const validatedData = CampUpdateSchema.parse(body)

        const camp = await prisma.camp.update({
            where: { id },
            data: validatedData
        })

        return {
            success: true,
            data: camp
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

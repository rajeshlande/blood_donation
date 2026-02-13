import { z } from 'zod'

import { deriveCampStatus } from '~~/utils/camp'

const CampSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    date: z.string().transform((str) => new Date(str)),
    startTime: z.string().optional().nullable(),
    endTime: z.string().optional().nullable(),
    location: z.string().min(2, "Location is required"),
    addressState: z.string().optional().nullable(),
    addressDistrict: z.string().optional().nullable(),
    addressCity: z.string().optional().nullable(),
    organizer: z.string().optional().nullable(),
    bloodBank: z.string().optional().nullable()
})

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const validatedData = CampSchema.parse(body)

        // Automatically derive initial status based on date
        const initialStatus = deriveCampStatus(validatedData.date)

        const camp = await prisma.camp.create({
            data: {
                ...validatedData,
                status: initialStatus as any
            }
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

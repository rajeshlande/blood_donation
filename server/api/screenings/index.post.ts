import { z } from 'zod'
import { validateScreening } from '~~/utils/lifecycle'

const ScreeningSchema = z.object({
    donorId: z.string(),
    campId: z.string(),
    hb: z.number().positive(),
    weight: z.number().positive(),
    remarks: z.string().optional(),
    staffId: z.string().optional()
})

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const validatedData = ScreeningSchema.parse(body)

        // 1. Fetch donor to get gender for validation
        const donor = await prisma.donor.findUnique({
            where: { id: validatedData.donorId }
        })

        if (!donor) {
            throw createError({ statusCode: 404, statusMessage: 'Donor not found' })
        }

        if (donor.status !== 'REGISTERED' && donor.status !== 'SCREENED') {
            throw createError({
                statusCode: 400,
                statusMessage: `Donor lifecycle mismatch: Current status is ${donor.status}`
            })
        }

        // 2. Perform Medical Validation (India Standard)
        const validation = validateScreening(validatedData.hb, validatedData.weight, donor.gender)
        const outcome = validation.success ? 'ELIGIBLE' : 'NOT_DONATED'

        // 3. Create Screening Record
        const screening = await prisma.screening.create({
            data: {
                ...validatedData,
                outcome: outcome as any,
                failureReason: validation.success ? null : validation.reason
            }
        })

        // 4. Update Donor Status
        await prisma.donor.update({
            where: { id: validatedData.donorId },
            data: {
                status: outcome as any
            }
        })

        return {
            success: true,
            data: screening
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

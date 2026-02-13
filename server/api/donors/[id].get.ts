export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Donor ID is required'
        })
    }

    const donor = await prisma.donor.findUnique({
        where: { id },
        include: {
            donations: {
                orderBy: { date: 'desc' }
            }
        }
    })

    if (!donor) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Donor not found'
        })
    }

    const eligibility = checkDonorEligibility(donor.lastDonationDate, donor.medicalConditions)

    return {
        success: true,
        data: {
            ...donor,
            eligibility
        }
    }
})

export default defineEventHandler(async (event) => {
    const donors = await prisma.donor.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            registeredCamp: true,
            screenings: {
                orderBy: { examinedAt: 'desc' },
                take: 1
            },
            donations: {
                orderBy: { date: 'desc' },
                take: 5
            }
        }
    })

    // Enrich with eligibility using the most recent screening if available
    const enrichedDonors = donors.map((donor: any) => ({
        ...donor,
        latestScreening: donor.screenings[0] || null,
        eligibility: checkDonorEligibility(donor.lastDonationDate, donor.medicalConditions)
    }))

    return {
        success: true,
        data: enrichedDonors
    }
})

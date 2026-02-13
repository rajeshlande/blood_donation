export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    const donation = await prisma.donation.delete({
        where: { id }
    })

    // Re-calculate donor's last donation date
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
        message: 'Donation record deleted and donor profile updated.'
    }
})

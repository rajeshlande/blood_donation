export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    // Use a transaction to delete donor and their donations safely
    await prisma.$transaction([
        prisma.donation.deleteMany({ where: { donorId: id } }),
        prisma.donor.delete({ where: { id } })
    ])

    return {
        success: true,
        message: 'Donor and their history deleted successfully'
    }
})

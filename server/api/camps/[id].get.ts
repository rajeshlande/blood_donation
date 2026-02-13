export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Camp ID is required' })
    }

    const camp = await prisma.camp.findUnique({
        where: { id },
        include: {
            donations: {
                include: {
                    donor: true
                }
            }
        }
    })

    if (!camp) {
        throw createError({ statusCode: 404, statusMessage: 'Camp not found' })
    }

    return {
        success: true,
        data: camp
    }
})

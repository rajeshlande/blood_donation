export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    await prisma.camp.delete({
        where: { id }
    })

    return {
        success: true,
        message: 'Camp deleted successfully'
    }
})

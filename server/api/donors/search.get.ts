export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const q = (query.q as string || '').trim()
    const status = query.status as string // Optional filter, e.g. "REGISTERED"

    if (!q) return { success: true, data: [] }

    const donors = await prisma.donor.findMany({
        where: {
            OR: [
                { mobile: { contains: q } },
                { name: { contains: q } },
                { id: { contains: q } }
            ],
            // If status is provided, filter by it. 
            // For Screening desk, we'll pass status=REGISTERED from the frontend
            ...(status ? { status: status as any } : {})
        },
        include: {
            registeredCamp: true
        },
        take: 10
    })

    return {
        success: true,
        data: donors
    }
})

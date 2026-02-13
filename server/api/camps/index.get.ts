import { deriveCampStatus } from '~~/utils/camp'

export default defineEventHandler(async (event) => {
    // 1. Perform automated status synchronization for active/upcoming camps
    const pendingCamps = await prisma.camp.findMany({
        where: {
            status: { notIn: ['CANCELLED', 'COMPLETED'] }
        }
    })

    for (const camp of pendingCamps) {
        const newStatus = deriveCampStatus(camp.date)
        if (newStatus !== camp.status) {
            await prisma.camp.update({
                where: { id: camp.id },
                data: { status: newStatus as any }
            })
        }
    }

    // 3. Return enriched camp data
    const campsRaw = await prisma.camp.findMany({
        orderBy: { date: 'desc' },
        include: {
            donations: {
                where: { status: 'DONATED' },
                select: { units: true }
            }
        }
    })

    const camps = (campsRaw || []).map((camp: any) => {
        const donations = camp.donations || []
        return {
            ...camp,
            totalUnits: donations.reduce((acc: number, curr: any) => acc + (curr?.units || 0), 0),
            donationCount: donations.length
        }
    })

    return {
        success: true,
        data: camps
    }
})

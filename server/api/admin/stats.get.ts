import { defineEventHandler } from 'h3'
import { prisma } from '../../utils/prisma'
import { startOfMonth, endOfMonth, eachMonthOfInterval, subMonths, format } from 'date-fns'
import { checkDonorEligibility } from '../../utils/eligibility'

export default defineEventHandler(async (event) => {
    // 1. Total Registered Donors
    const totalDonors = await prisma.donor.count()

    // 2. Count per Blood Group
    const bloodGroupStats = await prisma.donor.groupBy({
        by: ['bloodGroup'],
        _count: {
            _all: true
        }
    })

    // 3. Eligible vs Non-Eligible (approximate check for dashboard)
    const donors = await prisma.donor.findMany({
        select: { lastDonationDate: true, medicalConditions: true }
    })

    let eligibleCount = 0
    donors.forEach((d: any) => {
        if (checkDonorEligibility(d.lastDonationDate, d.medicalConditions).isEligible) {
            eligibleCount++
        }
    })

    // 4. Monthly Donations (last 6 months)
    const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5))
    const monthlyDonationsRaw = await prisma.donation.groupBy({
        by: ['date'],
        _count: {
            _all: true
        },
        where: {
            date: {
                gte: sixMonthsAgo
            },
            status: 'DONATED'
        }
    })

    // 5. Recent Donors for the table
    const recentDonorsRaw = await prisma.donor.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
    })

    const recentDonors = recentDonorsRaw.map((donor: any) => ({
        ...donor,
        eligibility: checkDonorEligibility(donor.lastDonationDate, donor.medicalConditions)
    }))

    // Group by month name for the chart
    const months = eachMonthOfInterval({
        start: sixMonthsAgo,
        end: new Date()
    })

    const monthlyStats = months.map(month => {
        const monthLabel = format(month, 'MMM yyyy')
        const count = monthlyDonationsRaw.filter((d: any) =>
            format(new Date(d.date), 'MMM yyyy') === monthLabel
        ).reduce((acc: number, curr: any) => acc + curr._count._all, 0)

        return { month: monthLabel, count }
    })

    return {
        success: true,
        data: {
            totalDonors,
            eligibleCount,
            nonEligibleCount: totalDonors - eligibleCount,
            bloodGroupStats: bloodGroupStats.map((stat: any) => ({
                group: stat.bloodGroup,
                count: stat._count._all
            })),
            monthlyStats,
            recentDonors
        }
    }
})

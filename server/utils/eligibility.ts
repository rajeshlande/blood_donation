import { differenceInDays, addDays } from 'date-fns'

export interface EligibilityResult {
    isEligible: boolean;
    reason?: string;
    nextEligibleDate?: Date;
}

export const checkDonorEligibility = (lastDonationDate: Date | null, medicalConditions: string | null): EligibilityResult => {
    if (!lastDonationDate) {
        return { isEligible: true };
    }

    const daysSinceLastDonation = differenceInDays(new Date(), lastDonationDate);
    const GAP_DAYS = 90;

    if (daysSinceLastDonation < GAP_DAYS) {
        return {
            isEligible: false,
            reason: `Minimum 90 days gap required. Only ${daysSinceLastDonation} days have passed.`,
            nextEligibleDate: addDays(lastDonationDate, GAP_DAYS)
        };
    }

    // Simplified medical condition check
    const riskWords = ['heart', 'diabetes', 'cancer', 'hiv', 'hepatitis', 'tuberculosis'];
    if (medicalConditions) {
        const lowerConditions = medicalConditions.toLowerCase();
        if (riskWords.some(word => lowerConditions.includes(word))) {
            return {
                isEligible: false,
                reason: 'Certain medical conditions may require specialized consultation before donation.'
            };
        }
    }

    return { isEligible: true };
}

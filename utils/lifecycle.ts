export type DonorStatus = 'REGISTERED' | 'SCREENED' | 'ELIGIBLE' | 'DONATED' | 'NOT_DONATED';

/**
 * Transitions follow a strict one-way lifecycle.
 * REGISTERED -> SCREENED -> ELIGIBLE -> DONATED / NOT_DONATED
 */
const LIFECYCLE_MAP: Record<DonorStatus, DonorStatus[]> = {
    'REGISTERED': ['SCREENED'],
    'SCREENED': ['ELIGIBLE', 'NOT_DONATED'],
    'ELIGIBLE': ['DONATED', 'NOT_DONATED'],
    'DONATED': [], // Final
    'NOT_DONATED': [] // Final
};

/**
 * Validates if a transition from current to next is allowed.
 */
export function canTransitionTo(current: DonorStatus, next: DonorStatus): boolean {
    if (!LIFECYCLE_MAP[current]) return false;
    return LIFECYCLE_MAP[current].includes(next);
}

/**
 * Common failure reasons for NOT_DONATED outcome (Donation Desk)
 */
export const DONATION_FAILURE_REASONS = [
    'Vein not accessible',
    'Donor discomfort',
    'Adverse reaction',
    'Donor withdrew',
    'Technical issue'
];

/**
 * India Standard Medical Validation
 */
export function validateScreening(hb: number, weight: number, gender: string) {
    const minHB = gender === 'MALE' ? 13.0 : 12.5;
    const minWeight = 45;

    if (hb < minHB) return { success: false, reason: `HB too low (Required: ${minHB} g/dL)` };
    if (weight < minWeight) return { success: false, reason: `Weight too low (Required: ${minWeight} kg)` };

    return { success: true };
}

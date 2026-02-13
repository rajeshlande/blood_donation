export interface ChangelogEntry {
    version: string;
    date: string;
    type: 'feature' | 'fix' | 'improvement';
    title: string;
    details: string[];
}

export const APP_CHANGELOG: ChangelogEntry[] = [
    {
        version: '1.2.0',
        date: '2026-02-04',
        type: 'feature',
        title: 'Centralized Status & View Modes',
        details: [
            'Unified Donor Status across Donation Logging and Dashboard.',
            'Added Grid and List view options to Donor Directory.',
            'Implemented robust SSR import hardening for continuous stability.'
        ]
    },
    {
        version: '1.1.5',
        date: '2026-02-04',
        type: 'improvement',
        title: 'Visual Refinement',
        details: [
            'Added mission-driven About page.',
            'Cleaned up navigation header for better task focus.',
            'Integrated app-wide version badges in the footer.'
        ]
    },
    {
        version: '1.1.0',
        date: '2026-02-03',
        type: 'feature',
        title: 'Infrastructure & Legal',
        details: [
            'Implemented India-specific location selectors with State/District validation.',
            'Added Privacy Policy, Terms of Service, and Contact Support.',
            'Optimized Donation History management (Edit/Delete entries).'
        ]
    }
]

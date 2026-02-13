export const BLOOD_GROUP_LABELS: Record<string, string> = {
    'A_POSITIVE': 'A+',
    'A_NEGATIVE': 'A-',
    'B_POSITIVE': 'B+',
    'B_NEGATIVE': 'B-',
    'AB_POSITIVE': 'AB+',
    'AB_NEGATIVE': 'AB-',
    'O_POSITIVE': 'O+',
    'O_NEGATIVE': 'O-',
}

export const formatBloodGroup = (group: string) => {
    return BLOOD_GROUP_LABELS[group] || group.replace('_', ' ').replace('POSITIVE', '+').replace('NEGATIVE', '-')
}

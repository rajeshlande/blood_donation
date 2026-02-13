import { startOfDay, isBefore, isSameDay } from 'date-fns'

export type CampStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

/**
 * Automatically derives camp status based on the current date.
 * Condition      Status
 * Date > Today   UPCOMING
 * Date = Today   ACTIVE
 * Date < Today   COMPLETED
 */
export function deriveCampStatus(campDate: Date | string): CampStatus {
    const today = startOfDay(new Date());
    const targetDate = startOfDay(new Date(campDate));

    if (isSameDay(targetDate, today)) return 'ACTIVE';
    if (isBefore(targetDate, today)) return 'COMPLETED';
    return 'UPCOMING';
}

/**
 * Checks if a camp is locked (COMPLETED status).
 */
export function isCampLocked(status: CampStatus): boolean {
    return status === 'COMPLETED';
}

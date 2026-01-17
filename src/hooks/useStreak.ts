// Streak calculation hook

import { useMemo } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { useAppSelector } from './useStore';

interface StreakData {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalDays: number;
    totalHours: number;
    totalMinutes: number;
    totalSeconds: number;
    startDate: Date | null;
    isActive: boolean;
}

export function useStreak(): StreakData {
    const profile = useAppSelector((state) => state.user.profile);

    return useMemo(() => {
        if (!profile?.sobrietyStartDate) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                totalDays: 0,
                totalHours: 0,
                totalMinutes: 0,
                totalSeconds: 0,
                startDate: null,
                isActive: false,
            };
        }

        const startDate = new Date(profile.sobrietyStartDate);
        const now = new Date();

        const totalSeconds = differenceInSeconds(now, startDate);
        const totalMinutes = differenceInMinutes(now, startDate);
        const totalHours = differenceInHours(now, startDate);
        const totalDays = differenceInDays(now, startDate);

        // Calculate individual components
        const days = totalDays;
        const hours = totalHours % 24;
        const minutes = totalMinutes % 60;
        const seconds = totalSeconds % 60;

        return {
            days,
            hours,
            minutes,
            seconds,
            totalDays,
            totalHours,
            totalMinutes,
            totalSeconds,
            startDate,
            isActive: true,
        };
    }, [profile?.sobrietyStartDate]);
}

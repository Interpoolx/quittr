// User State Slice

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile, UserStats } from '../../types';

interface UserState {
    profile: UserProfile | null;
    stats: UserStats;
    isOnboarded: boolean;
    lastCheckIn: string | null;
}

const initialStats: UserStats = {
    currentStreak: 0,
    bestStreak: 0,
    totalDaysClean: 0,
    totalUrgesLogged: 0,
    urgesResisted: 0,
    resistanceRate: 0,
    averageMood: 0,
    totalXP: 0,
    level: 1,
    achievements: [],
};

const initialState: UserState = {
    profile: null,
    stats: initialStats,
    isOnboarded: false,
    lastCheckIn: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<UserProfile>) => {
            state.profile = action.payload;
        },
        updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
            if (state.profile) {
                state.profile = { ...state.profile, ...action.payload, updatedAt: new Date().toISOString() };
            }
        },
        setSobrietyStartDate: (state, action: PayloadAction<string>) => {
            if (state.profile) {
                state.profile.sobrietyStartDate = action.payload;
                state.profile.updatedAt = new Date().toISOString();
            }
        },
        updateStats: (state, action: PayloadAction<Partial<UserStats>>) => {
            state.stats = { ...state.stats, ...action.payload };
        },
        incrementStreak: (state) => {
            state.stats.currentStreak += 1;
            state.stats.totalDaysClean += 1;
            if (state.stats.currentStreak > state.stats.bestStreak) {
                state.stats.bestStreak = state.stats.currentStreak;
                if (state.profile) {
                    state.profile.bestStreak = state.stats.bestStreak;
                }
            }
        },
        resetStreak: (state) => {
            state.stats.currentStreak = 0;
        },
        addXP: (state, action: PayloadAction<number>) => {
            state.stats.totalXP += action.payload;
            // Level up logic: 100 XP per level
            state.stats.level = Math.floor(state.stats.totalXP / 100) + 1;
        },
        unlockAchievement: (state, action: PayloadAction<string>) => {
            if (!state.stats.achievements.includes(action.payload)) {
                state.stats.achievements.push(action.payload);
            }
        },
        setOnboarded: (state, action: PayloadAction<boolean>) => {
            state.isOnboarded = action.payload;
        },
        setLastCheckIn: (state, action: PayloadAction<string>) => {
            state.lastCheckIn = action.payload;
        },
        addMotivation: (state, action: PayloadAction<string>) => {
            if (state.profile && !state.profile.motivations.includes(action.payload)) {
                state.profile.motivations.push(action.payload);
            }
        },
        removeMotivation: (state, action: PayloadAction<string>) => {
            if (state.profile) {
                state.profile.motivations = state.profile.motivations.filter(m => m !== action.payload);
            }
        },
        addCustomTrigger: (state, action: PayloadAction<string>) => {
            if (state.profile && !state.profile.customTriggers.includes(action.payload)) {
                state.profile.customTriggers.push(action.payload);
            }
        },
        resetUser: () => initialState,
    },
});

export const {
    setProfile,
    updateProfile,
    setSobrietyStartDate,
    updateStats,
    incrementStreak,
    resetStreak,
    addXP,
    unlockAchievement,
    setOnboarded,
    setLastCheckIn,
    addMotivation,
    removeMotivation,
    addCustomTrigger,
    resetUser,
} = userSlice.actions;

export default userSlice.reducer;

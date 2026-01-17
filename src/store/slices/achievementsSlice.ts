// Achievements State Slice

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Achievement } from '../../types';

interface AchievementsState {
    all: Achievement[];
    unlocked: string[];
    recentlyUnlocked: string[];
}

// Default achievements based on PRD requirements
const defaultAchievements: Achievement[] = [
    // Milestone badges (days-based)
    { id: 'day_1', type: 'milestone', name: 'First Step', description: 'Complete 1 day', icon: '🌱', requirement: 1, xpReward: 10 },
    { id: 'day_3', type: 'milestone', name: 'Building Momentum', description: 'Complete 3 days', icon: '🌿', requirement: 3, xpReward: 20 },
    { id: 'day_7', type: 'milestone', name: 'One Week Strong', description: 'Complete 7 days', icon: '🌳', requirement: 7, xpReward: 50 },
    { id: 'day_14', type: 'milestone', name: 'Two Week Warrior', description: 'Complete 14 days', icon: '💪', requirement: 14, xpReward: 75 },
    { id: 'day_21', type: 'milestone', name: 'Habit Breaker', description: 'Complete 21 days', icon: '🔥', requirement: 21, xpReward: 100 },
    { id: 'day_30', type: 'milestone', name: 'Monthly Master', description: 'Complete 30 days', icon: '⭐', requirement: 30, xpReward: 150 },
    { id: 'day_60', type: 'milestone', name: 'Double Down', description: 'Complete 60 days', icon: '🌟', requirement: 60, xpReward: 200 },
    { id: 'day_90', type: 'milestone', name: 'Reboot Complete', description: 'Complete 90 days', icon: '🏆', requirement: 90, xpReward: 300 },
    { id: 'day_180', type: 'milestone', name: 'Half Year Hero', description: 'Complete 180 days', icon: '👑', requirement: 180, xpReward: 500 },
    { id: 'day_365', type: 'milestone', name: 'Year of Freedom', description: 'Complete 365 days', icon: '💎', requirement: 365, xpReward: 1000 },

    // Behavior-based badges
    { id: 'urge_resist_5', type: 'behavior', name: 'Urge Fighter', description: 'Resist 5 urges', icon: '🛡️', requirement: 5, xpReward: 25 },
    { id: 'urge_resist_25', type: 'behavior', name: 'Urge Warrior', description: 'Resist 25 urges', icon: '⚔️', requirement: 25, xpReward: 75 },
    { id: 'urge_resist_100', type: 'behavior', name: 'Urge Master', description: 'Resist 100 urges', icon: '🗡️', requirement: 100, xpReward: 250 },
    { id: 'checkin_7', type: 'streak', name: 'Check-in Streak', description: '7 day check-in streak', icon: '📝', requirement: 7, xpReward: 50 },
    { id: 'checkin_30', type: 'streak', name: 'Dedicated Logger', description: '30 day check-in streak', icon: '📖', requirement: 30, xpReward: 150 },
    { id: 'journal_10', type: 'behavior', name: 'Reflective Mind', description: 'Write 10 journal entries', icon: '✍️', requirement: 10, xpReward: 50 },
    { id: 'panic_5', type: 'behavior', name: 'Crisis Handler', description: 'Use panic button 5 times', icon: '🆘', requirement: 5, xpReward: 30 },
];

const initialState: AchievementsState = {
    all: defaultAchievements,
    unlocked: [],
    recentlyUnlocked: [],
};

const achievementsSlice = createSlice({
    name: 'achievements',
    initialState,
    reducers: {
        unlockAchievement: (state, action: PayloadAction<string>) => {
            const achievementId = action.payload;
            if (!state.unlocked.includes(achievementId)) {
                state.unlocked.push(achievementId);
                state.recentlyUnlocked.push(achievementId);

                // Update the achievement's unlocked date
                const achievement = state.all.find(a => a.id === achievementId);
                if (achievement) {
                    achievement.unlockedAt = new Date().toISOString();
                }
            }
        },
        clearRecentlyUnlocked: (state) => {
            state.recentlyUnlocked = [];
        },
        resetAchievements: (state) => {
            state.unlocked = [];
            state.recentlyUnlocked = [];
            state.all = defaultAchievements;
        },
    },
});

export const {
    unlockAchievement,
    clearRecentlyUnlocked,
    resetAchievements,
} = achievementsSlice.actions;

export default achievementsSlice.reducer;

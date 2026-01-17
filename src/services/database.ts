// Database Service for Quittr
// Currently uses Redux Persist for data storage (works on all platforms)
// SQLite implementation can be added for native platforms in the future

import { Platform } from 'react-native';

// Initialize database - currently a no-op, using Redux Persist instead
export async function initDatabase(): Promise<void> {
    if (Platform.OS === 'web') {
        console.log('Web platform: using Redux Persist for storage');
    } else {
        console.log('Native platform: using Redux Persist for storage');
        // Future: Add SQLite initialization here for native platforms
    }
}

// All data operations are handled by Redux Persist through the store slices
// The functions below are stubs that can be expanded for SQLite in the future

export async function insertUrgeLog(_log: {
    id: string;
    timestamp: string;
    intensity: number;
    triggers: string[];
    emotionalState: string;
    outcome: string;
    notes: string;
}): Promise<void> {
    // Currently handled by Redux Persist
}

export async function getUrgeLogs(_limit: number = 50): Promise<any[]> {
    // Currently handled by Redux Persist
    return [];
}

export async function getUrgeStats(): Promise<{
    total: number;
    resisted: number;
    slipped: number;
    resistanceRate: number;
}> {
    // Currently handled by Redux Persist
    return { total: 0, resisted: 0, slipped: 0, resistanceRate: 0 };
}

export async function insertJournalEntry(_entry: {
    id: string;
    date: string;
    mood: number;
    energy: number;
    sleepQuality: number;
    content: string;
    promptId: string;
    tags: string[];
}): Promise<void> {
    // Currently handled by Redux Persist
}

export async function getJournalEntries(_limit: number = 50): Promise<any[]> {
    // Currently handled by Redux Persist
    return [];
}

export async function insertCheckIn(_checkIn: {
    id: string;
    date: string;
    mood: number;
    energy: number;
    sleepQuality: number;
    urgeCount: number;
}): Promise<void> {
    // Currently handled by Redux Persist
}

export async function getTodayCheckIn(): Promise<any | null> {
    // Currently handled by Redux Persist
    return null;
}

export async function unlockAchievement(_id: string): Promise<void> {
    // Currently handled by Redux Persist
}

export async function getUnlockedAchievements(): Promise<string[]> {
    // Currently handled by Redux Persist
    return [];
}

export async function saveProfile(_profile: {
    id: string;
    sobrietyStartDate: string;
    bestStreak: number;
    totalXP: number;
    level: number;
    motivations: string[];
    customTriggers: string[];
}): Promise<void> {
    // Currently handled by Redux Persist
}

export async function getProfile(): Promise<any | null> {
    // Currently handled by Redux Persist
    return null;
}

export async function clearAllData(): Promise<void> {
    // Currently handled by Redux Persist
}

export default {
    initDatabase,
    insertUrgeLog,
    getUrgeLogs,
    getUrgeStats,
    insertJournalEntry,
    getJournalEntries,
    insertCheckIn,
    getTodayCheckIn,
    unlockAchievement,
    getUnlockedAchievements,
    saveProfile,
    getProfile,
    clearAllData,
};

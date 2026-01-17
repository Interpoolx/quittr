// Core TypeScript Types for Quittr App

// User Profile
export interface UserProfile {
    id: string;
    sobrietyStartDate: string; // ISO date string
    bestStreak: number; // in days
    totalUrgesResisted: number;
    totalSlips: number;
    motivations: string[];
    customTriggers: string[];
    createdAt: string;
    updatedAt: string;
}

// Urge Log Entry
export interface UrgeLog {
    id: string;
    timestamp: string;
    intensity: number; // 1-10
    triggers: string[];
    location?: string;
    emotionalState: string;
    outcome: 'resisted' | 'slip';
    notes?: string;
    duration?: number; // how long the urge lasted in minutes
}

// Journal Entry
export interface JournalEntry {
    id: string;
    date: string;
    mood: number; // 1-5
    energy: number; // 1-5
    sleepQuality: number; // 1-5
    urgeCount: number;
    content: string;
    promptId?: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

// Daily Check-in
export interface DailyCheckIn {
    id: string;
    date: string;
    mood: number;
    energy: number;
    sleepQuality: number;
    urgeCount: number;
    completedAt: string;
}

// Achievement/Badge
export interface Achievement {
    id: string;
    type: 'milestone' | 'behavior' | 'streak' | 'special';
    name: string;
    description: string;
    icon: string;
    requirement: number;
    unlockedAt?: string;
    xpReward: number;
}

// Challenge Types
export interface Challenge {
    id: string;
    title: string;
    description: string;
    durationDays: number;
    icon: string;
    phases: {
        title: string;
        description: string;
        range: [number, number]; // [startDay, endDay]
    }[];
    benefits: string[];
}

export interface UserChallenge {
    challengeId: string;
    startDate: string; // ISO date string
    status: 'active' | 'completed' | 'failed';
    currentDay: number;
    lastUpdated: string;
}

// User Stats
export interface UserStats {
    currentStreak: number;
    bestStreak: number;
    totalDaysClean: number;
    totalUrgesLogged: number;
    urgesResisted: number;
    resistanceRate: number; // percentage
    averageMood: number;
    totalXP: number;
    level: number;
    achievements: string[]; // achievement IDs
    activeChallenge: UserChallenge | null;
}

// App Settings
export interface AppSettings {
    theme: 'light' | 'dark' | 'system';
    pinEnabled: boolean;
    biometricEnabled: boolean;
    notificationsEnabled: boolean;
    dailyCheckInReminder: boolean;
    dailyCheckInTime: string; // HH:mm format
    milestoneNotifications: boolean;
    motivationalQuotes: boolean;
    appDisguise: boolean;
    disguiseIcon?: string;
    disguiseName?: string;
    lockTimeout: number; // minutes
}

// Notification
export interface NotificationSettings {
    enabled: boolean;
    dailyCheckIn: {
        enabled: boolean;
        time: string;
    };
    milestones: boolean;
    motivational: boolean;
    urgeReminders: boolean;
}

// Panic Button Intervention Step
export interface InterventionStep {
    id: string;
    type: 'acknowledgment' | 'breathing' | 'grounding' | 'motivation' | 'distraction';
    title: string;
    description: string;
    duration?: number; // seconds
    data?: Record<string, unknown>;
}

// Recovery Milestone
export interface RecoveryMilestone {
    days: number;
    benefit: string;
    category: 'mental' | 'physical' | 'relationships' | 'productivity';
    reached: boolean;
    reachedAt?: string;
}

// Daily Writing Prompt
export interface WritingPrompt {
    id: string;
    text: string;
    category: 'reflection' | 'motivation' | 'gratitude' | 'goals' | 'challenges';
}

// Trigger Pattern Analysis
export interface TriggerPattern {
    trigger: string;
    count: number;
    percentage: number;
    resistanceRate: number;
    peakHour: number;
    peakDay: number; // 0-6, Sunday-Saturday
}

// Time-based Pattern
export interface TimePattern {
    hour: number;
    count: number;
    resistanceRate: number;
}

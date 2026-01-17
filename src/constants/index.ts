// App-wide constants and configuration

export * from './colors';
export * from './typography';
export * from './layout';

// App Info
export const APP_NAME = 'Quittr.app';
export const APP_VERSION = '1.0.0';
export const APP_TAGLINE = '100% Free. 100% Private. Recovery Made Simple.';

// Storage Keys
export const STORAGE_KEYS = {
    // User Data
    USER_PROFILE: '@quittr/user_profile',
    SOBRIETY_START_DATE: '@quittr/sobriety_start_date',
    BEST_STREAK: '@quittr/best_streak',

    // Settings
    SETTINGS: '@quittr/settings',
    THEME_MODE: '@quittr/theme_mode',
    PIN_ENABLED: '@quittr/pin_enabled',
    BIOMETRIC_ENABLED: '@quittr/biometric_enabled',
    NOTIFICATION_SETTINGS: '@quittr/notification_settings',

    // Onboarding
    ONBOARDING_COMPLETE: '@quittr/onboarding_complete',

    // App Lock
    APP_PIN: '@quittr/app_pin',
    LOCK_TIMEOUT: '@quittr/lock_timeout',
} as const;

// Milestone Days (for celebrations and notifications)
export const MILESTONE_DAYS = [
    1, 3, 7, 14, 21, 30, 45, 60, 90, 120, 150, 180, 270, 365, 500, 730, 1000
] as const;

// Urge Intensity Levels
export const URGE_INTENSITY_LEVELS = {
    LOW: { min: 1, max: 3, label: 'Low', color: '#50C878' },
    MEDIUM: { min: 4, max: 6, label: 'Medium', color: '#FFB347' },
    HIGH: { min: 7, max: 10, label: 'High', color: '#FF6B6B' },
} as const;

// Default Triggers (predefined)
export const DEFAULT_TRIGGERS = [
    'Stress',
    'Boredom',
    'Loneliness',
    'Late Night',
    'After Drinking',
    'Social Media',
    'HALT (Hungry/Angry/Lonely/Tired)',
    'Relationship Issues',
    'Work Pressure',
    'Anxiety',
    'Depression',
    'Procrastination',
] as const;

// Mood Options for Daily Check-in
export const MOOD_OPTIONS = [
    { value: 1, label: 'Terrible', emoji: '😢' },
    { value: 2, label: 'Bad', emoji: '😔' },
    { value: 3, label: 'Okay', emoji: '😐' },
    { value: 4, label: 'Good', emoji: '🙂' },
    { value: 5, label: 'Excellent', emoji: '😊' },
] as const;

// Energy Levels
export const ENERGY_OPTIONS = [
    { value: 1, label: 'Exhausted', emoji: '😴' },
    { value: 2, label: 'Low', emoji: '😪' },
    { value: 3, label: 'Normal', emoji: '😊' },
    { value: 4, label: 'Good', emoji: '💪' },
    { value: 5, label: 'Energized', emoji: '⚡' },
] as const;

// Sleep Quality
export const SLEEP_OPTIONS = [
    { value: 1, label: 'Terrible', emoji: '😵' },
    { value: 2, label: 'Poor', emoji: '😫' },
    { value: 3, label: 'Okay', emoji: '😌' },
    { value: 4, label: 'Good', emoji: '😴' },
    { value: 5, label: 'Excellent', emoji: '🌙' },
] as const;

// Recovery Timeline Benefits (Evidence-based)
export const RECOVERY_TIMELINE = [
    { days: 1, benefit: 'Dopamine levels begin to stabilize', category: 'mental' },
    { days: 3, benefit: 'Sleep quality starts improving', category: 'physical' },
    { days: 7, benefit: 'Brain fog begins to clear', category: 'mental' },
    { days: 14, benefit: 'Increased energy and motivation', category: 'physical' },
    { days: 21, benefit: 'New neural pathways forming', category: 'mental' },
    { days: 30, benefit: 'Improved emotional regulation', category: 'mental' },
    { days: 60, benefit: 'Significant dopamine receptor recovery', category: 'mental' },
    { days: 90, benefit: 'Major brain rewiring milestone', category: 'mental' },
    { days: 180, benefit: 'Enhanced relationships and intimacy', category: 'relationships' },
    { days: 365, benefit: 'Full brain chemistry restoration', category: 'mental' },
] as const;

// Challenges Data
export const CHALLENGES = [
    {
        id: '90-day-reboot',
        title: '90-Day Reboot Challenge',
        description: 'Complete the scientifically-designed program to rewire your brain',
        durationDays: 90,
        icon: '🏆',
        phases: [
            {
                title: 'Phase 1: Detox',
                description: 'Days 1-30. Your brain begins adjusting to the absence of the habit.',
                range: [1, 30],
            },
            {
                title: 'Phase 2: Rewiring',
                description: 'Days 31-60. New neural pathways form. Improved focus and stability.',
                range: [31, 60],
            },
            {
                title: 'Phase 3: Transformation',
                description: 'Days 61-90. Reward system rebalances. Renewed life appreciation.',
                range: [61, 90],
            },
        ],
        benefits: [
            'Improved mental clarity',
            'Better emotional regulation',
            'Increased confidence',
            'More time & energy',
            'Healthier relationships',
        ],
    },
] as const;

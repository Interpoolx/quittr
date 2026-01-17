// QUITTR Color System - Dark Theme with Glassmorphism
// Matching the original QUITTR app design

export const Colors = {
    // Primary brand gradient colors
    primary: '#8B5CF6', // Purple
    primaryLight: '#A78BFA',
    primaryDark: '#7C3AED',

    // Secondary/Accent colors
    secondary: '#3B82F6', // Blue
    secondaryLight: '#60A5FA',
    secondaryDark: '#2563EB',

    // Accent/Teal
    accent: '#06B6D4',
    accentLight: '#22D3EE',
    accentDark: '#0891B2',

    // Status colors
    success: '#22C55E',
    successLight: '#4ADE80',
    successDark: '#16A34A',

    warning: '#F59E0B',
    warningLight: '#FBBF24',
    warningDark: '#D97706',

    danger: '#EF4444',
    dangerLight: '#F87171',
    dangerDark: '#DC2626',

    // Gradients (for LinearGradient)
    gradients: {
        primary: ['#8B5CF6', '#3B82F6'], // Purple to Blue
        secondary: ['#3B82F6', '#06B6D4'], // Blue to Teal
        accent: ['#06B6D4', '#22C55E'], // Teal to Green
        danger: ['#EF4444', '#F97316'], // Red to Orange
        success: ['#22C55E', '#06B6D4'], // Green to Teal
        gold: ['#F59E0B', '#EAB308'], // Gold gradient for achievements
        orb: ['#8B5CF6', '#EC4899', '#3B82F6'], // Orb gradient
    },

    // Dark theme (default for QUITTR clone)
    dark: {
        background: '#000000',
        backgroundSecondary: '#0A0A0F',
        backgroundTertiary: '#111118',
        surface: '#16161D',
        surfaceVariant: '#1E1E26',
        surfaceElevated: '#242430',
        border: '#2A2A35',
        borderLight: '#3A3A48',
        textPrimary: '#FFFFFF',
        textSecondary: '#A1A1AA',
        textMuted: '#71717A',
        textDisabled: '#52525B',
        // Glassmorphism
        glass: 'rgba(255, 255, 255, 0.05)',
        glassBorder: 'rgba(255, 255, 255, 0.1)',
        glassHighlight: 'rgba(255, 255, 255, 0.15)',
    },

    // Light theme (alternative)
    light: {
        background: '#FFFFFF',
        backgroundSecondary: '#F9FAFB',
        backgroundTertiary: '#F3F4F6',
        surface: '#FFFFFF',
        surfaceVariant: '#F3F4F6',
        surfaceElevated: '#FFFFFF',
        border: '#E5E7EB',
        borderLight: '#F3F4F6',
        textPrimary: '#111827',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',
        textDisabled: '#D1D5DB',
        glass: 'rgba(0, 0, 0, 0.02)',
        glassBorder: 'rgba(0, 0, 0, 0.05)',
        glassHighlight: 'rgba(0, 0, 0, 0.08)',
    },

    // Glow effects for dark theme
    glow: {
        purple: 'rgba(139, 92, 246, 0.4)',
        blue: 'rgba(59, 130, 246, 0.4)',
        teal: 'rgba(6, 182, 212, 0.4)',
        red: 'rgba(239, 68, 68, 0.5)',
        green: 'rgba(34, 197, 94, 0.4)',
        gold: 'rgba(245, 158, 11, 0.4)',
    },

    // Mood colors
    mood: {
        terrible: '#EF4444',
        bad: '#F97316',
        okay: '#F59E0B',
        good: '#22C55E',
        excellent: '#8B5CF6',
    },

    // Recovery stage colors (for orb)
    recovery: {
        early: '#3B82F6',      // 0-7 days - Blue
        growing: '#8B5CF6',    // 7-30 days - Purple
        strong: '#A855F7',     // 30-60 days - Violet
        thriving: '#EC4899',   // 60-90 days - Pink
        master: '#F59E0B',     // 90+ days - Gold
    },
} as const;

// Helper to get theme colors
export const getThemeColors = (isDark: boolean = true) =>
    isDark ? Colors.dark : Colors.light;

// Typography - Based on PRD Design Specifications
// Headings: Inter Bold (or SF Pro Display on iOS)
// Body: Inter Regular
// Numbers: SF Mono / Roboto Mono

import { Platform } from 'react-native';

export const Fonts = {
    // Font Families
    heading: Platform.select({
        ios: 'SF Pro Display',
        android: 'Inter-Bold',
        default: 'System',
    }),
    body: Platform.select({
        ios: 'SF Pro Text',
        android: 'Inter-Regular',
        default: 'System',
    }),
    mono: Platform.select({
        ios: 'SF Mono',
        android: 'RobotoMono-Regular',
        default: 'monospace',
    }),
} as const;

export const FontSizes = {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
} as const;

export const FontWeights = {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
};

export const LineHeights = {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
} as const;

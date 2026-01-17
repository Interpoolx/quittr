// Theme hook for dark/light mode

import { useColorScheme } from 'react-native';
import { useMemo } from 'react';
import { useAppSelector } from './useStore';
import { Colors, getThemeColors, type ColorScheme } from '../constants/colors';

export function useTheme() {
    const systemColorScheme = useColorScheme();
    const themeSetting = useAppSelector((state) => state.settings.app.theme);

    const colorScheme: ColorScheme = useMemo(() => {
        if (themeSetting === 'system') {
            return systemColorScheme === 'dark' ? 'dark' : 'light';
        }
        return themeSetting;
    }, [themeSetting, systemColorScheme]);

    const colors = useMemo(() => getThemeColors(colorScheme), [colorScheme]);

    return {
        colorScheme,
        colors,
        isDark: colorScheme === 'dark',
        isLight: colorScheme === 'light',
        // Common color shortcuts
        primary: Colors.primary,
        secondary: Colors.secondary,
        accent: Colors.accent,
        success: Colors.success,
        danger: Colors.danger,
        warning: Colors.warning,
    };
}

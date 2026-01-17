// Settings State Slice

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppSettings, NotificationSettings } from '../../types';

interface SettingsState {
    app: AppSettings;
    notifications: NotificationSettings;
}

const initialState: SettingsState = {
    app: {
        theme: 'system',
        pinEnabled: false,
        biometricEnabled: false,
        notificationsEnabled: true,
        dailyCheckInReminder: true,
        dailyCheckInTime: '09:00',
        milestoneNotifications: true,
        motivationalQuotes: true,
        appDisguise: false,
        disguiseIcon: undefined,
        disguiseName: undefined,
        lockTimeout: 5,
    },
    notifications: {
        enabled: true,
        dailyCheckIn: {
            enabled: true,
            time: '09:00',
        },
        milestones: true,
        motivational: true,
        urgeReminders: false,
    },
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
            state.app.theme = action.payload;
        },
        setPinEnabled: (state, action: PayloadAction<boolean>) => {
            state.app.pinEnabled = action.payload;
        },
        setBiometricEnabled: (state, action: PayloadAction<boolean>) => {
            state.app.biometricEnabled = action.payload;
        },
        setNotificationsEnabled: (state, action: PayloadAction<boolean>) => {
            state.app.notificationsEnabled = action.payload;
            state.notifications.enabled = action.payload;
        },
        setDailyCheckInReminder: (state, action: PayloadAction<boolean>) => {
            state.app.dailyCheckInReminder = action.payload;
            state.notifications.dailyCheckIn.enabled = action.payload;
        },
        setDailyCheckInTime: (state, action: PayloadAction<string>) => {
            state.app.dailyCheckInTime = action.payload;
            state.notifications.dailyCheckIn.time = action.payload;
        },
        setMilestoneNotifications: (state, action: PayloadAction<boolean>) => {
            state.app.milestoneNotifications = action.payload;
            state.notifications.milestones = action.payload;
        },
        setMotivationalQuotes: (state, action: PayloadAction<boolean>) => {
            state.app.motivationalQuotes = action.payload;
            state.notifications.motivational = action.payload;
        },
        setAppDisguise: (state, action: PayloadAction<boolean>) => {
            state.app.appDisguise = action.payload;
        },
        setDisguiseDetails: (state, action: PayloadAction<{ icon?: string; name?: string }>) => {
            state.app.disguiseIcon = action.payload.icon;
            state.app.disguiseName = action.payload.name;
        },
        setLockTimeout: (state, action: PayloadAction<number>) => {
            state.app.lockTimeout = action.payload;
        },
        updateAppSettings: (state, action: PayloadAction<Partial<AppSettings>>) => {
            state.app = { ...state.app, ...action.payload };
        },
        updateNotificationSettings: (state, action: PayloadAction<Partial<NotificationSettings>>) => {
            state.notifications = { ...state.notifications, ...action.payload };
        },
        resetSettings: () => initialState,
    },
});

export const {
    setTheme,
    setPinEnabled,
    setBiometricEnabled,
    setNotificationsEnabled,
    setDailyCheckInReminder,
    setDailyCheckInTime,
    setMilestoneNotifications,
    setMotivationalQuotes,
    setAppDisguise,
    setDisguiseDetails,
    setLockTimeout,
    updateAppSettings,
    updateNotificationSettings,
    resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;

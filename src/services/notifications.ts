// Push Notification Service for Quittr
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

// Request notification permissions
export async function requestNotificationPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
        console.log('Must use physical device for Push Notifications');
        return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Failed to get notification permissions');
        return false;
    }

    // Android specific notification channel
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'Quittr Notifications',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#8B5CF6',
        });

        await Notifications.setNotificationChannelAsync('reminders', {
            name: 'Daily Reminders',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#3B82F6',
        });

        await Notifications.setNotificationChannelAsync('milestones', {
            name: 'Milestone Celebrations',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 500, 200, 500],
            lightColor: '#22C55E',
        });
    }

    return true;
}

// Schedule daily check-in reminder
export async function scheduleDailyCheckInReminder(hour: number = 20, minute: number = 0): Promise<string | null> {
    // Cancel existing reminders
    await cancelDailyCheckInReminder();

    const trigger: Notifications.NotificationTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
    };

    try {
        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: '🌱 Daily Check-in',
                body: 'How are you feeling today? Take a moment to log your mood and progress.',
                data: { screen: 'journal' },
                sound: true,
            },
            trigger,
        });
        return id;
    } catch (error) {
        console.error('Failed to schedule daily reminder:', error);
        return null;
    }
}

// Cancel daily check-in reminder
export async function cancelDailyCheckInReminder(): Promise<void> {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of notifications) {
        if (notification.content.title?.includes('Daily Check-in')) {
            await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
    }
}

// Schedule milestone notification
export async function scheduleMilestoneNotification(days: number, delaySeconds: number): Promise<string | null> {
    const milestoneMessages: Record<number, string> = {
        1: "🎉 Congratulations on your first day! You've taken the first step.",
        3: "💪 3 days strong! You're building momentum.",
        7: "🌟 One week! Your brain is already starting to heal.",
        14: "🔥 Two weeks! You're proving to yourself that you can do this.",
        21: "🧠 Three weeks! New neural pathways are forming.",
        30: "🏆 One month! This is a major milestone. Be proud!",
        60: "⭐ Two months! You're truly transforming.",
        90: "🎊 90 DAYS! You've completed the reboot. You're a champion!",
    };

    const message = milestoneMessages[days];
    if (!message) return null;

    try {
        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: `🏆 ${days}-Day Milestone!`,
                body: message,
                data: { screen: 'profile', milestone: days },
                sound: true,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: delaySeconds,
            },
        });
        return id;
    } catch (error) {
        console.error('Failed to schedule milestone notification:', error);
        return null;
    }
}

// Send immediate motivation notification
export async function sendMotivationNotification(): Promise<void> {
    const motivations = [
        "You're stronger than your urges. This will pass.",
        "Remember why you started. Your future self will thank you.",
        "Every moment of resistance makes you stronger.",
        "You've come so far. Don't give up now.",
        "Take a deep breath. You've got this.",
    ];

    const randomMessage = motivations[Math.floor(Math.random() * motivations.length)];

    await Notifications.scheduleNotificationAsync({
        content: {
            title: '💪 Stay Strong',
            body: randomMessage,
            sound: true,
        },
        trigger: null, // Immediate
    });
}

// Cancel all scheduled notifications
export async function cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
}

// Get all scheduled notifications
export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
}

// Add notification listeners
export function addNotificationListeners(
    onNotificationReceived: (notification: Notifications.Notification) => void,
    onNotificationResponse: (response: Notifications.NotificationResponse) => void
) {
    const receivedSubscription = Notifications.addNotificationReceivedListener(onNotificationReceived);
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(onNotificationResponse);

    return () => {
        receivedSubscription.remove();
        responseSubscription.remove();
    };
}

export default {
    requestNotificationPermissions,
    scheduleDailyCheckInReminder,
    cancelDailyCheckInReminder,
    scheduleMilestoneNotification,
    sendMotivationNotification,
    cancelAllNotifications,
    getScheduledNotifications,
    addNotificationListeners,
};

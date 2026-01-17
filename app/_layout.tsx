// Root Layout - App entry with providers, onboarding, notifications, and database
import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { store, persistor } from '../src/store';
import { Colors } from '../src/constants/colors';
import { useAppSelector } from '../src/hooks/useStore';
// Note: Database is dynamically imported only on native to avoid web bundling issues
import {
    requestNotificationPermissions,
    scheduleDailyCheckInReminder,
    addNotificationListeners
} from '../src/services/notifications';

// Loading component for PersistGate
function LoadingScreen() {
    return (
        <View style={styles.loadingContainer}>
            <Text style={styles.loadingEmoji}>🌱</Text>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading your journey...</Text>
        </View>
    );
}

// App initialization hook
function useAppInitialization() {
    const [initialized, setInitialized] = useState(false);
    const settings = useAppSelector((state) => state.settings.app);

    useEffect(() => {
        async function init() {
            try {
                // Initialize SQLite database (only on native - dynamic import to avoid web bundling)
                if (Platform.OS !== 'web') {
                    const { initDatabase } = await import('../src/services/database');
                    await initDatabase();
                    console.log('Database initialized');
                }

                // Request notification permissions
                const hasPermission = await requestNotificationPermissions();

                // Schedule daily check-in reminder if enabled
                if (hasPermission && settings.dailyCheckInReminder) {
                    await scheduleDailyCheckInReminder(20, 0); // 8 PM
                    console.log('Daily reminder scheduled');
                }

                setInitialized(true);
            } catch (error) {
                console.error('App initialization error:', error);
                setInitialized(true); // Continue anyway
            }
        }

        init();

        // Set up notification listeners
        const cleanup = addNotificationListeners(
            (notification) => {
                console.log('Notification received:', notification);
            },
            (response) => {
                const screen = response.notification.request.content.data?.screen;
                console.log('Notification tapped, navigate to:', screen);
                // Navigation would happen here if needed
            }
        );

        return cleanup;
    }, [settings.dailyCheckInReminder]);

    return initialized;
}

// Navigation guard for onboarding
function NavigationGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const segments = useSegments();
    const isOnboarded = useAppSelector((state) => state.user.isOnboarded);
    const profile = useAppSelector((state) => state.user.profile);
    const [isReady, setIsReady] = useState(false);
    const initialized = useAppInitialization();

    useEffect(() => {
        // Wait for app initialization and redux-persist
        if (initialized) {
            const timer = setTimeout(() => setIsReady(true), 100);
            return () => clearTimeout(timer);
        }
    }, [initialized]);

    useEffect(() => {
        if (!isReady) return;

        const inOnboarding = segments[0] === 'onboarding';

        // If not onboarded and not on onboarding screen, redirect
        if (!isOnboarded && !inOnboarding) {
            router.replace('/onboarding');
        }
    }, [isReady, isOnboarded, segments, router]);

    if (!isReady) {
        return <LoadingScreen />;
    }

    return <>{children}</>;
}

// Inner layout with navigation guard
function InnerLayout() {
    return (
        <NavigationGuard>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="onboarding"
                    options={{
                        headerShown: false,
                        presentation: 'modal',
                        animation: 'slide_from_bottom',
                    }}
                />
            </Stack>
        </NavigationGuard>
    );
}

export default function RootLayout() {
    return (
        <Provider store={store}>
            <PersistGate loading={<LoadingScreen />} persistor={persistor}>
                <InnerLayout />
            </PersistGate>
        </Provider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.dark.background,
    },
    loadingEmoji: {
        fontSize: 60,
        marginBottom: 24,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: Colors.dark.textSecondary,
    },
});

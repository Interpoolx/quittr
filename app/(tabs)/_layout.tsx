// Tab Layout - Quittr.app with Professional Navigation
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Colors } from '../../src/constants/colors';
import { APP_NAME } from '../../src/constants';

// Professional icon component with emoji icons
function TabIcon({ icon, color, focused }: { icon: string; color: string; focused: boolean }) {
    return (
        <View style={[
            styles.iconBox,
            focused && { backgroundColor: color + '25', borderColor: color }
        ]}>
            <Text style={[styles.iconText, focused && { opacity: 1 }]}>{icon}</Text>
        </View>
    );
}

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: Colors.dark.background,
                    borderBottomWidth: 0,
                    elevation: 0,
                    shadowOpacity: 0,
                    height: 60,
                },
                headerTitleStyle: {
                    color: Colors.primary,
                    fontWeight: '700',
                    fontSize: 20,
                },
                headerTitle: APP_NAME,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.dark.textMuted,
                tabBarShowLabel: true,
                tabBarLabelStyle: styles.tabBarLabel,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="🏠" color="#8B5CF6" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="urges"
                options={{
                    title: 'Track',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="📊" color="#3B82F6" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="panic"
                options={{
                    title: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.sosWrapper}>
                            <View style={[styles.sosButton, focused && styles.sosButtonFocused]}>
                                <Text style={styles.sosText}>SOS</Text>
                            </View>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="learn"
                options={{
                    title: 'Learn',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="📚" color="#22C55E" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="👤" color="#F59E0B" focused={focused} />
                    ),
                }}
            />
            {/* Hidden tabs */}
            <Tabs.Screen
                name="journal"
                options={{
                    href: null,
                    title: 'Journal',
                }}
            />
            <Tabs.Screen
                name="community"
                options={{
                    href: null,
                    title: 'Community',
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: Colors.dark.surface,
        borderTopWidth: 1,
        borderTopColor: Colors.dark.border,
        height: Platform.OS === 'ios' ? 88 : 70,
        paddingTop: 8,
        paddingBottom: Platform.OS === 'ios' ? 28 : 10,
        paddingHorizontal: 4,
    },
    tabBarLabel: {
        fontSize: 10,
        fontWeight: '600',
        marginTop: 2,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    iconText: {
        fontSize: 24,
        opacity: 0.6,
    },
    sosWrapper: {
        position: 'absolute',
        top: -20,
    },
    sosButton: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: Colors.danger,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.danger,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 3,
        borderColor: Colors.dark.surface,
    },
    sosButtonFocused: {
        shadowOpacity: 0.8,
        transform: [{ scale: 1.08 }],
    },
    sosText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
});

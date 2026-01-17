// Profile Screen - QUITTR Dark Theme with Orb Achievements
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
    Modal,
    TextInput,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../../src/hooks/useStore';
import { setTheme, setPinEnabled, setBiometricEnabled, setDailyCheckInReminder, setMilestoneNotifications, setAppDisguise, setDisguiseDetails } from '../../src/store/slices/settingsSlice';
import { resetUser } from '../../src/store/slices/userSlice';
import { clearAllUrges } from '../../src/store/slices/urgesSlice';
import { clearJournal } from '../../src/store/slices/journalSlice';
import { resetAchievements } from '../../src/store/slices/achievementsSlice';
import { Colors } from '../../src/constants/colors';
import { Spacing, BorderRadius } from '../../src/constants/layout';
import { FontSizes, FontWeights } from '../../src/constants/typography';
import { APP_NAME, APP_VERSION } from '../../src/constants';

const DISGUISE_OPTIONS = [
    { id: 'calculator', name: 'Calculator', icon: '🧮' },
    { id: 'notes', name: 'Notes', icon: '📝' },
    { id: 'weather', name: 'Weather', icon: '☀️' },
    { id: 'fitness', name: 'Fitness', icon: '💪' },
    { id: 'compass', name: 'Compass', icon: '🧭' },
];

export default function ProfileScreen() {
    const dispatch = useAppDispatch();
    const stats = useAppSelector((state) => state.user.stats);
    const settings = useAppSelector((state) => state.settings.app);
    const achievements = useAppSelector((state) => state.achievements);

    // Modal states
    const [showPinModal, setShowPinModal] = useState(false);
    const [showDisguiseModal, setShowDisguiseModal] = useState(false);
    const [pinValue, setPinValue] = useState('');
    const [confirmPinValue, setConfirmPinValue] = useState('');
    const [pinStep, setPinStep] = useState<'enter' | 'confirm'>('enter');
    const [selectedDisguise, setSelectedDisguise] = useState(settings.disguiseIcon || '');

    const unlockedAchievements = achievements.all.filter(a =>
        achievements.unlocked.includes(a.id)
    ).slice(0, 4);

    const handlePinToggle = (value: boolean) => {
        if (value) {
            // Show PIN setup modal
            setShowPinModal(true);
            setPinStep('enter');
            setPinValue('');
            setConfirmPinValue('');
        } else {
            // Disable PIN
            dispatch(setPinEnabled(false));
            Alert.alert('PIN Disabled', 'Your app PIN has been removed.');
        }
    };

    const handlePinSubmit = () => {
        if (pinStep === 'enter') {
            if (pinValue.length < 4) {
                Alert.alert('Invalid PIN', 'Please enter at least 4 digits.');
                return;
            }
            setPinStep('confirm');
        } else {
            if (pinValue !== confirmPinValue) {
                Alert.alert('PIN Mismatch', 'PINs do not match. Please try again.');
                setPinStep('enter');
                setPinValue('');
                setConfirmPinValue('');
                return;
            }
            // Save PIN (in real app, this would be hashed/secured)
            dispatch(setPinEnabled(true));
            setShowPinModal(false);
            Alert.alert('PIN Set', 'Your app is now protected with a PIN.');
        }
    };

    const handleDisguiseSelect = (id: string) => {
        const disguise = DISGUISE_OPTIONS.find(d => d.id === id);
        if (disguise) {
            setSelectedDisguise(disguise.icon);
            dispatch(setAppDisguise(true));
            dispatch(setDisguiseDetails({ icon: disguise.icon, name: disguise.name }));
            setShowDisguiseModal(false);
            Alert.alert('Disguise Applied', `Your app will appear as "${disguise.name}" on your home screen.`);
        }
    };

    const handleDisguiseDisable = () => {
        dispatch(setAppDisguise(false));
        dispatch(setDisguiseDetails({ icon: undefined, name: undefined }));
        setShowDisguiseModal(false);
        Alert.alert('Disguise Removed', 'Your app will show its normal icon.');
    };

    const handleDeleteAllData = () => {
        Alert.alert(
            'Delete All Data',
            'This will permanently delete all your data. This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete Everything',
                    style: 'destructive',
                    onPress: () => {
                        dispatch(resetUser());
                        dispatch(clearAllUrges());
                        dispatch(clearJournal());
                        dispatch(resetAchievements());
                    }
                }
            ]
        );
    };

    // Get recovery color based on streak
    const getRecoveryColor = () => {
        if (stats.currentStreak >= 90) return Colors.recovery.master;
        if (stats.currentStreak >= 60) return Colors.recovery.thriving;
        if (stats.currentStreak >= 30) return Colors.recovery.strong;
        if (stats.currentStreak >= 7) return Colors.recovery.growing;
        return Colors.recovery.early;
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <Text style={styles.title}>Profile</Text>

                {/* Level Card */}
                <View style={[styles.levelCard, { borderColor: getRecoveryColor() + '40' }]}>
                    <View style={styles.levelHeader}>
                        <View style={[styles.levelBadge, { backgroundColor: getRecoveryColor() + '30', borderColor: getRecoveryColor() }]}>
                            <Text style={[styles.levelNumber, { color: getRecoveryColor() }]}>Lv.{stats.level}</Text>
                        </View>
                        <View style={styles.xpInfo}>
                            <Text style={styles.xpLabel}>Experience Points</Text>
                            <Text style={styles.xpText}>{stats.totalXP % 100} / 100 XP to next level</Text>
                            <View style={styles.xpBar}>
                                <View style={[styles.xpFill, { width: `${stats.totalXP % 100}%`, backgroundColor: getRecoveryColor() }]} />
                            </View>
                        </View>
                    </View>

                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats.totalXP}</Text>
                            <Text style={styles.statLabel}>Total XP</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats.currentStreak}</Text>
                            <Text style={styles.statLabel}>Days Clean</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats.urgesResisted}</Text>
                            <Text style={styles.statLabel}>Resisted</Text>
                        </View>
                    </View>
                </View>

                {/* Achievement Orbs */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Achievement Orbs</Text>
                    <Text style={styles.achievementCount}>{achievements.unlocked.length}/{achievements.all.length}</Text>
                </View>

                <View style={styles.orbsContainer}>
                    {unlockedAchievements.length > 0 ? (
                        unlockedAchievements.map((achievement) => (
                            <View key={achievement.id} style={styles.orbCard}>
                                <View style={[styles.orb, { shadowColor: Colors.primary }]}>
                                    <Text style={styles.orbIcon}>{achievement.icon}</Text>
                                </View>
                                <Text style={styles.orbName}>{achievement.name}</Text>
                                <Text style={styles.orbXP}>+{achievement.xpReward}</Text>
                            </View>
                        ))
                    ) : (
                        <>
                            {[1, 2, 3, 4].map((i) => (
                                <View key={i} style={styles.orbCard}>
                                    <View style={[styles.orb, styles.orbLocked]}>
                                        <Text style={styles.orbIconLocked}>🔒</Text>
                                    </View>
                                    <Text style={styles.orbNameLocked}>Locked</Text>
                                </View>
                            ))}
                        </>
                    )}
                </View>

                {/* Settings */}
                <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Settings</Text>

                {/* Privacy Settings */}
                <View style={styles.settingsGroup}>
                    <Text style={styles.settingsGroupTitle}>Privacy & Security</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingIcon}>🔐</Text>
                            <Text style={styles.settingLabel}>PIN Lock</Text>
                        </View>
                        <Switch
                            value={settings.pinEnabled}
                            onValueChange={handlePinToggle}
                            trackColor={{ false: Colors.dark.border, true: Colors.primary }}
                            thumbColor={'#FFFFFF'}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingIcon}>👆</Text>
                            <Text style={styles.settingLabel}>Biometric Lock</Text>
                        </View>
                        <Switch
                            value={settings.biometricEnabled}
                            onValueChange={(value) => { dispatch(setBiometricEnabled(value)); }}
                            trackColor={{ false: Colors.dark.border, true: Colors.primary }}
                            thumbColor={'#FFFFFF'}
                        />
                    </View>

                    <TouchableOpacity style={styles.settingItem} onPress={() => setShowDisguiseModal(true)}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingIcon}>🎭</Text>
                            <Text style={styles.settingLabel}>App Disguise</Text>
                        </View>
                        <Text style={styles.settingValue}>{settings.appDisguise ? settings.disguiseName || 'On' : 'Off'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Notification Settings */}
                <View style={styles.settingsGroup}>
                    <Text style={styles.settingsGroupTitle}>Notifications</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingIcon}>🔔</Text>
                            <Text style={styles.settingLabel}>Daily Check-in Reminder</Text>
                        </View>
                        <Switch
                            value={settings.dailyCheckInReminder}
                            onValueChange={(value) => { dispatch(setDailyCheckInReminder(value)); }}
                            trackColor={{ false: Colors.dark.border, true: Colors.primary }}
                            thumbColor={'#FFFFFF'}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingIcon}>🏆</Text>
                            <Text style={styles.settingLabel}>Milestone Notifications</Text>
                        </View>
                        <Switch
                            value={settings.milestoneNotifications}
                            onValueChange={(value) => { dispatch(setMilestoneNotifications(value)); }}
                            trackColor={{ false: Colors.dark.border, true: Colors.primary }}
                            thumbColor={'#FFFFFF'}
                        />
                    </View>
                </View>

                {/* Data */}
                <View style={styles.settingsGroup}>
                    <Text style={styles.settingsGroupTitle}>Data</Text>

                    <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Export', 'Coming soon!')}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingIcon}>📤</Text>
                            <Text style={styles.settingLabel}>Export Data</Text>
                        </View>
                        <Text style={styles.settingArrow}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.settingItem, styles.dangerItem]} onPress={handleDeleteAllData}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingIcon}>🗑️</Text>
                            <Text style={[styles.settingLabel, styles.dangerText]}>Delete All Data</Text>
                        </View>
                        <Text style={styles.settingArrow}>→</Text>
                    </TouchableOpacity>
                </View>

                {/* App Info */}
                <View style={styles.appInfo}>
                    <Text style={styles.appName}>{APP_NAME}</Text>
                    <Text style={styles.appVersion}>Version {APP_VERSION}</Text>
                    <Text style={styles.appTagline}>100% Free. 100% Private.</Text>
                </View>
            </ScrollView>

            {/* PIN Setup Modal */}
            <Modal visible={showPinModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {pinStep === 'enter' ? 'Set Your PIN' : 'Confirm PIN'}
                            </Text>
                            <TouchableOpacity onPress={() => setShowPinModal(false)}>
                                <Text style={styles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalBody}>
                            <Text style={styles.modalDescription}>
                                {pinStep === 'enter'
                                    ? 'Enter a 4-6 digit PIN to protect your app'
                                    : 'Re-enter your PIN to confirm'}
                            </Text>
                            <TextInput
                                style={styles.pinInput}
                                value={pinStep === 'enter' ? pinValue : confirmPinValue}
                                onChangeText={pinStep === 'enter' ? setPinValue : setConfirmPinValue}
                                keyboardType="numeric"
                                secureTextEntry
                                maxLength={6}
                                placeholder="● ● ● ●"
                                placeholderTextColor={Colors.dark.textMuted}
                                autoFocus
                            />
                        </View>
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonPrimary]}
                                onPress={handlePinSubmit}
                            >
                                <Text style={styles.modalButtonText}>
                                    {pinStep === 'enter' ? 'Continue' : 'Set PIN'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* App Disguise Modal */}
            <Modal visible={showDisguiseModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>App Disguise</Text>
                            <TouchableOpacity onPress={() => setShowDisguiseModal(false)}>
                                <Text style={styles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalBody}>
                            <Text style={styles.modalDescription}>
                                Choose an icon to disguise your app on the home screen
                            </Text>
                            <View style={styles.disguiseGrid}>
                                {DISGUISE_OPTIONS.map((option) => (
                                    <TouchableOpacity
                                        key={option.id}
                                        style={[
                                            styles.disguiseOption,
                                            settings.disguiseIcon === option.icon && styles.disguiseOptionActive
                                        ]}
                                        onPress={() => handleDisguiseSelect(option.id)}
                                    >
                                        <Text style={styles.disguiseIcon}>{option.icon}</Text>
                                        <Text style={styles.disguiseName}>{option.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                        {settings.appDisguise && (
                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.modalButtonDanger]}
                                    onPress={handleDisguiseDisable}
                                >
                                    <Text style={styles.modalButtonText}>Remove Disguise</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    scrollContent: {
        paddingHorizontal: Spacing.md,
        paddingTop: 60,
        paddingBottom: 100,
    },
    title: {
        fontSize: FontSizes['2xl'],
        fontWeight: FontWeights.bold,
        color: Colors.dark.textPrimary,
        marginBottom: Spacing.lg,
    },
    levelCard: {
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    levelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    levelBadge: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
        borderWidth: 2,
    },
    levelNumber: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
    },
    xpInfo: {
        flex: 1,
    },
    xpLabel: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textSecondary,
        marginBottom: Spacing.xs,
    },
    xpText: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textPrimary,
        marginBottom: Spacing.sm,
    },
    xpBar: {
        height: 8,
        backgroundColor: Colors.dark.surfaceVariant,
        borderRadius: BorderRadius.full,
        overflow: 'hidden',
    },
    xpFill: {
        height: '100%',
        borderRadius: BorderRadius.full,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.dark.border,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
        color: Colors.dark.textPrimary,
    },
    statLabel: {
        fontSize: FontSizes.xs,
        color: Colors.dark.textSecondary,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.semibold,
        color: Colors.dark.textPrimary,
    },
    achievementCount: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textSecondary,
    },
    orbsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.md,
    },
    orbCard: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    orb: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.dark.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.xs,
        borderWidth: 2,
        borderColor: Colors.primary + '40',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    orbLocked: {
        borderColor: Colors.dark.border,
        backgroundColor: Colors.dark.surfaceVariant,
    },
    orbIcon: {
        fontSize: 28,
    },
    orbIconLocked: {
        fontSize: 20,
        opacity: 0.5,
    },
    orbName: {
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.medium,
        color: Colors.dark.textPrimary,
        textAlign: 'center',
    },
    orbNameLocked: {
        fontSize: FontSizes.xs,
        color: Colors.dark.textMuted,
        textAlign: 'center',
    },
    orbXP: {
        fontSize: FontSizes.xs,
        color: Colors.primary,
        fontWeight: FontWeights.medium,
    },
    settingsGroup: {
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        overflow: 'hidden',
    },
    settingsGroupTitle: {
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.semibold,
        color: Colors.dark.textSecondary,
        padding: Spacing.md,
        paddingBottom: Spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.dark.border,
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingIcon: {
        fontSize: 20,
        marginRight: Spacing.md,
    },
    settingLabel: {
        fontSize: FontSizes.base,
        color: Colors.dark.textPrimary,
    },
    settingValue: {
        fontSize: FontSizes.base,
        color: Colors.dark.textSecondary,
    },
    settingArrow: {
        fontSize: FontSizes.base,
        color: Colors.dark.textSecondary,
    },
    dangerItem: {
        backgroundColor: Colors.danger + '10',
    },
    dangerText: {
        color: Colors.danger,
    },
    appInfo: {
        alignItems: 'center',
        paddingVertical: Spacing.lg,
    },
    appName: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        color: Colors.primary,
    },
    appVersion: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textSecondary,
        marginBottom: Spacing.xs,
    },
    appTagline: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textMuted,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.dark.surface,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
    },
    modalTitle: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
        color: Colors.dark.textPrimary,
    },
    modalClose: {
        fontSize: FontSizes.xl,
        color: Colors.dark.textSecondary,
        padding: Spacing.sm,
    },
    modalBody: {
        padding: Spacing.lg,
    },
    modalDescription: {
        fontSize: FontSizes.base,
        color: Colors.dark.textSecondary,
        marginBottom: Spacing.lg,
        textAlign: 'center',
    },
    modalActions: {
        padding: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.dark.border,
    },
    modalButton: {
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
    },
    modalButtonPrimary: {
        backgroundColor: Colors.primary,
    },
    modalButtonDanger: {
        backgroundColor: Colors.danger,
    },
    modalButtonText: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.semibold,
        color: '#FFFFFF',
    },
    pinInput: {
        backgroundColor: Colors.dark.surfaceVariant,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        fontSize: FontSizes.xl,
        color: Colors.dark.textPrimary,
        textAlign: 'center',
        letterSpacing: 12,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    disguiseGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: Spacing.md,
    },
    disguiseOption: {
        width: 80,
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        backgroundColor: Colors.dark.surfaceVariant,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    disguiseOptionActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary + '20',
    },
    disguiseIcon: {
        fontSize: 32,
        marginBottom: Spacing.xs,
    },
    disguiseName: {
        fontSize: FontSizes.xs,
        color: Colors.dark.textPrimary,
        textAlign: 'center',
    },
});

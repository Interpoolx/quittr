// Dashboard Screen - QUITTR Dark Theme with Ring Timer
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../../src/hooks/useStore';
import { Colors } from '../../src/constants/colors';
import { Spacing, BorderRadius } from '../../src/constants/layout';
import { FontSizes, FontWeights } from '../../src/constants/typography';
import { MILESTONE_DAYS, CHALLENGES } from '../../src/constants';
import { differenceInSeconds } from 'date-fns';
import { RecoveryOrb } from '../../src/components/RecoveryOrb';

const { width } = Dimensions.get('window');
const RING_SIZE = width * 0.7;

export default function DashboardScreen() {
    const router = useRouter();
    const profile = useAppSelector((state) => state.user.profile);
    const stats = useAppSelector((state) => state.user.stats);

    const [streak, setStreak] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    // Profile will be set by onboarding, no need to create here

    // Real-time counter
    useEffect(() => {
        if (!profile?.sobrietyStartDate) return;

        const updateCounter = () => {
            const startDate = new Date(profile.sobrietyStartDate);
            const now = new Date();
            const totalSeconds = Math.max(0, differenceInSeconds(now, startDate));

            const days = Math.floor(totalSeconds / 86400);
            const hours = Math.floor((totalSeconds % 86400) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            setStreak({ days, hours, minutes, seconds });
        };

        updateCounter();
        const interval = setInterval(updateCounter, 1000);
        return () => clearInterval(interval);
    }, [profile?.sobrietyStartDate]);

    // Calculate progress for ring (0-100 based on next milestone)
    const nextMilestone = MILESTONE_DAYS.find(d => d > streak.days) || 90;
    const prevMilestone = MILESTONE_DAYS.filter(d => d <= streak.days).pop() || 0;
    const progressPercent = Math.min(
        ((streak.days - prevMilestone) / (nextMilestone - prevMilestone)) * 100,
        100
    );

    // Get recovery stage color
    const getRecoveryColor = () => {
        if (streak.days >= 90) return Colors.recovery.master;
        if (streak.days >= 60) return Colors.recovery.thriving;
        if (streak.days >= 30) return Colors.recovery.strong;
        if (streak.days >= 7) return Colors.recovery.growing;
        return Colors.recovery.early;
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.greeting}>Welcome back</Text>
                    <Text style={styles.title}>Your Recovery</Text>
                </View>

                {/* Main Ring Timer */}
                <View style={styles.ringContainer}>
                    {/* Outer glow */}
                    <View style={[styles.ringGlow, { shadowColor: getRecoveryColor() }]} />

                    {/* Progress ring background */}
                    <View style={styles.ringBackground}>
                        {/* Progress arc - simplified as a border animation would need SVG */}
                        <View style={[
                            styles.progressRing,
                            { borderColor: getRecoveryColor() }
                        ]} />

                        {/* Inner content */}
                        <View style={styles.ringContent}>
                            {/* Days count */}
                            <Text style={styles.daysNumber}>{streak.days}</Text>
                            <Text style={styles.daysLabel}>days clean</Text>

                            {/* Time display */}
                            <View style={styles.timeRow}>
                                <View style={styles.timeItem}>
                                    <Text style={styles.timeNumber}>{String(streak.hours).padStart(2, '0')}</Text>
                                    <Text style={styles.timeLabel}>hrs</Text>
                                </View>
                                <Text style={styles.timeSeparator}>:</Text>
                                <View style={styles.timeItem}>
                                    <Text style={styles.timeNumber}>{String(streak.minutes).padStart(2, '0')}</Text>
                                    <Text style={styles.timeLabel}>min</Text>
                                </View>
                                <Text style={styles.timeSeparator}>:</Text>
                                <View style={styles.timeItem}>
                                    <Text style={styles.timeNumber}>{String(streak.seconds).padStart(2, '0')}</Text>
                                    <Text style={styles.timeLabel}>sec</Text>
                                </View>
                            </View>

                            {/* Progress percentage */}
                            <View style={styles.progressBadge}>
                                <Text style={styles.progressText}>{Math.round(progressPercent)}%</Text>
                                <Text style={styles.progressLabel}>to {nextMilestone}d</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Quick Actions Grid */}
                <View style={styles.actionsGrid}>
                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => router.push('/(tabs)/urges')}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: Colors.secondary + '20' }]}>
                            <Text style={styles.actionEmoji}>📝</Text>
                        </View>
                        <Text style={styles.actionText}>Log Urge</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => router.push('/(tabs)/journal')}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: Colors.accent + '20' }]}>
                            <Text style={styles.actionEmoji}>✍️</Text>
                        </View>
                        <Text style={styles.actionText}>Journal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => router.push('/(tabs)/panic')}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: Colors.primary + '20' }]}>
                            <Text style={styles.actionEmoji}>🧘</Text>
                        </View>
                        <Text style={styles.actionText}>Breathe</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => router.push('/(tabs)/profile')}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: Colors.success + '20' }]}>
                            <Text style={styles.actionEmoji}>🏆</Text>
                        </View>
                        <Text style={styles.actionText}>Stats</Text>
                    </TouchableOpacity>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <TouchableOpacity style={styles.statCard} onPress={() => router.push('/(tabs)/urges')}>
                        <Text style={styles.statNumber}>{stats.urgesResisted}</Text>
                        <Text style={styles.statLabel}>Urges Resisted</Text>
                    </TouchableOpacity>
                    <View style={[styles.statCard, styles.statCardHighlight]}>
                        <Text style={styles.statNumberHighlight}>Lv.{stats.level}</Text>
                        <Text style={styles.statLabelHighlight}>Your Level</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{stats.totalXP}</Text>
                        <Text style={styles.statLabel}>Total XP</Text>
                    </View>
                </View>

                {/* Active Challenge Card */}
                {stats.activeChallenge && stats.activeChallenge.status === 'active' && (
                    <TouchableOpacity
                        style={styles.challengeCard}
                        onPress={() => router.push('/(tabs)/challenges')}
                    >
                        <View style={styles.challengeHeader}>
                            <View style={styles.challengeInfo}>
                                <Text style={styles.challengeLabel}>Active Challenge</Text>
                                <Text style={styles.challengeName}>
                                    {CHALLENGES.find(c => c.id === stats.activeChallenge?.challengeId)?.title || '90-Day Reboot'}
                                </Text>
                            </View>
                            <Text style={styles.challengeDay}>Day {stats.activeChallenge.currentDay}/90</Text>
                        </View>
                        <View style={styles.challengeProgressBar}>
                            <View
                                style={[
                                    styles.challengeProgressFill,
                                    { width: `${Math.min(100, (stats.activeChallenge.currentDay / 90) * 100)}%` }
                                ]}
                            />
                        </View>
                        <Text style={styles.challengeStatus}>
                            You are in {stats.activeChallenge.currentDay <= 30 ? 'Phase 1: Detox' : stats.activeChallenge.currentDay <= 60 ? 'Phase 2: Rewiring' : 'Phase 3: Transformation'}
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Milestone Card */}
                <View style={styles.milestoneCard}>
                    <View style={styles.milestoneHeader}>
                        <Text style={styles.milestoneEmoji}>🎯</Text>
                        <Text style={styles.milestoneTitle}>Next Milestone</Text>
                    </View>
                    <Text style={styles.milestoneText}>
                        {nextMilestone - streak.days} days until your {nextMilestone}-day milestone
                    </Text>
                    <View style={styles.milestoneBar}>
                        <View style={[styles.milestoneFill, { width: `${progressPercent}%` }]} />
                    </View>
                </View>

                {/* Motivational Quote */}
                <View style={styles.quoteCard}>
                    <Text style={styles.quoteText}>
                        "Every day is a new opportunity to become the person you want to be."
                    </Text>
                </View>
            </ScrollView>
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
    header: {
        marginBottom: Spacing.lg,
    },
    greeting: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textSecondary,
        marginBottom: 4,
    },
    title: {
        fontSize: FontSizes['2xl'],
        fontWeight: FontWeights.bold,
        color: Colors.dark.textPrimary,
    },

    // Ring Timer Styles
    ringContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: Spacing.xl,
        height: RING_SIZE,
    },
    ringGlow: {
        position: 'absolute',
        width: RING_SIZE - 20,
        height: RING_SIZE - 20,
        borderRadius: RING_SIZE / 2,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 40,
        elevation: 20,
    },
    ringBackground: {
        width: RING_SIZE - 20,
        height: RING_SIZE - 20,
        borderRadius: RING_SIZE / 2,
        backgroundColor: Colors.dark.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    progressRing: {
        position: 'absolute',
        width: RING_SIZE - 20,
        height: RING_SIZE - 20,
        borderRadius: RING_SIZE / 2,
        borderWidth: 4,
        opacity: 0.8,
    },
    ringContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    daysNumber: {
        fontSize: 72,
        fontWeight: FontWeights.bold,
        color: Colors.dark.textPrimary,
        lineHeight: 80,
    },
    daysLabel: {
        fontSize: FontSizes.lg,
        color: Colors.dark.textSecondary,
        marginTop: -8,
        marginBottom: Spacing.md,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeItem: {
        alignItems: 'center',
        minWidth: 40,
    },
    timeNumber: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.semibold,
        color: Colors.dark.textPrimary,
        fontVariant: ['tabular-nums'],
    },
    timeLabel: {
        fontSize: FontSizes.xs,
        color: Colors.dark.textMuted,
    },
    timeSeparator: {
        fontSize: FontSizes.xl,
        color: Colors.dark.textMuted,
        marginHorizontal: 4,
    },
    progressBadge: {
        marginTop: Spacing.md,
        backgroundColor: Colors.dark.surfaceVariant,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressText: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.bold,
        color: Colors.primary,
        marginRight: 4,
    },
    progressLabel: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textSecondary,
    },

    // Actions Grid - 2x2 matching reference design
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
        gap: Spacing.md,
    },
    actionCard: {
        width: '47%',
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.xl,
        paddingVertical: Spacing.xl,
        paddingHorizontal: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        alignItems: 'center',
    },
    actionIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    actionEmoji: {
        fontSize: 28,
    },
    actionText: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.semibold,
        color: Colors.dark.textPrimary,
    },

    // Stats Row
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginHorizontal: 4,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    statCardHighlight: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    statNumber: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
        color: Colors.dark.textPrimary,
    },
    statNumberHighlight: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
        color: '#FFFFFF',
    },
    statLabel: {
        fontSize: FontSizes.xs,
        color: Colors.dark.textSecondary,
        marginTop: 2,
    },
    statLabelHighlight: {
        fontSize: FontSizes.xs,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },

    // Milestone Card
    milestoneCard: {
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    milestoneHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    milestoneEmoji: {
        fontSize: 20,
        marginRight: Spacing.sm,
    },
    milestoneTitle: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.semibold,
        color: Colors.dark.textPrimary,
    },
    milestoneText: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textSecondary,
        marginBottom: Spacing.md,
    },
    milestoneBar: {
        height: 8,
        backgroundColor: Colors.dark.surfaceVariant,
        borderRadius: BorderRadius.full,
        overflow: 'hidden',
    },
    milestoneFill: {
        height: '100%',
        backgroundColor: Colors.secondary,
        borderRadius: BorderRadius.full,
    },

    // Quote Card
    quoteCard: {
        backgroundColor: Colors.dark.surfaceVariant,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        borderLeftWidth: 3,
        borderLeftColor: Colors.primary,
    },
    quoteText: {
        fontSize: FontSizes.base,
        fontStyle: 'italic',
        color: Colors.dark.textSecondary,
        lineHeight: 24,
    },
    // Challenge Card Styles
    challengeCard: {
        backgroundColor: Colors.primary + '15',
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.primary + '30',
    },
    challengeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.md,
    },
    challengeInfo: {
        flex: 1,
    },
    challengeLabel: {
        fontSize: FontSizes.xs,
        color: Colors.primary,
        fontWeight: FontWeights.bold,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    challengeName: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        color: Colors.dark.textPrimary,
    },
    challengeDay: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.bold,
        color: Colors.primary,
        backgroundColor: Colors.primary + '20',
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.md,
    },
    challengeProgressBar: {
        height: 8,
        backgroundColor: Colors.dark.surfaceVariant,
        borderRadius: 4,
        marginBottom: Spacing.sm,
        overflow: 'hidden',
    },
    challengeProgressFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 4,
    },
    challengeStatus: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textSecondary,
    },
});

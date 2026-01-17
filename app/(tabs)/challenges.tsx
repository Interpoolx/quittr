import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../../src/hooks/useStore';
import { Colors } from '../../src/constants/colors';
import { Spacing, BorderRadius } from '../../src/constants/layout';
import { FontSizes, FontWeights } from '../../src/constants/typography';
import { CHALLENGES } from '../../src/constants';

export default function ChallengesScreen() {
    const router = useRouter();
    const stats = useAppSelector((state) => state.user.stats);
    const activeChallenge = stats.activeChallenge;

    // For this example, we assume we only have the '90-day-reboot' challenge
    const challengeData = CHALLENGES[0];

    if (!activeChallenge || activeChallenge.status !== 'active') {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Challenges</Text>
                </View>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyEmoji}>🏆</Text>
                    <Text style={styles.emptyTitle}>No Active Challenge</Text>
                    <Text style={styles.emptyText}>
                        Go to the Learn tab to start your 90-day reboot journey!
                    </Text>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => router.push('/(tabs)/learn')}
                    >
                        <Text style={styles.primaryButtonText}>Go to Learn</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const currentDay = activeChallenge.currentDay;
    const progress = Math.min(1, currentDay / challengeData.durationDays);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Challenge Progress</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Progress Overview Card */}
                <View style={styles.progressCard}>
                    <Text style={styles.challengeIcon}>{challengeData.icon}</Text>
                    <Text style={styles.challengeName}>{challengeData.title}</Text>
                    <Text style={styles.dayCount}>Day {currentDay} of {challengeData.durationDays}</Text>

                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{currentDay}</Text>
                            <Text style={styles.statLabel}>Days Clean</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{challengeData.durationDays - currentDay}</Text>
                            <Text style={styles.statLabel}>Days Left</Text>
                        </View>
                    </View>
                </View>

                {/* Phases Timeline */}
                <Text style={styles.sectionTitle}>Journey Phases</Text>
                {challengeData.phases.map((phase, index) => {
                    const isActive = currentDay >= phase.range[0] && currentDay <= phase.range[1];
                    const isCompleted = currentDay > phase.range[1];

                    return (
                        <View key={index} style={[styles.phaseItem, isActive && styles.phaseItemActive]}>
                            <View style={[styles.phaseIndicator, isCompleted && styles.phaseIndicatorCompleted]}>
                                {isCompleted ? <Text style={styles.checkIcon}>✓</Text> : <Text style={styles.phaseNumber}>{index + 1}</Text>}
                            </View>
                            <View style={styles.phaseContent}>
                                <Text style={[styles.phaseName, isActive && styles.phaseNameActive]}>{phase.title}</Text>
                                <Text style={styles.phaseDays}>Days {phase.range[0]}-{phase.range[1]}</Text>
                                <Text style={styles.phaseDescription}>{phase.description}</Text>
                            </View>
                        </View>
                    );
                })}

                {/* Benefits */}
                <Text style={styles.sectionTitle}>Transformation Benefits</Text>
                <View style={styles.benefitsCard}>
                    {challengeData.benefits.map((benefit, index) => (
                        <View key={index} style={styles.benefitRow}>
                            <Text style={styles.benefitBullet}>✨</Text>
                            <Text style={styles.benefitText}>{benefit}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.footerInfo}>
                    <Text style={styles.footerText}>
                        This challenge is based on neurobiological recovery timelines.
                        Every day you resist an urge, your brain gets stronger.
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.md,
        backgroundColor: Colors.dark.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
    },
    backButton: {
        paddingRight: Spacing.md,
    },
    backButtonText: {
        color: Colors.primary,
        fontSize: FontSizes.base,
        fontWeight: FontWeights.medium,
    },
    title: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        color: Colors.dark.textPrimary,
    },
    scrollContent: {
        padding: Spacing.md,
        paddingBottom: 40,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: Spacing.lg,
    },
    emptyTitle: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
        color: Colors.dark.textPrimary,
        marginBottom: Spacing.sm,
    },
    emptyText: {
        fontSize: FontSizes.base,
        color: Colors.dark.textSecondary,
        textAlign: 'center',
        marginBottom: Spacing.xl,
        lineHeight: 24,
    },
    primaryButton: {
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
        borderRadius: BorderRadius.lg,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: FontSizes.base,
        fontWeight: FontWeights.bold,
    },
    progressCard: {
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        alignItems: 'center',
        marginBottom: Spacing.xl,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    challengeIcon: {
        fontSize: 48,
        marginBottom: Spacing.sm,
    },
    challengeName: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
        color: Colors.dark.textPrimary,
        marginBottom: 4,
    },
    dayCount: {
        fontSize: FontSizes.base,
        color: Colors.primary,
        fontWeight: FontWeights.semibold,
        marginBottom: Spacing.lg,
    },
    progressBar: {
        width: '100%',
        height: 12,
        backgroundColor: Colors.dark.surfaceVariant,
        borderRadius: 6,
        marginBottom: Spacing.xl,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 6,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-around',
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
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: Colors.dark.border,
    },
    sectionTitle: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        color: Colors.dark.textPrimary,
        marginBottom: Spacing.md,
    },
    phaseItem: {
        flexDirection: 'row',
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    phaseItemActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary + '10',
    },
    phaseIndicator: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.dark.surfaceVariant,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
        marginTop: 2,
    },
    phaseIndicatorCompleted: {
        backgroundColor: Colors.success,
    },
    checkIcon: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    phaseNumber: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        fontWeight: 'bold',
    },
    phaseContent: {
        flex: 1,
    },
    phaseName: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.bold,
        color: Colors.dark.textPrimary,
        marginBottom: 2,
    },
    phaseNameActive: {
        color: Colors.primary,
    },
    phaseDays: {
        fontSize: FontSizes.xs,
        color: Colors.dark.textMuted,
        marginBottom: Spacing.xs,
    },
    phaseDescription: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textSecondary,
        lineHeight: 20,
    },
    benefitsCard: {
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        marginBottom: Spacing.xl,
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    benefitBullet: {
        fontSize: 18,
        marginRight: Spacing.md,
    },
    benefitText: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textSecondary,
    },
    footerInfo: {
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
    },
    footerText: {
        fontSize: FontSizes.xs,
        color: Colors.dark.textMuted,
        textAlign: 'center',
        lineHeight: 18,
    },
});

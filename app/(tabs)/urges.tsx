// Urges Screen - QUITTR Dark Theme
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
    Platform,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../../src/hooks/useStore';
import { addUrgeLog, deleteUrgeLog } from '../../src/store/slices/urgesSlice';
import { updateStats, addXP } from '../../src/store/slices/userSlice';
import { Colors } from '../../src/constants/colors';
import { Spacing, BorderRadius } from '../../src/constants/layout';
import { FontSizes, FontWeights } from '../../src/constants/typography';
import { DEFAULT_TRIGGERS } from '../../src/constants';
import { ConfirmModal } from '../../src/components/ConfirmModal';

export default function UrgesScreen() {
    const dispatch = useAppDispatch();
    const urges = useAppSelector((state) => state.urges);
    const stats = useAppSelector((state) => state.user.stats);

    const [showLogModal, setShowLogModal] = useState(false);
    const [intensity, setIntensity] = useState(5);
    const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
    const [notes, setNotes] = useState('');

    // New state for custom confirmation
    const [isConfirmDeleteVisible, setIsConfirmDeleteVisible] = useState(false);
    const [urgeToDelete, setUrgeToDelete] = useState<string | null>(null);

    const total = urges.logs.length;
    const resisted = urges.totalResisted;
    const resistanceRate = total > 0 ? Math.round((resisted / total) * 100) : 0;

    const getIntensityColor = (level: number) => {
        if (level <= 3) return Colors.success;
        if (level <= 6) return Colors.warning;
        return Colors.danger;
    };

    const handleToggleTrigger = (trigger: string) => {
        setSelectedTriggers(prev =>
            prev.includes(trigger)
                ? prev.filter(t => t !== trigger)
                : [...prev, trigger]
        );
    };

    const handleLogUrge = (outcome: 'resisted' | 'slip') => {
        const newLog = {
            id: `urge_${Date.now()}`,
            timestamp: new Date().toISOString(),
            intensity,
            triggers: selectedTriggers,
            emotionalState: '',
            outcome,
            notes,
        };

        dispatch(addUrgeLog(newLog));

        if (outcome === 'resisted') {
            dispatch(updateStats({ urgesResisted: stats.urgesResisted + 1 }));
            dispatch(addXP(10));
        }

        setShowLogModal(false);
        setIntensity(5);
        setSelectedTriggers([]);
        setNotes('');
    };

    const handleDeleteUrge = (id: string) => {
        setUrgeToDelete(id);
        setIsConfirmDeleteVisible(true);
    };

    const confirmDeleteUrge = () => {
        if (urgeToDelete) {
            dispatch(deleteUrgeLog(urgeToDelete));
            setUrgeToDelete(null);
        }
        setIsConfirmDeleteVisible(false);
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        if (diffDays === 1) return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <Text style={styles.title}>Urge Tracking</Text>
                <Text style={styles.subtitle}>Monitor your patterns and build resistance</Text>

                {/* Stats Cards */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{total}</Text>
                        <Text style={styles.statLabel}>Total Logged</Text>
                    </View>
                    <View style={[styles.statCard, styles.highlightCard]}>
                        <Text style={styles.highlightNumber}>{resistanceRate}%</Text>
                        <Text style={styles.highlightLabel}>Resistance</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statNumber, { color: Colors.success }]}>{resisted}</Text>
                        <Text style={styles.statLabel}>Resisted</Text>
                    </View>
                </View>

                {/* Log Urge Button */}
                <TouchableOpacity style={styles.logButton} onPress={() => setShowLogModal(true)}>
                    <Text style={styles.logButtonIcon}>📝</Text>
                    <Text style={styles.logButtonText}>Log New Urge</Text>
                </TouchableOpacity>

                {/* Recent Urges */}
                <Text style={styles.sectionTitle}>Recent Urges</Text>
                {urges.logs.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📊</Text>
                        <Text style={styles.emptyText}>No urges logged yet</Text>
                        <Text style={styles.emptySubtext}>Tap the button above to track your first urge</Text>
                    </View>
                ) : (
                    urges.logs.slice(0, 10).map((urge) => (
                        <View key={urge.id} style={styles.urgeCard}>
                            <View style={styles.urgeHeader}>
                                <Text style={styles.urgeDate}>{formatDate(urge.timestamp)}</Text>
                                <View style={styles.urgeHeaderRight}>
                                    <View style={[
                                        styles.outcomeTag,
                                        { backgroundColor: urge.outcome === 'resisted' ? Colors.success + '20' : Colors.danger + '20' }
                                    ]}>
                                        <Text style={[
                                            styles.outcomeText,
                                            { color: urge.outcome === 'resisted' ? Colors.success : Colors.danger }
                                        ]}>
                                            {urge.outcome === 'resisted' ? '✓ Resisted' : '✗ Slip'}
                                        </Text>
                                    </View>
                                    <TouchableOpacity onPress={() => handleDeleteUrge(urge.id)} style={styles.deleteButton}>
                                        <Text style={styles.deleteButtonText}>🗑️</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.intensityContainer}>
                                <Text style={styles.intensityLabel}>Intensity</Text>
                                <View style={styles.intensityBar}>
                                    <View style={[
                                        styles.intensityFill,
                                        { width: `${urge.intensity * 10}%`, backgroundColor: getIntensityColor(urge.intensity) }
                                    ]} />
                                </View>
                                <Text style={[styles.intensityNumber, { color: getIntensityColor(urge.intensity) }]}>
                                    {urge.intensity}/10
                                </Text>
                            </View>
                            {urge.triggers.length > 0 && (
                                <View style={styles.triggersRow}>
                                    {urge.triggers.map((trigger) => (
                                        <View key={trigger} style={styles.triggerChip}>
                                            <Text style={styles.triggerChipText}>{trigger}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Log Urge Modal */}
            <Modal visible={showLogModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Log Urge</Text>
                            <TouchableOpacity onPress={() => setShowLogModal(false)}>
                                <Text style={styles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            <Text style={styles.inputLabel}>Intensity: {intensity}/10</Text>
                            <View style={styles.sliderContainer}>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                    <TouchableOpacity
                                        key={num}
                                        style={[
                                            styles.sliderButton,
                                            intensity === num && { backgroundColor: getIntensityColor(num) }
                                        ]}
                                        onPress={() => setIntensity(num)}
                                    >
                                        <Text style={[
                                            styles.sliderButtonText,
                                            intensity === num && styles.sliderButtonTextActive
                                        ]}>{num}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Triggers</Text>
                            <View style={styles.triggersGrid}>
                                {DEFAULT_TRIGGERS.map((trigger) => (
                                    <TouchableOpacity
                                        key={trigger}
                                        style={[
                                            styles.triggerButton,
                                            selectedTriggers.includes(trigger) && styles.triggerButtonActive
                                        ]}
                                        onPress={() => handleToggleTrigger(trigger)}
                                    >
                                        <Text style={[
                                            styles.triggerButtonText,
                                            selectedTriggers.includes(trigger) && styles.triggerButtonTextActive
                                        ]}>{trigger}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Notes (optional)</Text>
                            <TextInput
                                style={styles.notesInput}
                                placeholder="How are you feeling?"
                                placeholderTextColor={Colors.dark.textMuted}
                                multiline
                                value={notes}
                                onChangeText={setNotes}
                            />
                        </ScrollView>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={[styles.outcomeButton, styles.resistedButton]} onPress={() => handleLogUrge('resisted')}>
                                <Text style={styles.outcomeButtonText}>✓ I Resisted (+10 XP)</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.outcomeButton, styles.slipButton]} onPress={() => handleLogUrge('slip')}>
                                <Text style={styles.outcomeButtonText}>I Slipped</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <ConfirmModal
                visible={isConfirmDeleteVisible}
                title="Delete Urge Log"
                message="Are you sure you want to delete this urge log?"
                onConfirm={confirmDeleteUrge}
                onCancel={() => setIsConfirmDeleteVisible(false)}
                type="danger"
                confirmText="Delete"
            />
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
    },
    subtitle: {
        fontSize: FontSizes.base,
        color: Colors.dark.textSecondary,
        marginBottom: Spacing.lg,
    },
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
    highlightCard: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    statNumber: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
        color: Colors.dark.textPrimary,
    },
    highlightNumber: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
        color: '#FFFFFF',
    },
    statLabel: {
        fontSize: FontSizes.xs,
        color: Colors.dark.textSecondary,
        marginTop: 2,
    },
    highlightLabel: {
        fontSize: FontSizes.xs,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    logButton: {
        backgroundColor: Colors.secondary,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.lg,
        shadowColor: Colors.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    logButtonIcon: {
        fontSize: 20,
        marginRight: Spacing.sm,
    },
    logButtonText: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.semibold,
        color: '#FFFFFF',
    },
    sectionTitle: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.semibold,
        color: Colors.dark.textPrimary,
        marginBottom: Spacing.md,
    },
    emptyState: {
        alignItems: 'center',
        padding: Spacing['2xl'],
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: Spacing.md,
    },
    emptyText: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.medium,
        color: Colors.dark.textPrimary,
    },
    emptySubtext: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textSecondary,
        textAlign: 'center',
    },
    urgeCard: {
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    urgeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    urgeDate: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textSecondary,
    },
    outcomeTag: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
    },
    outcomeText: {
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.medium,
    },
    urgeHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    deleteButton: {
        padding: Spacing.xs,
    },
    deleteButtonText: {
        fontSize: 16,
    },
    intensityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    intensityLabel: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textSecondary,
        width: 60,
    },
    intensityBar: {
        flex: 1,
        height: 8,
        backgroundColor: Colors.dark.surfaceVariant,
        borderRadius: BorderRadius.full,
        marginHorizontal: Spacing.sm,
    },
    intensityFill: {
        height: '100%',
        borderRadius: BorderRadius.full,
    },
    intensityNumber: {
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.semibold,
        width: 40,
        textAlign: 'right',
    },
    triggersRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.xs,
    },
    triggerChip: {
        backgroundColor: Colors.primary + '20',
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
    },
    triggerChipText: {
        fontSize: FontSizes.xs,
        color: Colors.primary,
        fontWeight: FontWeights.medium,
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.dark.surface,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        maxHeight: '90%',
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
        padding: Spacing.md,
        maxHeight: 400,
    },
    inputLabel: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.semibold,
        color: Colors.dark.textPrimary,
        marginBottom: Spacing.sm,
        marginTop: Spacing.md,
    },
    sliderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sliderButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: Colors.dark.surfaceVariant,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sliderButtonText: {
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.medium,
        color: Colors.dark.textSecondary,
    },
    sliderButtonTextActive: {
        color: '#FFFFFF',
    },
    triggersGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    triggerButton: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.dark.surfaceVariant,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    triggerButtonActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    triggerButtonText: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textPrimary,
    },
    triggerButtonTextActive: {
        color: '#FFFFFF',
    },
    notesInput: {
        backgroundColor: Colors.dark.surfaceVariant,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        fontSize: FontSizes.base,
        color: Colors.dark.textPrimary,
        minHeight: 80,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    modalActions: {
        padding: Spacing.md,
        gap: Spacing.sm,
        borderTopWidth: 1,
        borderTopColor: Colors.dark.border,
    },
    outcomeButton: {
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
    },
    resistedButton: {
        backgroundColor: Colors.success,
    },
    slipButton: {
        backgroundColor: Colors.danger,
    },
    outcomeButtonText: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.semibold,
        color: '#FFFFFF',
    },
});

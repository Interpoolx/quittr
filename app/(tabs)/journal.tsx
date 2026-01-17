// Journal Screen - Quittr.app Dark Theme
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    TextInput,
    Platform,
    Alert,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../../src/hooks/useStore';
import { addEntry, updateEntry, addCheckIn, deleteEntry } from '../../src/store/slices/journalSlice';
import { addXP } from '../../src/store/slices/userSlice';
import { Colors } from '../../src/constants/colors';
import { Spacing, BorderRadius } from '../../src/constants/layout';
import { FontSizes, FontWeights } from '../../src/constants/typography';
import { MOOD_OPTIONS, ENERGY_OPTIONS, SLEEP_OPTIONS } from '../../src/constants';
import { ConfirmModal } from '../../src/components/ConfirmModal';

const DAILY_PROMPTS = [
    "What small victory can you celebrate today?",
    "What are you grateful for right now?",
    "What's one thing you're looking forward to?",
    "How did you handle challenges today?",
    "What made you smile today?",
    "What lesson did you learn recently?",
    "How are you taking care of yourself?",
];

export default function JournalScreen() {
    const dispatch = useAppDispatch();
    const journal = useAppSelector((state) => state.journal);

    const [showEntryModal, setShowEntryModal] = useState(false);
    const [showCheckInModal, setShowCheckInModal] = useState(false);
    const [entryContent, setEntryContent] = useState('');
    const [selectedMood, setSelectedMood] = useState(3);
    const [selectedEnergy, setSelectedEnergy] = useState(3);
    const [selectedSleep, setSelectedSleep] = useState(3);

    // New state for editing and custom confirmation
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
    const [isConfirmDeleteVisible, setIsConfirmDeleteVisible] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

    const today = new Date();
    const promptIndex = today.getDate() % DAILY_PROMPTS.length;
    const todayPrompt = DAILY_PROMPTS[promptIndex];

    const getMoodEmoji = (mood: number) => {
        const moodOption = MOOD_OPTIONS.find(m => m.value === mood);
        return moodOption?.emoji || '😐';
    };

    const handleCheckIn = () => {
        const checkIn = {
            id: `checkin_${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            mood: selectedMood,
            energy: selectedEnergy,
            sleepQuality: selectedSleep,
            urgeCount: 0,
            completedAt: new Date().toISOString(),
        };

        dispatch(addCheckIn(checkIn));
        dispatch(addXP(5));
        setShowCheckInModal(false);

        // Show success feedback
        const moodEmoji = MOOD_OPTIONS.find(m => m.value === selectedMood)?.emoji || '😐';
        Alert.alert('Check-in Complete', `Check-in saved! ${moodEmoji}\n\n+5 XP earned`, [{ text: 'Great!' }]);
    };

    const handleDeleteEntry = (id: string) => {
        setEntryToDelete(id);
        setIsConfirmDeleteVisible(true);
    };

    const confirmDeleteEntry = () => {
        if (entryToDelete) {
            dispatch(deleteEntry(entryToDelete));
            setEntryToDelete(null);
        }
        setIsConfirmDeleteVisible(false);
    };

    const handleEditEntry = (entry: any) => {
        setEditingEntryId(entry.id);
        setEntryContent(entry.content);
        setSelectedMood(entry.mood);
        setIsEditMode(true);
        setShowEntryModal(true);
    };

    const handleSaveEntry = () => {
        if (!entryContent.trim()) return;

        if (isEditMode && editingEntryId) {
            dispatch(updateEntry({
                id: editingEntryId,
                updates: {
                    content: entryContent,
                    mood: selectedMood,
                }
            }));
            setIsEditMode(false);
            setEditingEntryId(null);
        } else {
            const entry = {
                id: `entry_${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                mood: selectedMood,
                energy: selectedEnergy,
                sleepQuality: selectedSleep,
                urgeCount: 0,
                content: entryContent,
                promptId: todayPrompt,
                tags: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            dispatch(addEntry(entry));
            dispatch(addXP(15));
        }

        setShowEntryModal(false);
        setEntryContent('');
        setSelectedMood(3);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <Text style={styles.title}>Journal</Text>
                <Text style={styles.subtitle}>Reflect on your journey</Text>

                {/* Daily Prompt Card */}
                <View style={styles.promptCard}>
                    <Text style={styles.promptLabel}>TODAY'S PROMPT</Text>
                    <Text style={styles.promptText}>{todayPrompt}</Text>
                    <TouchableOpacity style={styles.promptButton} onPress={() => setShowEntryModal(true)}>
                        <Text style={styles.promptButtonText}>✍️ Start Writing</Text>
                    </TouchableOpacity>
                </View>

                {/* Quick Check-in */}
                <TouchableOpacity style={styles.checkInCard} onPress={() => setShowCheckInModal(true)}>
                    <Text style={styles.checkInTitle}>Quick Check-in</Text>
                    <Text style={styles.checkInSubtitle}>How are you feeling right now?</Text>
                    <View style={styles.moodRow}>
                        {MOOD_OPTIONS.map((mood) => (
                            <View key={mood.value} style={styles.moodButton}>
                                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                                <Text style={styles.moodLabel}>{mood.label}</Text>
                            </View>
                        ))}
                    </View>
                </TouchableOpacity>

                {/* Recent Entries */}
                <View style={styles.entriesHeader}>
                    <Text style={styles.sectionTitle}>Recent Entries</Text>
                    <Text style={styles.entryCount}>{journal.entries.length} entries</Text>
                </View>

                {journal.entries.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📝</Text>
                        <Text style={styles.emptyText}>No journal entries yet</Text>
                        <Text style={styles.emptySubtext}>Start writing to track your thoughts</Text>
                    </View>
                ) : (
                    journal.entries.slice(0, 10).map((entry) => (
                        <TouchableOpacity
                            key={entry.id}
                            style={styles.entryCard}
                            onPress={() => handleEditEntry(entry)}
                        >
                            <View style={styles.entryHeader}>
                                <View style={styles.entryDateRow}>
                                    <Text style={styles.entryMood}>{getMoodEmoji(entry.mood)}</Text>
                                    <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.deleteEntryButton}
                                    onPress={() => handleDeleteEntry(entry.id)}
                                >
                                    <Text style={styles.deleteEntryIcon}>🗑️</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.entryPreview} numberOfLines={3}>{entry.content}</Text>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            {/* Floating Action Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => {
                    setIsEditMode(false);
                    setEditingEntryId(null);
                    setEntryContent('');
                    setSelectedMood(3);
                    setShowEntryModal(true);
                }}
            >
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>

            {/* Check-in Modal */}
            <Modal visible={showCheckInModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Daily Check-in</Text>
                            <TouchableOpacity onPress={() => setShowCheckInModal(false)}>
                                <Text style={styles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            <Text style={styles.inputLabel}>How's your mood?</Text>
                            <View style={styles.optionsRow}>
                                {MOOD_OPTIONS.map((mood) => (
                                    <TouchableOpacity
                                        key={mood.value}
                                        style={[styles.optionButton, selectedMood === mood.value && styles.optionButtonActive]}
                                        onPress={() => setSelectedMood(mood.value)}
                                    >
                                        <Text style={styles.optionEmoji}>{mood.emoji}</Text>
                                        <Text style={[styles.optionLabel, selectedMood === mood.value && styles.optionLabelActive]}>
                                            {mood.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Energy level?</Text>
                            <View style={styles.optionsRow}>
                                {ENERGY_OPTIONS.map((energy) => (
                                    <TouchableOpacity
                                        key={energy.value}
                                        style={[styles.optionButton, selectedEnergy === energy.value && styles.optionButtonActive]}
                                        onPress={() => setSelectedEnergy(energy.value)}
                                    >
                                        <Text style={styles.optionEmoji}>{energy.emoji}</Text>
                                        <Text style={[styles.optionLabel, selectedEnergy === energy.value && styles.optionLabelActive]}>
                                            {energy.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Sleep quality?</Text>
                            <View style={styles.optionsRow}>
                                {SLEEP_OPTIONS.map((sleep) => (
                                    <TouchableOpacity
                                        key={sleep.value}
                                        style={[styles.optionButton, selectedSleep === sleep.value && styles.optionButtonActive]}
                                        onPress={() => setSelectedSleep(sleep.value)}
                                    >
                                        <Text style={styles.optionEmoji}>{sleep.emoji}</Text>
                                        <Text style={[styles.optionLabel, selectedSleep === sleep.value && styles.optionLabelActive]}>
                                            {sleep.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.saveButton} onPress={handleCheckIn}>
                                <Text style={styles.saveButtonText}>Complete Check-in (+5 XP)</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Entry Modal */}
            <Modal visible={showEntryModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, styles.entryModalContent]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{isEditMode ? 'Edit Entry' : 'New Entry'}</Text>
                            <TouchableOpacity onPress={() => setShowEntryModal(false)}>
                                <Text style={styles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            <Text style={styles.inputLabel}>How are you feeling?</Text>
                            <View style={[styles.optionsRow, { marginBottom: Spacing.lg }]}>
                                {MOOD_OPTIONS.map((mood) => (
                                    <TouchableOpacity
                                        key={mood.value}
                                        style={[styles.optionButton, selectedMood === mood.value && styles.optionButtonActive]}
                                        onPress={() => setSelectedMood(mood.value)}
                                    >
                                        <Text style={styles.optionEmoji}>{mood.emoji}</Text>
                                        <Text style={[styles.optionLabel, selectedMood === mood.value && styles.optionLabelActive]}>
                                            {mood.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Today's Reflection</Text>
                            <View style={styles.promptBanner}>
                                <Text style={styles.promptBannerText}>{todayPrompt}</Text>
                            </View>

                            <TextInput
                                style={styles.entryInput}
                                placeholder="Write your thoughts..."
                                placeholderTextColor={Colors.dark.textMuted}
                                multiline
                                value={entryContent}
                                onChangeText={setEntryContent}
                                autoFocus
                            />
                        </ScrollView>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.saveButton, !entryContent.trim() && styles.saveButtonDisabled]}
                                onPress={handleSaveEntry}
                                disabled={!entryContent.trim()}
                            >
                                <Text style={styles.saveButtonText}>
                                    {isEditMode ? 'Update Entry' : 'Save Entry (+15 XP)'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <ConfirmModal
                visible={isConfirmDeleteVisible}
                title="Delete Entry"
                message="Are you sure you want to delete this journal entry?"
                onConfirm={confirmDeleteEntry}
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
    promptCard: {
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.secondary + '40',
        borderLeftWidth: 4,
        borderLeftColor: Colors.secondary,
    },
    promptLabel: {
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.semibold,
        color: Colors.secondary,
        letterSpacing: 1,
        marginBottom: Spacing.sm,
    },
    promptText: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.medium,
        color: Colors.dark.textPrimary,
        marginBottom: Spacing.md,
        lineHeight: 26,
    },
    promptButton: {
        backgroundColor: Colors.secondary,
        borderRadius: BorderRadius.md,
        padding: Spacing.sm,
        alignItems: 'center',
    },
    promptButtonText: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.semibold,
        color: '#FFFFFF',
    },
    checkInCard: {
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    checkInTitle: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.semibold,
        color: Colors.dark.textPrimary,
        marginBottom: Spacing.xs,
    },
    checkInSubtitle: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textSecondary,
        marginBottom: Spacing.md,
    },
    moodRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    moodButton: {
        alignItems: 'center',
        padding: Spacing.sm,
    },
    moodEmoji: {
        fontSize: 28,
        marginBottom: Spacing.xs,
    },
    moodLabel: {
        fontSize: FontSizes.xs,
        color: Colors.dark.textSecondary,
    },
    entriesHeader: {
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
    entryCount: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textSecondary,
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
    entryCard: {
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    entryDate: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textSecondary,
    },
    entryMood: {
        fontSize: 24,
    },
    entryPreview: {
        fontSize: FontSizes.base,
        color: Colors.dark.textPrimary,
        lineHeight: 22,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: Platform.OS === 'ios' ? 100 : 80,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        zIndex: 10,
    },
    fabIcon: {
        fontSize: 30,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    modalContent: {
        backgroundColor: Colors.dark.surface,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        maxHeight: '80%',
    },
    entryModalContent: {
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
    },
    inputLabel: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.semibold,
        color: Colors.dark.textPrimary,
        marginBottom: Spacing.md,
        marginTop: Spacing.md,
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    optionButton: {
        alignItems: 'center',
        padding: Spacing.sm,
        borderRadius: BorderRadius.lg,
        borderWidth: 2,
        borderColor: 'transparent',
        flex: 1,
        marginHorizontal: 2,
    },
    optionButtonActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary + '15',
    },
    optionEmoji: {
        fontSize: 24,
        marginBottom: Spacing.xs,
    },
    optionLabel: {
        fontSize: FontSizes.xs,
        color: Colors.dark.textSecondary,
        textAlign: 'center',
    },
    optionLabelActive: {
        color: Colors.primary,
        fontWeight: FontWeights.medium,
    },
    promptBanner: {
        backgroundColor: Colors.dark.surfaceVariant,
        padding: Spacing.md,
        margin: Spacing.md,
        borderRadius: BorderRadius.md,
        borderLeftWidth: 3,
        borderLeftColor: Colors.secondary,
    },
    promptBannerText: {
        fontSize: FontSizes.sm,
        fontStyle: 'italic',
        color: Colors.dark.textSecondary,
    },
    entryInput: {
        flex: 1,
        padding: Spacing.md,
        fontSize: FontSizes.base,
        color: Colors.dark.textPrimary,
        minHeight: 200,
        textAlignVertical: 'top',
    },
    modalActions: {
        padding: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.dark.border,
    },
    saveButton: {
        backgroundColor: Colors.primary,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
    },
    saveButtonDisabled: {
        backgroundColor: Colors.dark.textMuted,
    },
    saveButtonText: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.semibold,
        color: '#FFFFFF',
    },
    // Entry delete styles
    entryDateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    deleteEntryButton: {
        padding: Spacing.xs,
    },
    deleteEntryIcon: {
        fontSize: 18,
    },
});

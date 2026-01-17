// Onboarding Flow - Welcome and Setup Screens
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '../src/hooks/useStore';
import { setProfile, setOnboarded } from '../src/store/slices/userSlice';
import { Colors } from '../src/constants/colors';
import { Spacing, BorderRadius } from '../src/constants/layout';
import { FontSizes, FontWeights } from '../src/constants/typography';

const { width } = Dimensions.get('window');

type OnboardingStep = 'welcome' | 'quiz' | 'motivations' | 'start';

const QUIZ_QUESTIONS = [
    {
        question: 'How long have you been struggling with this habit?',
        options: ['Less than 1 year', '1-3 years', '3-5 years', 'More than 5 years'],
    },
    {
        question: 'How often do you experience urges?',
        options: ['Multiple times a day', 'Daily', 'Few times a week', 'Weekly or less'],
    },
    {
        question: 'Have you tried to quit before?',
        options: ['Never', 'Once or twice', 'Several times', 'Many times'],
    },
];

const MOTIVATIONS = [
    { id: 'mental', emoji: '🧠', label: 'Better mental clarity' },
    { id: 'relationships', emoji: '❤️', label: 'Improved relationships' },
    { id: 'confidence', emoji: '💪', label: 'More confidence' },
    { id: 'energy', emoji: '⚡', label: 'More energy' },
    { id: 'time', emoji: '⏰', label: 'Reclaim my time' },
    { id: 'selfrespect', emoji: '🌟', label: 'Self-respect' },
    { id: 'faith', emoji: '🙏', label: 'Spiritual reasons' },
    { id: 'health', emoji: '🏃', label: 'Physical health' },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [step, setStep] = useState<OnboardingStep>('welcome');
    const [quizIndex, setQuizIndex] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
    const [selectedMotivations, setSelectedMotivations] = useState<string[]>([]);

    const handleStartJourney = () => {
        const now = new Date().toISOString();

        dispatch(setProfile({
            id: `user_${Date.now()}`,
            sobrietyStartDate: now,
            bestStreak: 0,
            totalUrgesResisted: 0,
            totalSlips: 0,
            motivations: selectedMotivations,
            customTriggers: [],
            createdAt: now,
            updatedAt: now,
        }));

        dispatch(setOnboarded(true));
        router.replace('/(tabs)');
    };

    const handleQuizAnswer = (answer: string) => {
        const newAnswers = [...quizAnswers, answer];
        setQuizAnswers(newAnswers);

        if (quizIndex < QUIZ_QUESTIONS.length - 1) {
            setQuizIndex(quizIndex + 1);
        } else {
            setStep('motivations');
        }
    };

    const toggleMotivation = (id: string) => {
        setSelectedMotivations(prev =>
            prev.includes(id)
                ? prev.filter(m => m !== id)
                : [...prev, id]
        );
    };

    // Welcome Screen
    if (step === 'welcome') {
        return (
            <View style={styles.container}>
                <ScrollView
                    style={styles.scrollContent}
                    contentContainerStyle={styles.welcomeScrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.emoji}>🌱</Text>
                    <Text style={styles.title}>Welcome to Quittr.app</Text>
                    <Text style={styles.subtitle}>
                        Your private companion for a healthier life.
                        No accounts. No tracking. Just you and your journey.
                    </Text>

                    <View style={styles.features}>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>🔒</Text>
                            <Text style={styles.featureText}>100% Private - Data stays on your device</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>💪</Text>
                            <Text style={styles.featureText}>Track your progress and build streaks</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>🆘</Text>
                            <Text style={styles.featureText}>Emergency help when you need it</Text>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.bottomButtons}>
                    <TouchableOpacity style={styles.primaryButton} onPress={() => setStep('quiz')}>
                        <Text style={styles.primaryButtonText}>Get Started</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryButton} onPress={handleStartJourney}>
                        <Text style={styles.secondaryButtonText}>Skip Setup</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Quiz Screen
    if (step === 'quiz') {
        const currentQuestion = QUIZ_QUESTIONS[quizIndex];
        return (
            <View style={styles.container}>
                <View style={styles.progressContainer}>
                    {QUIZ_QUESTIONS.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.progressDot,
                                i <= quizIndex && styles.progressDotActive
                            ]}
                        />
                    ))}
                </View>

                <View style={styles.quizContent}>
                    <Text style={styles.quizQuestion}>{currentQuestion.question}</Text>

                    <View style={styles.optionsContainer}>
                        {currentQuestion.options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.optionButton}
                                onPress={() => handleQuizAnswer(option)}
                            >
                                <Text style={styles.optionText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        );
    }

    // Motivations Screen
    if (step === 'motivations') {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollContent}>
                    <Text style={styles.title}>What motivates you?</Text>
                    <Text style={styles.subtitle}>Select all that apply</Text>

                    <View style={styles.motivationsGrid}>
                        {MOTIVATIONS.map((motivation) => (
                            <TouchableOpacity
                                key={motivation.id}
                                style={[
                                    styles.motivationCard,
                                    selectedMotivations.includes(motivation.label) && styles.motivationCardActive
                                ]}
                                onPress={() => toggleMotivation(motivation.label)}
                            >
                                <Text style={styles.motivationEmoji}>{motivation.emoji}</Text>
                                <Text style={[
                                    styles.motivationLabel,
                                    selectedMotivations.includes(motivation.label) && styles.motivationLabelActive
                                ]}>{motivation.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                <View style={styles.bottomButtons}>
                    <TouchableOpacity
                        style={[styles.primaryButton, selectedMotivations.length === 0 && styles.buttonDisabled]}
                        onPress={() => setStep('start')}
                        disabled={selectedMotivations.length === 0}
                    >
                        <Text style={styles.primaryButtonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Start Screen
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.emoji}>🚀</Text>
                <Text style={styles.title}>You're Ready!</Text>
                <Text style={styles.subtitle}>
                    Your journey starts now. Every day is a new opportunity to become the person you want to be.
                </Text>

                <View style={styles.commitmentCard}>
                    <Text style={styles.commitmentTitle}>Your Commitment</Text>
                    <Text style={styles.commitmentText}>
                        I commit to being honest with myself, to learning from setbacks, and to celebrating every victory, no matter how small.
                    </Text>
                </View>
            </View>

            <View style={styles.bottomButtons}>
                <TouchableOpacity style={styles.primaryButton} onPress={handleStartJourney}>
                    <Text style={styles.primaryButtonText}>Begin My Journey</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        paddingTop: 60,
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
    },
    welcomeScrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.xl,
    },
    emoji: {
        fontSize: 80,
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: FontSizes['2xl'],
        fontWeight: FontWeights.bold,
        color: Colors.dark.textPrimary,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    subtitle: {
        fontSize: FontSizes.base,
        color: Colors.dark.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: Spacing.md,
        marginBottom: Spacing.xl,
    },
    features: {
        width: '100%',
        gap: Spacing.md,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    featureIcon: {
        fontSize: 24,
        marginRight: Spacing.md,
    },
    featureText: {
        fontSize: FontSizes.base,
        color: Colors.dark.textPrimary,
        flex: 1,
    },
    bottomButtons: {
        padding: Spacing.lg,
        gap: Spacing.md,
        paddingBottom: 40,
    },
    primaryButton: {
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        alignItems: 'center',
    },
    primaryButtonText: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.semibold,
        color: '#FFFFFF',
    },
    secondaryButton: {
        padding: Spacing.md,
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontSize: FontSizes.base,
        color: Colors.dark.textSecondary,
    },
    buttonDisabled: {
        backgroundColor: Colors.dark.textMuted,
    },
    // Progress dots
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.sm,
        paddingVertical: Spacing.md,
    },
    progressDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.dark.surfaceVariant,
    },
    progressDotActive: {
        backgroundColor: Colors.primary,
    },
    // Quiz
    quizContent: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
        justifyContent: 'center',
    },
    quizQuestion: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.semibold,
        color: Colors.dark.textPrimary,
        textAlign: 'center',
        marginBottom: Spacing.xl,
        lineHeight: 32,
    },
    optionsContainer: {
        gap: Spacing.md,
    },
    optionButton: {
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    optionText: {
        fontSize: FontSizes.base,
        color: Colors.dark.textPrimary,
        textAlign: 'center',
    },
    // Motivations
    motivationsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: Spacing.md,
        marginTop: Spacing.lg,
    },
    motivationCard: {
        width: '47%',
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.dark.border,
    },
    motivationCardActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary + '15',
    },
    motivationEmoji: {
        fontSize: 32,
        marginBottom: Spacing.sm,
    },
    motivationLabel: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textPrimary,
        textAlign: 'center',
    },
    motivationLabelActive: {
        color: Colors.primary,
        fontWeight: FontWeights.semibold,
    },
    // Commitment
    commitmentCard: {
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.primary + '40',
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary,
        width: '100%',
    },
    commitmentTitle: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.semibold,
        color: Colors.primary,
        marginBottom: Spacing.sm,
    },
    commitmentText: {
        fontSize: FontSizes.base,
        color: Colors.dark.textSecondary,
        lineHeight: 24,
        fontStyle: 'italic',
    },
});

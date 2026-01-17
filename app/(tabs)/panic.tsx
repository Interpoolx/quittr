// Panic Button Screen - QUITTR Dark Theme with Enhanced Intervention
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    Alert,
    ScrollView,
} from 'react-native';
import { Colors } from '../../src/constants/colors';
import { Spacing, BorderRadius } from '../../src/constants/layout';
import { FontSizes, FontWeights } from '../../src/constants/typography';

const { width } = Dimensions.get('window');

type InterventionStep = 'acknowledge' | 'breathe' | 'ground' | 'motivate' | 'distract';

export default function PanicScreen() {
    const [isActive, setIsActive] = useState(false);
    const [currentStep, setCurrentStep] = useState<InterventionStep>('acknowledge');
    const breatheAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Breathing animation
    useEffect(() => {
        if (isActive && currentStep === 'breathe') {
            const breatheLoop = Animated.loop(
                Animated.sequence([
                    Animated.timing(breatheAnim, { toValue: 1.4, duration: 4000, useNativeDriver: true }),
                    Animated.timing(breatheAnim, { toValue: 1.4, duration: 7000, useNativeDriver: true }),
                    Animated.timing(breatheAnim, { toValue: 1, duration: 8000, useNativeDriver: true }),
                ])
            );
            breatheLoop.start();
            return () => breatheLoop.stop();
        }
    }, [isActive, currentStep, breatheAnim]);

    // Pulse animation for panic button
    useEffect(() => {
        const pulseLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            ])
        );
        pulseLoop.start();
        return () => pulseLoop.stop();
    }, [pulseAnim]);

    const steps: Record<InterventionStep, { title: string; description: string; icon: string }> = {
        acknowledge: {
            title: "It's Okay",
            description: "You're experiencing an urge. This is normal and it will pass. You've got this.",
            icon: '💙',
        },
        breathe: {
            title: 'Breathe',
            description: 'Inhale for 4 seconds...\nHold for 7 seconds...\nExhale for 8 seconds...',
            icon: '🌬️',
        },
        ground: {
            title: 'Ground Yourself',
            description: '5 things you can SEE\n4 things you can TOUCH\n3 things you can HEAR\n2 things you can SMELL\n1 thing you can TASTE',
            icon: '🌍',
        },
        motivate: {
            title: 'Remember Why',
            description: 'Think about your reasons for recovery. Your future self will thank you for staying strong right now.',
            icon: '⭐',
        },
        distract: {
            title: 'Take Action',
            description: 'Do 20 push-ups, take a cold shower, go for a walk, or call a friend. Move your body!',
            icon: '🏃',
        },
    };

    const stepOrder: InterventionStep[] = ['acknowledge', 'breathe', 'ground', 'motivate', 'distract'];

    const handleStartIntervention = () => {
        setIsActive(true);
        setCurrentStep('acknowledge');
    };

    const handleNextStep = () => {
        const currentIndex = stepOrder.indexOf(currentStep);
        if (currentIndex < stepOrder.length - 1) {
            setCurrentStep(stepOrder[currentIndex + 1]);
        } else {
            setIsActive(false);
            setCurrentStep('acknowledge');
        }
    };

    const handleCancel = () => {
        setIsActive(false);
        setCurrentStep('acknowledge');
    };

    if (!isActive) {
        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.inactiveScrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.inactiveTitle}>Emergency Support</Text>
                    <Text style={styles.inactiveSubtitle}>
                        Press the button when you're experiencing a strong urge
                    </Text>

                    <Animated.View style={[styles.panicButtonWrapper, { transform: [{ scale: pulseAnim }] }]}>
                        <TouchableOpacity
                            style={styles.panicButton}
                            onPress={handleStartIntervention}
                            activeOpacity={0.8}
                        >
                            <View style={styles.panicInnerGlow} />
                            <Text style={styles.panicIcon}>🆘</Text>
                            <Text style={styles.panicText}>I Need Help</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Text style={styles.reassurance}>
                        This will guide you through calming exercises
                    </Text>

                    {/* Quick Actions */}
                    <View style={styles.quickActions}>
                        <Text style={styles.quickActionsTitle}>Quick Distractions</Text>
                        <View style={styles.quickActionsRow}>
                            <TouchableOpacity style={styles.quickAction} onPress={() => { setIsActive(true); setCurrentStep('breathe'); }}>
                                <Text style={styles.quickActionIcon}>🧘</Text>
                                <Text style={styles.quickActionText}>Breathe</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.quickAction} onPress={() => { Alert.alert('Physical Movement', 'Try these:\n• 20 jumping jacks\n• 10 push-ups\n• Walk around the block\n• Run up and down stairs\n• Dance to your favorite song\n\nMovement helps reset your nervous system!'); }}>
                                <Text style={styles.quickActionIcon}>🏃</Text>
                                <Text style={styles.quickActionText}>Move</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.quickAction} onPress={() => { Alert.alert('Cold Water Technique', 'Cold water activates your dive reflex:\n• Splash cold water on your face\n• Hold ice cubes in your hands\n• Take a cold shower\n\nThis can reduce urge intensity in minutes!'); }}>
                                <Text style={styles.quickActionIcon}>❄️</Text>
                                <Text style={styles.quickActionText}>Cold Water</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* HALT Info */}
                    <View style={styles.haltCard}>
                        <Text style={styles.haltTitle}>Are you feeling HALT?</Text>
                        <View style={styles.haltRow}>
                            <View style={styles.haltItem}><Text style={styles.haltEmoji}>😫</Text><Text style={styles.haltLabel}>Hungry</Text></View>
                            <View style={styles.haltItem}><Text style={styles.haltEmoji}>😠</Text><Text style={styles.haltLabel}>Angry</Text></View>
                            <View style={styles.haltItem}><Text style={styles.haltEmoji}>😔</Text><Text style={styles.haltLabel}>Lonely</Text></View>
                            <View style={styles.haltItem}><Text style={styles.haltEmoji}>😴</Text><Text style={styles.haltLabel}>Tired</Text></View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    const step = steps[currentStep];
    const stepIndex = stepOrder.indexOf(currentStep);

    return (
        <View style={styles.activeContainer}>
            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
                {stepOrder.map((s, index) => (
                    <View
                        key={s}
                        style={[
                            styles.progressDot,
                            index <= stepIndex && styles.progressDotActive
                        ]}
                    />
                ))}
            </View>

            {/* Step Content */}
            <View style={styles.stepContent}>
                {currentStep === 'breathe' ? (
                    <Animated.View style={[styles.breatheCircle, { transform: [{ scale: breatheAnim }] }]}>
                        <Text style={styles.breatheText}>Breathe</Text>
                    </Animated.View>
                ) : (
                    <Text style={styles.stepIcon}>{step.icon}</Text>
                )}
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
                    <Text style={styles.nextButtonText}>
                        {stepIndex === stepOrder.length - 1 ? "I'm Okay Now" : 'Continue'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.cancelButtonText}>Exit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    inactiveContent: {
        flex: 1,
        paddingTop: 80,
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
    },
    inactiveScrollContent: {
        flexGrow: 1,
        paddingTop: 80,
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingBottom: 120,
    },
    inactiveTitle: {
        fontSize: FontSizes['2xl'],
        fontWeight: FontWeights.bold,
        color: Colors.dark.textPrimary,
        marginBottom: Spacing.sm,
    },
    inactiveSubtitle: {
        fontSize: FontSizes.base,
        color: Colors.dark.textSecondary,
        textAlign: 'center',
        marginBottom: Spacing['2xl'],
        paddingHorizontal: Spacing.lg,
    },
    panicButtonWrapper: {
        marginBottom: Spacing.lg,
    },
    panicButton: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: Colors.danger,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.danger,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.6,
        shadowRadius: 24,
        elevation: 16,
    },
    panicInnerGlow: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: Colors.dangerLight,
        opacity: 0.3,
    },
    panicIcon: {
        fontSize: 48,
        marginBottom: Spacing.sm,
    },
    panicText: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        color: '#FFFFFF',
    },
    reassurance: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textMuted,
        textAlign: 'center',
        marginBottom: Spacing['2xl'],
    },
    quickActions: {
        width: '100%',
        marginBottom: Spacing.lg,
    },
    quickActionsTitle: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.semibold,
        color: Colors.dark.textPrimary,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    quickActionsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.md,
    },
    quickAction: {
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        alignItems: 'center',
        minWidth: 90,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    quickActionIcon: {
        fontSize: 28,
        marginBottom: Spacing.xs,
    },
    quickActionText: {
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.medium,
        color: Colors.dark.textPrimary,
    },
    haltCard: {
        width: '100%',
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    haltTitle: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.semibold,
        color: Colors.dark.textPrimary,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    haltRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    haltItem: {
        alignItems: 'center',
    },
    haltEmoji: {
        fontSize: 24,
        marginBottom: 4,
    },
    haltLabel: {
        fontSize: FontSizes.xs,
        color: Colors.dark.textSecondary,
    },
    // Active intervention styles
    activeContainer: {
        flex: 1,
        backgroundColor: Colors.primary,
        paddingTop: 60,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.sm,
        paddingVertical: Spacing.lg,
    },
    progressDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    progressDotActive: {
        backgroundColor: '#FFFFFF',
    },
    stepContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
    },
    stepIcon: {
        fontSize: 80,
        marginBottom: Spacing.lg,
    },
    breatheCircle: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    breatheText: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
        color: '#FFFFFF',
    },
    stepTitle: {
        fontSize: FontSizes['3xl'],
        fontWeight: FontWeights.bold,
        color: '#FFFFFF',
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    stepDescription: {
        fontSize: FontSizes.lg,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        lineHeight: 28,
    },
    actionButtons: {
        gap: Spacing.md,
        padding: Spacing.lg,
        paddingBottom: 40,
    },
    nextButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        alignItems: 'center',
    },
    nextButtonText: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.semibold,
        color: Colors.primary,
    },
    cancelButton: {
        padding: Spacing.md,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: FontSizes.base,
        color: 'rgba(255,255,255,0.7)',
    },
});

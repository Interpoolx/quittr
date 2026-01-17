// Recovery Orb Component - Animated growing orb based on streak
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Colors } from '../constants/colors';
import { FontSizes, FontWeights } from '../constants/typography';
import { Spacing, BorderRadius } from '../constants/layout';

interface RecoveryOrbProps {
    streak: number;
    size?: 'small' | 'medium' | 'large';
}

export function RecoveryOrb({ streak, size = 'medium' }: RecoveryOrbProps) {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0.3)).current;

    // Get stage based on streak
    const getStage = () => {
        if (streak >= 90) return { name: 'Master', color: Colors.recovery.master, scale: 1.0 };
        if (streak >= 60) return { name: 'Thriving', color: Colors.recovery.thriving, scale: 0.9 };
        if (streak >= 30) return { name: 'Strong', color: Colors.recovery.strong, scale: 0.8 };
        if (streak >= 7) return { name: 'Growing', color: Colors.recovery.growing, scale: 0.7 };
        return { name: 'Beginning', color: Colors.recovery.early, scale: 0.6 };
    };

    const stage = getStage();

    // Pulse animation
    useEffect(() => {
        const pulseLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );
        pulseLoop.start();
        return () => pulseLoop.stop();
    }, [pulseAnim]);

    // Glow animation
    useEffect(() => {
        const glowLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 0.6,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0.3,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        );
        glowLoop.start();
        return () => glowLoop.stop();
    }, [glowAnim]);

    const sizeMap = {
        small: 80,
        medium: 120,
        large: 160,
    };

    const orbSize = sizeMap[size] * stage.scale;

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.orbOuter,
                    {
                        width: orbSize + 40,
                        height: orbSize + 40,
                        borderRadius: (orbSize + 40) / 2,
                        backgroundColor: stage.color,
                        opacity: glowAnim,
                        transform: [{ scale: pulseAnim }],
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.orb,
                    {
                        width: orbSize,
                        height: orbSize,
                        borderRadius: orbSize / 2,
                        borderColor: stage.color,
                        shadowColor: stage.color,
                        transform: [{ scale: pulseAnim }],
                    },
                ]}
            >
                <Text style={styles.streakNumber}>{streak}</Text>
                <Text style={styles.streakLabel}>days</Text>
            </Animated.View>
            <Text style={[styles.stageName, { color: stage.color }]}>{stage.name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    orbOuter: {
        position: 'absolute',
    },
    orb: {
        backgroundColor: Colors.dark.surface,
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 10,
    },
    streakNumber: {
        fontSize: FontSizes['3xl'],
        fontWeight: FontWeights.bold,
        color: Colors.dark.textPrimary,
    },
    streakLabel: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textSecondary,
        marginTop: -4,
    },
    stageName: {
        marginTop: Spacing.md,
        fontSize: FontSizes.base,
        fontWeight: FontWeights.semibold,
    },
});

export default RecoveryOrb;

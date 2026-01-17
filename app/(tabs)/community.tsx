// Community Screen - Forums and Support Groups
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import { Colors } from '../../src/constants/colors';
import { Spacing, BorderRadius } from '../../src/constants/layout';
import { FontSizes, FontWeights } from '../../src/constants/typography';
import { useAppSelector } from '../../src/hooks/useStore';

// Sample community posts (in a real app, this would come from a backend)
const SAMPLE_POSTS = [
    {
        id: '1',
        author: 'Anonymous',
        streak: 45,
        content: 'Just hit 45 days! Never thought I\'d make it this far. The first two weeks were the hardest, but it gets easier. Stay strong everyone! 💪',
        likes: 24,
        comments: 8,
        timeAgo: '2h ago',
    },
    {
        id: '2',
        author: 'Anonymous',
        streak: 7,
        content: 'Struggling today. Work stress is a major trigger for me. Any tips for managing urges when you\'re overwhelmed?',
        likes: 15,
        comments: 12,
        timeAgo: '4h ago',
    },
    {
        id: '3',
        author: 'Anonymous',
        streak: 90,
        content: '🎉 90 DAYS! My brain fog has cleared, my relationships are better, and I have so much more energy. Keep going - it\'s worth it!',
        likes: 56,
        comments: 23,
        timeAgo: '6h ago',
    },
    {
        id: '4',
        author: 'Anonymous',
        streak: 3,
        content: 'Day 3. Starting over again after a slip. Not giving up. This time I\'m taking it one hour at a time.',
        likes: 32,
        comments: 15,
        timeAgo: '8h ago',
    },
];

const CHALLENGES = [
    {
        id: '1',
        title: '7-Day Streak Challenge',
        participants: 1234,
        emoji: '🔥',
    },
    {
        id: '2',
        title: '30-Day Mindfulness',
        participants: 856,
        emoji: '🧘',
    },
    {
        id: '3',
        title: 'Morning Routine Builder',
        participants: 642,
        emoji: '☀️',
    },
];

export default function CommunityScreen() {
    const stats = useAppSelector((state) => state.user.stats);
    const [newPost, setNewPost] = useState('');

    const handlePost = () => {
        if (!newPost.trim()) return;

        Alert.alert(
            'Post Shared',
            'Your message has been shared with the community (Demo mode - posts are not actually stored)',
            [{ text: 'OK' }]
        );
        setNewPost('');
    };

    const getStreakBadge = (streak: number) => {
        if (streak >= 90) return { color: Colors.recovery.master, label: '90+' };
        if (streak >= 30) return { color: Colors.recovery.strong, label: '30+' };
        if (streak >= 7) return { color: Colors.recovery.growing, label: '7+' };
        return { color: Colors.recovery.early, label: streak + 'd' };
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Community</Text>
                <Text style={styles.subtitle}>You're not alone in this journey</Text>

                {/* Your Streak Badge */}
                <View style={styles.yourStreakCard}>
                    <View style={styles.yourStreakContent}>
                        <Text style={styles.yourStreakLabel}>Your Streak</Text>
                        <View style={[styles.streakBadge, { backgroundColor: getStreakBadge(stats.currentStreak).color }]}>
                            <Text style={styles.streakBadgeText}>{stats.currentStreak} days</Text>
                        </View>
                    </View>
                    <Text style={styles.yourStreakMessage}>
                        Share your progress with others to inspire them!
                    </Text>
                </View>

                {/* Post Input */}
                <View style={styles.postInputCard}>
                    <TextInput
                        style={styles.postInput}
                        placeholder="Share your thoughts, victories, or ask for support..."
                        placeholderTextColor={Colors.dark.textMuted}
                        multiline
                        value={newPost}
                        onChangeText={setNewPost}
                    />
                    <TouchableOpacity
                        style={[styles.postButton, !newPost.trim() && styles.postButtonDisabled]}
                        onPress={handlePost}
                        disabled={!newPost.trim()}
                    >
                        <Text style={styles.postButtonText}>Share</Text>
                    </TouchableOpacity>
                </View>

                {/* Active Challenges */}
                <Text style={styles.sectionTitle}>Active Challenges</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.challengesScroll}
                >
                    {CHALLENGES.map((challenge) => (
                        <TouchableOpacity key={challenge.id} style={styles.challengeCard}>
                            <Text style={styles.challengeEmoji}>{challenge.emoji}</Text>
                            <Text style={styles.challengeTitle}>{challenge.title}</Text>
                            <Text style={styles.challengeParticipants}>
                                {challenge.participants.toLocaleString()} participants
                            </Text>
                            <TouchableOpacity style={styles.joinButton}>
                                <Text style={styles.joinButtonText}>Join</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Community Feed */}
                <Text style={styles.sectionTitle}>Community Feed</Text>
                {SAMPLE_POSTS.map((post) => {
                    const badge = getStreakBadge(post.streak);
                    return (
                        <View key={post.id} style={styles.postCard}>
                            <View style={styles.postHeader}>
                                <View style={styles.authorInfo}>
                                    <View style={styles.avatar}>
                                        <Text style={styles.avatarText}>👤</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.authorName}>{post.author}</Text>
                                        <View style={styles.streakInfo}>
                                            <View style={[styles.miniStreakBadge, { backgroundColor: badge.color }]}>
                                                <Text style={styles.miniStreakText}>{badge.label}</Text>
                                            </View>
                                            <Text style={styles.timeAgo}>{post.timeAgo}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <Text style={styles.postContent}>{post.content}</Text>
                            <View style={styles.postActions}>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Text style={styles.actionIcon}>❤️</Text>
                                    <Text style={styles.actionCount}>{post.likes}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Text style={styles.actionIcon}>💬</Text>
                                    <Text style={styles.actionCount}>{post.comments}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Text style={styles.actionIcon}>🤝</Text>
                                    <Text style={styles.actionText}>Support</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}

                {/* Support Groups */}
                <Text style={styles.sectionTitle}>Support Groups</Text>
                <View style={styles.groupsGrid}>
                    {[
                        { emoji: '🌅', name: 'Morning Warriors', members: 1.2 },
                        { emoji: '💪', name: 'Accountability', members: 2.4 },
                        { emoji: '🧘', name: 'Mindfulness', members: 890 },
                        { emoji: '📖', name: 'Faith-Based', members: 1.5 },
                    ].map((group, i) => (
                        <TouchableOpacity key={i} style={styles.groupCard}>
                            <Text style={styles.groupEmoji}>{group.emoji}</Text>
                            <Text style={styles.groupName}>{group.name}</Text>
                            <Text style={styles.groupMembers}>
                                {typeof group.members === 'number' && group.members > 1000
                                    ? `${group.members}k`
                                    : group.members} members
                            </Text>
                        </TouchableOpacity>
                    ))}
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
    yourStreakCard: {
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.primary + '40',
    },
    yourStreakContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    yourStreakLabel: {
        fontSize: FontSizes.base,
        color: Colors.dark.textSecondary,
    },
    streakBadge: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
    },
    streakBadgeText: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.bold,
        color: '#FFFFFF',
    },
    yourStreakMessage: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textMuted,
    },
    postInputCard: {
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    postInput: {
        fontSize: FontSizes.base,
        color: Colors.dark.textPrimary,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    postButton: {
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.md,
        paddingVertical: Spacing.sm,
        alignItems: 'center',
        marginTop: Spacing.sm,
    },
    postButtonDisabled: {
        backgroundColor: Colors.dark.textMuted,
    },
    postButtonText: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.semibold,
        color: '#FFFFFF',
    },
    sectionTitle: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.semibold,
        color: Colors.dark.textPrimary,
        marginBottom: Spacing.md,
        marginTop: Spacing.md,
    },
    challengesScroll: {
        marginHorizontal: -Spacing.md,
        paddingHorizontal: Spacing.md,
        marginBottom: Spacing.md,
    },
    challengeCard: {
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginRight: Spacing.md,
        width: 160,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        alignItems: 'center',
    },
    challengeEmoji: {
        fontSize: 32,
        marginBottom: Spacing.sm,
    },
    challengeTitle: {
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.semibold,
        color: Colors.dark.textPrimary,
        textAlign: 'center',
        marginBottom: Spacing.xs,
    },
    challengeParticipants: {
        fontSize: FontSizes.xs,
        color: Colors.dark.textSecondary,
        marginBottom: Spacing.sm,
    },
    joinButton: {
        backgroundColor: Colors.secondary,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
    },
    joinButtonText: {
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.medium,
        color: '#FFFFFF',
    },
    postCard: {
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.md,
    },
    authorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.dark.surfaceVariant,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.sm,
    },
    avatarText: {
        fontSize: 20,
    },
    authorName: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.medium,
        color: Colors.dark.textPrimary,
    },
    streakInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    miniStreakBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.full,
    },
    miniStreakText: {
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.medium,
        color: '#FFFFFF',
    },
    timeAgo: {
        fontSize: FontSizes.xs,
        color: Colors.dark.textMuted,
    },
    postContent: {
        fontSize: FontSizes.base,
        color: Colors.dark.textPrimary,
        lineHeight: 22,
        marginBottom: Spacing.md,
    },
    postActions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: Colors.dark.border,
        paddingTop: Spacing.md,
        gap: Spacing.lg,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actionIcon: {
        fontSize: 16,
    },
    actionCount: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textSecondary,
    },
    actionText: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textSecondary,
    },
    groupsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
    },
    groupCard: {
        width: '47%',
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    groupEmoji: {
        fontSize: 28,
        marginBottom: Spacing.xs,
    },
    groupName: {
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.medium,
        color: Colors.dark.textPrimary,
        textAlign: 'center',
    },
    groupMembers: {
        fontSize: FontSizes.xs,
        color: Colors.dark.textSecondary,
    },
});

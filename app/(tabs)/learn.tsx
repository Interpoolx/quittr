// Learn Screen - Educational Content and AI Chat with Full Articles
import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Modal,
    Alert,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../../src/hooks/useStore';
import { addXP, startChallenge } from '../../src/store/slices/userSlice';
import { Colors } from '../../src/constants/colors';
import { Spacing, BorderRadius } from '../../src/constants/layout';
import { FontSizes, FontWeights } from '../../src/constants/typography';
import { ARTICLES, Article } from '../../src/content/articles';

type TabType = 'learn' | 'ai';
type CategoryFilter = 'all' | 'science' | 'tips' | 'plan' | 'mindfulness' | 'relationships';

// Pre-defined AI responses
const AI_RESPONSES: Record<string, string> = {
    'urge': `I understand you're going through a difficult moment. Here are some things that can help right now:

1. **Take 5 deep breaths** - Inhale for 4, hold for 7, exhale for 8
2. **Move your body** - Do 20 jumping jacks or take a quick walk
3. **Use the HALT check** - Are you Hungry, Angry, Lonely, or Tired?
4. **Call or text someone** - Connection helps break the cycle

Remember: This urge WILL pass. They typically peak within 15-20 minutes. You've got this! 💪`,

    'relapse': `First, take a breath. One slip doesn't erase your progress - your brain has still been healing.

What matters now is:
• **Don't binge** - One slip is a stumble, but continuing is a choice
• **Be compassionate** - Shame fuels addiction, self-kindness helps recovery
• **Learn from it** - What triggered this? What can you do differently?
• **Reset and go again** - Your next streak starts right now

Every day you stayed clean still counts. Recovery isn't a straight line. 🌱`,

    'help': `I'm here to support your recovery journey. Here are some things I can help with:

• 🆘 **Dealing with urges** - Immediate coping strategies
• 📚 **Understanding addiction** - The science behind it
• 💪 **Building new habits** - Replacing old patterns
• 🧘 **Mindfulness techniques** - Staying present
• 📈 **Tracking progress** - Celebrating milestones

What would you like to talk about?`,

    'default': `Thank you for sharing. Your recovery journey is unique, and every step matters.

Remember:
• Be patient with yourself
• Progress isn't always linear
• You're not alone in this

Would you like some tips for dealing with urges, or would you prefer to learn about the science of recovery?`
};

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

export default function LearnScreen() {
    const dispatch = useAppDispatch();
    const stats = useAppSelector((state) => state.user.stats);
    const activeChallenge = stats.activeChallenge;
    const [activeTab, setActiveTab] = useState<TabType>('learn');
    const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi! I'm Melius, your AI recovery companion. I'm here to help you through difficult moments and answer questions about your journey. How are you feeling today?",
            isUser: false,
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [showChallengeModal, setShowChallengeModal] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const filteredArticles = selectedCategory === 'all'
        ? ARTICLES
        : ARTICLES.filter(a => a.category === selectedCategory);

    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        const userMessage: Message = {
            id: `user_${Date.now()}`,
            text: inputText,
            isUser: true,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');

        // Generate AI response
        setTimeout(() => {
            const lowerInput = inputText.toLowerCase();
            let response = AI_RESPONSES['default'];

            if (lowerInput.includes('urge') || lowerInput.includes('tempted') || lowerInput.includes('craving')) {
                response = AI_RESPONSES['urge'];
            } else if (lowerInput.includes('relapse') || lowerInput.includes('slip') || lowerInput.includes('failed')) {
                response = AI_RESPONSES['relapse'];
            } else if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
                response = AI_RESPONSES['help'];
            }

            const aiMessage: Message = {
                id: `ai_${Date.now()}`,
                text: response,
                isUser: false,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMessage]);
        }, 1000);
    };

    const categories: { key: CategoryFilter; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'science', label: 'Science' },
        { key: 'tips', label: 'Tips' },
        { key: 'plan', label: '90-Day Plan' },
        { key: 'mindfulness', label: 'Mindfulness' },
    ];

    return (
        <View style={styles.container}>
            {/* Tab Switcher */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'learn' && styles.tabActive]}
                    onPress={() => setActiveTab('learn')}
                >
                    <Text style={[styles.tabText, activeTab === 'learn' && styles.tabTextActive]}>📚 Learn</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'ai' && styles.tabActive]}
                    onPress={() => setActiveTab('ai')}
                >
                    <Text style={[styles.tabText, activeTab === 'ai' && styles.tabTextActive]}>🤖 Melius AI</Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'learn' ? (
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Text style={styles.title}>Recovery Education</Text>
                    <Text style={styles.subtitle}>Science-backed knowledge to support your journey</Text>

                    {/* Categories */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat.key}
                                style={[styles.categoryChip, selectedCategory === cat.key && styles.categoryChipActive]}
                                onPress={() => setSelectedCategory(cat.key)}
                            >
                                <Text style={[styles.categoryText, selectedCategory === cat.key && styles.categoryTextActive]}>
                                    {cat.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Articles List */}
                    {filteredArticles.map((article) => (
                        <TouchableOpacity
                            key={article.id}
                            style={styles.articleCard}
                            onPress={() => setSelectedArticle(article)}
                        >
                            <View style={styles.articleEmoji}>
                                <Text style={styles.articleEmojiText}>{article.emoji}</Text>
                            </View>
                            <View style={styles.articleContent}>
                                <Text style={styles.articleCategory}>{article.category.toUpperCase()}</Text>
                                <Text style={styles.articleTitle}>{article.title}</Text>
                                <Text style={styles.articleDescription}>{article.description}</Text>
                                <Text style={styles.articleReadTime}>{article.readTime} read</Text>
                            </View>
                        </TouchableOpacity>
                    ))}

                    {/* 90-Day Challenge Banner */}
                    <View style={styles.challengeCard}>
                        <Text style={styles.challengeEmoji}>🏆</Text>
                        <Text style={styles.challengeTitle}>90-Day Reboot Challenge</Text>
                        <Text style={styles.challengeDescription}>
                            {activeChallenge
                                ? `You are currently on Day ${activeChallenge.currentDay} of the 90-day journey. Keep going!`
                                : "Complete the scientifically-designed program to rewire your brain"}
                        </Text>
                        <TouchableOpacity
                            style={styles.challengeButton}
                            onPress={() => {
                                if (activeChallenge) {
                                    // Assuming 'router' is available for navigation, e.g., from 'expo-router' or 'react-navigation'
                                    // If not, this line would need to be adapted or removed based on the actual navigation setup.
                                    // For this example, we'll assume a placeholder for navigation.
                                    // router.push('/(tabs)/challenges'); 
                                    Alert.alert("View Progress", "Navigation to challenges screen would go here.");
                                } else {
                                    setShowChallengeModal(true);
                                }
                            }}
                        >
                            <Text style={styles.challengeButtonText}>
                                {activeChallenge ? "View My Progress" : "Start Challenge"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            ) : (
                <ScrollView contentContainerStyle={styles.aiComingSoonContainer}>
                    {/* AI Coming Soon Header */}
                    <View style={styles.aiComingSoonCard}>
                        <Text style={styles.aiComingSoonEmoji}>🤖</Text>
                        <Text style={styles.aiComingSoonTitle}>Melius AI</Text>
                        <Text style={styles.aiComingSoonSubtitle}>Coming Soon</Text>
                        <Text style={styles.aiComingSoonDescription}>
                            Our AI recovery companion is being trained to provide personalized support. In the meantime, use the quick actions below for immediate help.
                        </Text>
                    </View>

                    {/* Quick Help Actions */}
                    <Text style={styles.quickHelpTitle}>Quick Support</Text>

                    <TouchableOpacity
                        style={styles.helpActionCard}
                        onPress={() => {
                            const msg = 'Remember:\n• Urges typically last only 15-20 minutes\n• Take 5 deep breaths (4 in, 7 hold, 8 out)\n• Do something physical - pushups, walk, cold water\n• Call someone you trust\n• Use the SOS button for guided support\n\nYou are stronger than this urge!';
                            Alert.alert('Having an Urge?', msg);
                        }}
                    >
                        <Text style={styles.helpActionEmoji}>🆘</Text>
                        <View style={styles.helpActionContent}>
                            <Text style={styles.helpActionTitle}>I'm having an urge</Text>
                            <Text style={styles.helpActionDescription}>Get immediate coping strategies</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.helpActionCard}
                        onPress={() => {
                            const msg = 'It\'s okay. A slip is not a relapse. Here\'s what to do:\n\n1. Don\'t beat yourself up - shame feeds the cycle\n2. Identify what triggered you\n3. Reset your counter and start fresh\n4. Learn from this and adjust your strategy\n5. Reach out to someone you trust\n\nProgress isn\'t linear. What matters is you\'re still here, still trying.';
                            Alert.alert('After a Slip', msg);
                        }}
                    >
                        <Text style={styles.helpActionEmoji}>💙</Text>
                        <View style={styles.helpActionContent}>
                            <Text style={styles.helpActionTitle}>I slipped and need support</Text>
                            <Text style={styles.helpActionDescription}>Compassionate guidance to move forward</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.helpActionCard}
                        onPress={() => {
                            const msg = 'Benefits you\'ll experience:\n\n• Better mental clarity and focus\n• More energy and motivation\n• Improved relationships and intimacy\n• Higher confidence and self-respect\n• More time for what truly matters\n• Reduced anxiety and depression\n\nEvery day clean is a victory!';
                            Alert.alert('Why Recovery Matters', msg);
                        }}
                    >
                        <Text style={styles.helpActionEmoji}>🌟</Text>
                        <View style={styles.helpActionContent}>
                            <Text style={styles.helpActionTitle}>Remind me why I'm doing this</Text>
                            <Text style={styles.helpActionDescription}>Motivation and benefits of recovery</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.helpActionCard}
                        onPress={() => {
                            const msg = '• Avoid screens 1 hour before bed\n• Keep your phone outside the bedroom\n• Establish a consistent sleep schedule\n• Practice relaxation techniques\n• Exercise during the day (not near bedtime)\n• Create a cold, dark sleeping environment\n\nGood sleep is essential for willpower!';
                            Alert.alert('Sleep & Recovery Tips', msg);
                        }}
                    >
                        <Text style={styles.helpActionEmoji}>😴</Text>
                        <View style={styles.helpActionContent}>
                            <Text style={styles.helpActionTitle}>Tips for better sleep</Text>
                            <Text style={styles.helpActionDescription}>Improve your sleep hygiene</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            )}

            {/* Article Reader Modal */}
            <Modal visible={!!selectedArticle} animationType="slide" presentationStyle="pageSheet">
                <View style={styles.articleModal}>
                    <View style={styles.articleModalHeader}>
                        <TouchableOpacity onPress={() => setSelectedArticle(null)}>
                            <Text style={styles.closeButton}>← Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.articleModalReadTime}>{selectedArticle?.readTime}</Text>
                    </View>
                    <ScrollView style={styles.articleModalContent}>
                        <Text style={styles.articleModalEmoji}>{selectedArticle?.emoji}</Text>
                        <Text style={styles.articleModalTitle}>{selectedArticle?.title}</Text>
                        <Text style={styles.articleModalBody}>{selectedArticle?.content}</Text>
                    </ScrollView>
                </View>
            </Modal>

            {/* 90-Day Challenge Modal */}
            <Modal visible={showChallengeModal} animationType="slide" transparent>
                <View style={styles.challengeModalOverlay}>
                    <View style={styles.challengeModalContent}>
                        <View style={styles.challengeModalHeader}>
                            <Text style={styles.challengeModalTitle}>🏆 90-Day Reboot Challenge</Text>
                            <TouchableOpacity onPress={() => setShowChallengeModal(false)}>
                                <Text style={styles.challengeModalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.challengeModalBody}>
                            <Text style={styles.challengeOverview}>
                                The 90-day challenge is based on neuroscience research showing that it takes approximately 90 days to form new neural pathways and break old habits.
                            </Text>

                            <Text style={styles.phaseTitle}>📅 Phase 1: Days 1-30 (Detox)</Text>
                            <Text style={styles.phaseDescription}>
                                Your brain begins adjusting. Expect withdrawal symptoms but also increasing clarity.
                            </Text>

                            <Text style={styles.phaseTitle}>💪 Phase 2: Days 31-60 (Rewiring)</Text>
                            <Text style={styles.phaseDescription}>
                                New neural pathways form. You'll notice improved focus, energy, and emotional stability.
                            </Text>

                            <Text style={styles.phaseTitle}>✨ Phase 3: Days 61-90 (Transformation)</Text>
                            <Text style={styles.phaseDescription}>
                                Your brain's reward system rebalances. Experience life with renewed appreciation.
                            </Text>

                            <View style={styles.challengeBenefits}>
                                <Text style={styles.benefitsTitle}>What You'll Gain:</Text>
                                <Text style={styles.benefitItem}>• Improved mental clarity</Text>
                                <Text style={styles.benefitItem}>• Better emotional regulation</Text>
                                <Text style={styles.benefitItem}>• Increased confidence</Text>
                                <Text style={styles.benefitItem}>• More time & energy</Text>
                                <Text style={styles.benefitItem}>• Healthier relationships</Text>
                            </View>
                        </ScrollView>
                        <View style={styles.challengeModalActions}>
                            <TouchableOpacity
                                style={styles.startChallengeButton}
                                onPress={() => {
                                    dispatch(startChallenge('90-day-reboot'));
                                    setShowChallengeModal(false);
                                    const message = 'You\'ve committed to the 90-day reboot challenge. Your journey begins now!\n\nStay strong, track your progress, and remember - every day counts.';
                                    Alert.alert('🎉 Challenge Started!', message, [{ text: 'Let\'s Go!' }]);
                                }}
                            >
                                <Text style={styles.startChallengeButtonText}>Start My 90-Day Journey</Text>
                            </TouchableOpacity>
                        </View>
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
        paddingTop: 50,
    },
    tabContainer: {
        flexDirection: 'row',
        padding: Spacing.md,
        gap: Spacing.sm,
    },
    tab: {
        flex: 1,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.dark.surface,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    tabActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    tabText: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.medium,
        color: Colors.dark.textSecondary,
    },
    tabTextActive: {
        color: '#FFFFFF',
    },
    scrollContent: {
        paddingHorizontal: Spacing.md,
        paddingBottom: 100,
    },
    title: {
        fontSize: FontSizes['2xl'],
        fontWeight: FontWeights.bold,
        color: Colors.dark.textPrimary,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        fontSize: FontSizes.base,
        color: Colors.dark.textSecondary,
        marginBottom: Spacing.md,
    },
    categoryScroll: {
        marginBottom: Spacing.lg,
        marginHorizontal: -Spacing.md,
        paddingHorizontal: Spacing.md,
    },
    categoryChip: {
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.dark.surfaceVariant,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        marginRight: Spacing.sm,
    },
    categoryChipActive: {
        backgroundColor: Colors.primary + '30',
        borderColor: Colors.primary,
    },
    categoryText: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textPrimary,
    },
    categoryTextActive: {
        color: Colors.primary,
        fontWeight: FontWeights.medium,
    },
    articleCard: {
        flexDirection: 'row',
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    articleEmoji: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.dark.surfaceVariant,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    articleEmojiText: {
        fontSize: 24,
    },
    articleContent: {
        flex: 1,
    },
    articleCategory: {
        fontSize: FontSizes.xs,
        color: Colors.primary,
        fontWeight: FontWeights.semibold,
        marginBottom: 2,
    },
    articleTitle: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.semibold,
        color: Colors.dark.textPrimary,
        marginBottom: 4,
    },
    articleDescription: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textSecondary,
        marginBottom: 4,
    },
    articleReadTime: {
        fontSize: FontSizes.xs,
        color: Colors.dark.textMuted,
    },
    challengeCard: {
        backgroundColor: Colors.primary + '15',
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.primary + '40',
        marginTop: Spacing.lg,
    },
    challengeEmoji: {
        fontSize: 48,
        marginBottom: Spacing.sm,
    },
    challengeTitle: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        color: Colors.dark.textPrimary,
        marginBottom: Spacing.xs,
    },
    challengeDescription: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textSecondary,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    challengeButton: {
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.xl,
        borderRadius: BorderRadius.full,
    },
    challengeButtonText: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.semibold,
        color: '#FFFFFF',
    },
    // Chat styles
    chatContainer: {
        flex: 1,
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: Spacing.md,
        paddingBottom: Spacing.lg,
    },
    messageBubble: {
        flexDirection: 'row',
        marginBottom: Spacing.md,
    },
    userMessage: {
        justifyContent: 'flex-end',
    },
    aiMessage: {
        justifyContent: 'flex-start',
    },
    aiAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.sm,
    },
    aiAvatarText: {
        fontSize: 20,
    },
    messageContent: {
        maxWidth: '80%',
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
    },
    userMessageContent: {
        backgroundColor: Colors.primary,
    },
    aiMessageContent: {
        backgroundColor: Colors.dark.surface,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    messageText: {
        fontSize: FontSizes.base,
        color: Colors.dark.textPrimary,
        lineHeight: 22,
    },
    userMessageText: {
        color: '#FFFFFF',
    },
    quickActions: {
        flexDirection: 'row',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.md,
        marginBottom: Spacing.sm,
    },
    quickAction: {
        flex: 1,
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.full,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    quickActionText: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textPrimary,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: Spacing.md,
        paddingBottom: Platform.OS === 'ios' ? 30 : Spacing.md,
        gap: Spacing.sm,
    },
    textInput: {
        flex: 1,
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        fontSize: FontSizes.base,
        color: Colors.dark.textPrimary,
        maxHeight: 100,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: Colors.dark.surfaceVariant,
    },
    sendButtonText: {
        fontSize: FontSizes.xl,
        color: '#FFFFFF',
    },
    // Article Modal
    articleModal: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    articleModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.md,
        paddingTop: 60,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
    },
    closeButton: {
        fontSize: FontSizes.base,
        color: Colors.primary,
        fontWeight: FontWeights.medium,
    },
    articleModalReadTime: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textSecondary,
    },
    articleModalContent: {
        padding: Spacing.lg,
        paddingBottom: 100,
    },
    articleModalEmoji: {
        fontSize: 60,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    articleModalTitle: {
        fontSize: FontSizes['2xl'],
        fontWeight: FontWeights.bold,
        color: Colors.dark.textPrimary,
        textAlign: 'center',
        marginBottom: Spacing.xl,
    },
    articleModalBody: {
        fontSize: FontSizes.base,
        color: Colors.dark.textPrimary,
        lineHeight: 26,
    },
    // Challenge Modal Styles
    challengeModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    challengeModalContent: {
        backgroundColor: Colors.dark.surface,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        maxHeight: '85%',
    },
    challengeModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
    },
    challengeModalTitle: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        color: Colors.dark.textPrimary,
    },
    challengeModalClose: {
        fontSize: FontSizes.xl,
        color: Colors.dark.textSecondary,
        padding: Spacing.sm,
    },
    challengeModalBody: {
        padding: Spacing.lg,
    },
    challengeOverview: {
        fontSize: FontSizes.base,
        color: Colors.dark.textSecondary,
        lineHeight: 24,
        marginBottom: Spacing.lg,
        textAlign: 'center',
    },
    phaseTitle: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.semibold,
        color: Colors.dark.textPrimary,
        marginTop: Spacing.md,
        marginBottom: Spacing.xs,
    },
    phaseDescription: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textSecondary,
        lineHeight: 22,
        marginBottom: Spacing.sm,
    },
    challengeBenefits: {
        backgroundColor: Colors.dark.surfaceVariant,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginTop: Spacing.lg,
    },
    benefitsTitle: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.semibold,
        color: Colors.dark.textPrimary,
        marginBottom: Spacing.sm,
    },
    benefitItem: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textSecondary,
        lineHeight: 24,
    },
    challengeModalActions: {
        padding: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.dark.border,
    },
    startChallengeButton: {
        backgroundColor: Colors.primary,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
    },
    startChallengeButtonText: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.semibold,
        color: '#FFFFFF',
    },
    // AI Coming Soon Styles
    aiComingSoonContainer: {
        padding: Spacing.lg,
        paddingBottom: 100,
    },
    aiComingSoonCard: {
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.primary + '40',
        marginBottom: Spacing.xl,
    },
    aiComingSoonEmoji: {
        fontSize: 48,
        marginBottom: Spacing.md,
    },
    aiComingSoonTitle: {
        fontSize: FontSizes['2xl'],
        fontWeight: FontWeights.bold,
        color: Colors.primary,
        marginBottom: Spacing.xs,
    },
    aiComingSoonSubtitle: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.semibold,
        color: Colors.warning,
        marginBottom: Spacing.md,
    },
    aiComingSoonDescription: {
        fontSize: FontSizes.base,
        color: Colors.dark.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    quickHelpTitle: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        color: Colors.dark.textPrimary,
        marginBottom: Spacing.md,
    },
    helpActionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    helpActionEmoji: {
        fontSize: 32,
        marginRight: Spacing.md,
    },
    helpActionContent: {
        flex: 1,
    },
    helpActionTitle: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.semibold,
        color: Colors.dark.textPrimary,
        marginBottom: 2,
    },
    helpActionDescription: {
        fontSize: FontSizes.sm,
        color: Colors.dark.textSecondary,
    },
});

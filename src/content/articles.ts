// Educational Articles Content
export interface Article {
    id: string;
    category: 'science' | 'tips' | 'plan' | 'mindfulness' | 'relationships';
    title: string;
    description: string;
    emoji: string;
    readTime: string;
    content: string;
}

export const ARTICLES: Article[] = [
    {
        id: '1',
        category: 'science',
        title: 'How Porn Affects Your Brain',
        description: 'Understanding the dopamine cycle and why quitting is so hard.',
        emoji: '🧠',
        readTime: '5 min',
        content: `# How Porn Affects Your Brain

## The Dopamine Connection

Pornography hijacks your brain's reward system. When you view porn, your brain releases dopamine - the same chemical released during eating, exercise, and other pleasurable activities.

**The problem?** Porn provides an unnaturally high dopamine spike, much higher than natural rewards.

## The Tolerance Effect

Over time, your brain adapts:

1. **Desensitization**: You need more extreme content to get the same "high"
2. **Sensitization**: Your brain becomes hyper-reactive to porn-related cues
3. **Hypofrontality**: Your prefrontal cortex (willpower center) weakens

## The Good News

Your brain is plastic - it can rewire itself. Studies show that after 90 days of abstinence:

- Dopamine receptors begin to heal
- Your brain's reward sensitivity normalizes
- Willpower and decision-making improve

## Key Takeaways

- Porn addiction is a real neurological condition
- Your brain CAN recover
- The first 2-3 weeks are the hardest
- Every day clean helps rebuild your neural pathways`,
    },
    {
        id: '2',
        category: 'tips',
        title: 'The HALT Method',
        description: "Recognize when you're Hungry, Angry, Lonely, or Tired.",
        emoji: '🛑',
        readTime: '3 min',
        content: `# The HALT Method

## What is HALT?

HALT is an acronym that helps you identify the most common triggers for urges:

- **H** - Hungry
- **A** - Angry
- **L** - Lonely
- **T** - Tired

## Why HALT Works

Most relapses don't happen randomly. They occur when you're in a vulnerable state. By checking in with HALT, you can:

1. Identify your current vulnerability
2. Address the root cause
3. Prevent the urge from escalating

## How to Use HALT

When you feel an urge, ask yourself:

### Am I Hungry?
Low blood sugar affects decision-making. Eat something nutritious.

### Am I Angry?
Unprocessed emotions seek an outlet. Try exercise, journaling, or talking to someone.

### Am I Lonely?
Isolation is a major trigger. Reach out to a friend or join a community.

### Am I Tired?
Fatigue weakens willpower. Take a nap, go to bed early, or take a break.

## Pro Tip

Check in with HALT every evening. Many relapses happen late at night when you're tired and alone.`,
    },
    {
        id: '3',
        category: 'plan',
        title: 'Week 1: Breaking the Cycle',
        description: 'Your first week is about awareness and building new habits.',
        emoji: '📅',
        readTime: '4 min',
        content: `# Week 1: Breaking the Cycle

## Your First 7 Days

The first week is about **awareness** and **interrupting the autopilot**.

## Day 1-2: Remove Triggers

Start by removing easy access:
- Clear browser history
- Delete bookmarks
- Uninstall triggering apps
- Set up device restrictions

## Day 3-4: Identify Your Patterns

Pay attention to WHEN urges hit:
- What time of day?
- What emotional state?
- What triggers (stress, boredom, loneliness)?

Write these down in your journal.

## Day 5-7: Build Replacement Habits

Replace the old habit with new ones:
- Exercise when you feel restless
- Call a friend when lonely
- Cold shower when tempted
- Journal when stressed

## What to Expect

**Physical**: Possible restlessness, difficulty sleeping, mild irritability.

**Mental**: Brain fog, difficulty concentrating (temporary).

**Emotional**: Mood swings, heightened anxiety.

## Remember

These symptoms are signs that your brain is healing. They're temporary and will pass. You're breaking free from a powerful cycle.

## Daily Practice

1. Morning: Set your intention
2. Throughout: Use HALT check
3. Evening: Journal and check-in`,
    },
    {
        id: '4',
        category: 'mindfulness',
        title: 'Urge Surfing Technique',
        description: 'Learn to ride the wave of urges without acting on them.',
        emoji: '🌊',
        readTime: '4 min',
        content: `# Urge Surfing

## What is Urge Surfing?

Urge surfing is a mindfulness technique that treats urges like ocean waves. Instead of fighting against them (which often backfires), you learn to "ride" them until they naturally subside.

## The Science

Urges typically peak within **15-20 minutes** and then decrease. If you can ride out this peak, the urge will pass without you acting on it.

## How to Urge Surf

### Step 1: Notice
When an urge arises, simply notice it. Say to yourself: "I'm having an urge."

### Step 2: Observe
Where do you feel it in your body? Is it in your chest? Stomach? Head?

### Step 3: Breathe
Take slow, deep breaths. Inhale for 4 seconds, hold for 7, exhale for 8.

### Step 4: Accept
Don't fight the urge. Let it be there. Fighting often strengthens urges.

### Step 5: Wait
Watch the urge rise like a wave, peak, and then naturally fall.

## The Mantra

"This urge is temporary. I don't have to act on it. It will pass."

## Pro Tips

- Set a 20-minute timer when an urge hits
- Keep your hands busy during this time
- Move to a different room
- Stay in public if possible`,
    },
    {
        id: '5',
        category: 'science',
        title: 'The Reboot Timeline',
        description: 'What happens to your brain at 7, 30, 60, and 90 days.',
        emoji: '📈',
        readTime: '6 min',
        content: `# The Reboot Timeline

## What to Expect During Recovery

Your brain needs time to heal. Here's what typically happens at each milestone:

## Week 1 (Days 1-7)
**The Withdrawal Phase**

- Strongest urges and cravings
- Possible mood swings
- Difficulty sleeping
- Low motivation

*Why it happens*: Your brain is used to high dopamine and is "complaining."

## Week 2-4 (Days 8-30)
**The Flatline**

- Urges may decrease temporarily
- Low libido (normal and temporary)
- Brain fog lifting
- More emotional sensitivity

*Why it happens*: Your dopamine system is recalibrating.

## Month 2 (Days 31-60)
**The Rewiring Phase**

- Urges return but feel more manageable
- More mental clarity
- Better focus and productivity
- Emotions stabilizing
- More energy

*Why it happens*: New neural pathways are forming.

## Month 3 (Days 61-90)
**The Transformation**

- Significant reduction in urges
- Better sleep quality
- Improved confidence
- Healthier attraction patterns
- Stronger willpower

*Why it happens*: Your brain's reward system is normalizing.

## After 90 Days

The "reboot" is considered complete, but recovery is ongoing:
- Continue healthy habits
- Stay vigilant with triggers
- Keep building your new life

## Remember

Everyone's timeline is different. Some heal faster, others slower. The key is consistency.`,
    },
    {
        id: '6',
        category: 'relationships',
        title: 'Rebuilding Intimacy',
        description: 'How recovery improves your real-world connections.',
        emoji: '❤️',
        readTime: '5 min',
        content: `# Rebuilding Intimacy

## The Impact of Porn on Relationships

Porn creates unrealistic expectations and can damage real-world relationships:

- Decreased attraction to real partners
- Difficulty with emotional intimacy
- Performance anxiety
- Objectification of partners
- Secrecy and shame creating distance

## How Recovery Helps

As you heal, you'll notice improvements:

### Month 1
- More present in conversations
- Less comparison to unrealistic standards
- Starting to appreciate real connection

### Month 2-3
- Deeper emotional conversations
- More physical attraction to real people
- Less objectification, more appreciation
- Better communication

### Month 3+
- Genuine intimacy becomes possible
- Improved relationship satisfaction
- More confidence in yourself
- Ability to be vulnerable

## Tips for Rebuilding

1. **Communication**: If you have a partner, consider opening up about your journey
2. **Patience**: Healing takes time for both partners
3. **Focus on Non-Sexual Intimacy**: Cuddling, holding hands, quality time
4. **Professional Help**: Couples therapy can help

## For Singles

Recovery makes you a better future partner:
- You'll be more emotionally available
- More realistic expectations
- Better at genuine connection
- More confident and authentic`,
    },
    {
        id: '7',
        category: 'tips',
        title: '10 Instant Urge Killers',
        description: 'Quick tactics to break the urge cycle immediately.',
        emoji: '⚡',
        readTime: '3 min',
        content: `# 10 Instant Urge Killers

When urges hit, try these proven tactics:

## Physical

### 1. Cold Shower
The shock resets your nervous system. Even just cold water on your face helps.

### 2. Exercise
Do 20 push-ups, run in place, or take a brisk walk. Physical activity redirects energy.

### 3. Leave the Room
Physical distance creates mental distance. Go outside if possible.

## Mental

### 4. Call Someone
Call a friend, family member, or accountability partner. Connection breaks isolation.

### 5. Write It Out
Journal about what you're feeling. Getting it out of your head helps.

### 6. Future Self Visualization
Imagine yourself tomorrow morning. How will you feel if you relapse vs. if you stay strong?

## Distraction

### 7. Start a Task
Begin a project, chore, or activity. Engagement breaks the urge cycle.

### 8. Watch Something Inspiring
TED talks, documentaries, or motivational content can shift your mindset.

### 9. Play a Game
Video games, puzzles, or anything that requires focus.

### 10. Go Public
Go to a coffee shop, library, or anywhere with other people. Public spaces = safety.

## Remember

The goal isn't to win every battle perfectly. It's to have enough tools that you can always find SOMETHING that works in the moment.`,
    },
    {
        id: '8',
        category: 'mindfulness',
        title: 'The 5-4-3-2-1 Grounding Technique',
        description: 'A powerful method to break anxious thought patterns.',
        emoji: '🌍',
        readTime: '3 min',
        content: `# 5-4-3-2-1 Grounding Technique

## What is Grounding?

Grounding is a mindfulness technique that brings you back to the present moment. It's especially helpful when you feel overwhelmed, anxious, or caught in urge-driven thinking.

## How to Do It

Take a slow, deep breath and identify:

### 5 Things You Can SEE
Look around and name 5 things in your environment. Be specific: "blue coffee mug," "sunlight on the wall," "my phone on the desk."

### 4 Things You Can TOUCH
Notice 4 textures around you: your clothes, the chair, the floor, your skin.

### 3 Things You Can HEAR
What sounds are present? Traffic, birds, air conditioning, your own breathing.

### 2 Things You Can SMELL
Notice any scents: coffee, fresh air, your soap, food.

### 1 Thing You Can TASTE
What's in your mouth right now? Water, toothpaste, coffee.

## Why It Works

This technique:
- Activates your five senses
- Interrupts rumination and urge-thinking
- Brings you back to the present
- Calms your nervous system

## When to Use It

- When urges feel overwhelming
- During anxiety or panic
- When you can't stop thinking about triggers
- Before making any important decision

## Practice Daily

The more you practice grounding, the easier it becomes to use when you really need it.`,
    },
];

// Get articles by category
export function getArticlesByCategory(category: Article['category']): Article[] {
    return ARTICLES.filter(article => article.category === category);
}

// Get article by ID
export function getArticleById(id: string): Article | undefined {
    return ARTICLES.find(article => article.id === id);
}

// Get all categories
export function getCategories(): Article['category'][] {
    return ['science', 'tips', 'plan', 'mindfulness', 'relationships'];
}

export default ARTICLES;

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import MotivationalQuote

quotes = [
    {"text": "Success is not final, failure is not fatal: it is the courage to continue that counts.", "author": "Winston Churchill", "category": "success"},
    {"text": "The only way to do great work is to love what you do.", "author": "Steve Jobs", "category": "motivation"},
    {"text": "Believe you can and you're halfway there.", "author": "Theodore Roosevelt", "category": "motivation"},
    {"text": "Don't watch the clock; do what it does. Keep going.", "author": "Sam Levenson", "category": "productivity"},
    {"text": "The future belongs to those who believe in the beauty of their dreams.", "author": "Eleanor Roosevelt", "category": "success"},
    {"text": "It does not matter how slowly you go as long as you do not stop.", "author": "Confucius", "category": "perseverance"},
    {"text": "Everything you've ever wanted is on the other side of fear.", "author": "George Addair", "category": "motivation"},
    {"text": "Success is walking from failure to failure with no loss of enthusiasm.", "author": "Winston Churchill", "category": "success"},
    {"text": "The only impossible journey is the one you never begin.", "author": "Tony Robbins", "category": "motivation"},
    {"text": "In this life we cannot do great things. We can only do small things with great love.", "author": "Mother Teresa", "category": "general"},
    {"text": "Focus on being productive instead of busy.", "author": "Tim Ferriss", "category": "productivity"},
    {"text": "The expert in anything was once a beginner.", "author": "Helen Hayes", "category": "learning"},
    {"text": "Your limitation—it's only your imagination.", "author": "Unknown", "category": "motivation"},
    {"text": "Push yourself, because no one else is going to do it for you.", "author": "Unknown", "category": "motivation"},
    {"text": "Great things never come from comfort zones.", "author": "Unknown", "category": "success"},
    {"text": "Dream it. Wish it. Do it.", "author": "Unknown", "category": "motivation"},
    {"text": "Success doesn't just find you. You have to go out and get it.", "author": "Unknown", "category": "success"},
    {"text": "The harder you work for something, the greater you'll feel when you achieve it.", "author": "Unknown", "category": "success"},
    {"text": "Dream bigger. Do bigger.", "author": "Unknown", "category": "motivation"},
    {"text": "Don't stop when you're tired. Stop when you're done.", "author": "Unknown", "category": "perseverance"},
    {"text": "Wake up with determination. Go to bed with satisfaction.", "author": "Unknown", "category": "productivity"},
    {"text": "Do something today that your future self will thank you for.", "author": "Sean Patrick Flanery", "category": "motivation"},
    {"text": "Little things make big days.", "author": "Unknown", "category": "general"},
    {"text": "It's going to be hard, but hard does not mean impossible.", "author": "Unknown", "category": "perseverance"},
    {"text": "Don't wait for opportunity. Create it.", "author": "Unknown", "category": "success"},
    {"text": "Sometimes we're tested not to show our weaknesses, but to discover our strengths.", "author": "Unknown", "category": "motivation"},
    {"text": "The key to success is to focus on goals, not obstacles.", "author": "Unknown", "category": "focus"},
    {"text": "Dream it. Believe it. Build it.", "author": "Unknown", "category": "success"},
    {"text": "What you get by achieving your goals is not as important as what you become by achieving your goals.", "author": "Zig Ziglar", "category": "success"},
    {"text": "Don't be afraid to give up the good to go for the great.", "author": "John D. Rockefeller", "category": "success"},
    {"text": "I find that the harder I work, the more luck I seem to have.", "author": "Thomas Jefferson", "category": "productivity"},
    {"text": "Success is the sum of small efforts repeated day in and day out.", "author": "Robert Collier", "category": "perseverance"},
    {"text": "If you are working on something that you really care about, you don't have to be pushed. The vision pulls you.", "author": "Steve Jobs", "category": "motivation"},
    {"text": "People who are crazy enough to think they can change the world, are the ones who do.", "author": "Rob Siltanen", "category": "success"},
    {"text": "Failure will never overtake me if my determination to succeed is strong enough.", "author": "Og Mandino", "category": "perseverance"},
    {"text": "We may encounter many defeats but we must not be defeated.", "author": "Maya Angelou", "category": "perseverance"},
    {"text": "Knowing is not enough; we must apply. Wishing is not enough; we must do.", "author": "Johann Wolfgang Von Goethe", "category": "productivity"},
    {"text": "Imagine your life is perfect in every respect; what would it look like?", "author": "Brian Tracy", "category": "motivation"},
    {"text": "We generate fears while we sit. We overcome them by action.", "author": "Dr. Henry Link", "category": "motivation"},
    {"text": "Whether you think you can or think you can't, you're right.", "author": "Henry Ford", "category": "motivation"},
    {"text": "Security is mostly a superstition. Life is either a daring adventure or nothing.", "author": "Helen Keller", "category": "motivation"},
    {"text": "The man who has confidence in himself gains the confidence of others.", "author": "Hasidic Proverb", "category": "success"},
    {"text": "The only limit to our realization of tomorrow will be our doubts of today.", "author": "Franklin D. Roosevelt", "category": "motivation"},
    {"text": "Creativity is intelligence having fun.", "author": "Albert Einstein", "category": "learning"},
    {"text": "What we fear doing most is usually what we most need to do.", "author": "Tim Ferriss", "category": "motivation"},
    {"text": "You are never too old to set another goal or to dream a new dream.", "author": "C.S. Lewis", "category": "motivation"},
    {"text": "To live a creative life, we must lose our fear of being wrong.", "author": "Anonymous", "category": "learning"},
    {"text": "If you are not willing to risk the usual you will have to settle for the ordinary.", "author": "Jim Rohn", "category": "success"},
    {"text": "Trust because you are willing to accept the risk, not because it's safe or certain.", "author": "Anonymous", "category": "motivation"},
    {"text": "All our dreams can come true if we have the courage to pursue them.", "author": "Walt Disney", "category": "success"},
]

# Clear existing quotes (optional)
print("Clearing existing quotes...")
MotivationalQuote.objects.all().delete()

# Add new quotes
print(f"Adding {len(quotes)} motivational quotes...")
for quote_data in quotes:
    MotivationalQuote.objects.create(**quote_data)
    
print(f"✅ Successfully added {len(quotes)} quotes!")
print("You can now see them on the Motivation page!")

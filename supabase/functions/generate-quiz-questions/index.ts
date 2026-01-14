import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuizQuestion {
  celebrity: string;
  emoji: string;
  category: string;
  correctTime: string;
  options: string[];
  itemName: string;
  itemEmoji: string;
  itemValue: number;
  annualEarnings: number;
  funFact: string;
}

// Items for quiz questions with realistic values
const QUIZ_ITEMS = [
  { name: 'Tesla Model 3', emoji: '🚗', value: 40000 },
  { name: 'Luxury Rolex', emoji: '⌚', value: 15000 },
  { name: 'iPhone 15 Pro Max', emoji: '📱', value: 1200 },
  { name: 'Average monthly rent', emoji: '🏠', value: 2000 },
  { name: 'Designer handbag', emoji: '👜', value: 5000 },
  { name: 'PS5 Bundle', emoji: '🎮', value: 600 },
  { name: 'MacBook Pro', emoji: '💻', value: 3000 },
  { name: 'GoPro Camera', emoji: '📸', value: 500 },
  { name: 'Round-trip first class flight', emoji: '✈️', value: 10000 },
  { name: 'Vacation package', emoji: '🏝️', value: 8000 },
];

// Celebrity pool for questions
const CELEBRITY_POOL = [
  { name: 'Elon Musk', category: 'Tech Titan', emoji: '🚀' },
  { name: 'Taylor Swift', category: 'Pop Royalty', emoji: '🎤' },
  { name: 'LeBron James', category: 'Sports Legend', emoji: '🏀' },
  { name: 'Jeff Bezos', category: 'E-Commerce King', emoji: '📦' },
  { name: 'Beyoncé', category: 'Music Mogul', emoji: '👑' },
  { name: 'Cristiano Ronaldo', category: 'Football Icon', emoji: '⚽' },
  { name: 'Oprah Winfrey', category: 'Media Queen', emoji: '📺' },
  { name: 'MrBeast', category: 'YouTube King', emoji: '🎬' },
  { name: 'Rihanna', category: 'Beauty Billionaire', emoji: '💄' },
  { name: 'Lionel Messi', category: 'Football Legend', emoji: '⚽' },
  { name: 'Kim Kardashian', category: 'Reality Royalty', emoji: '📱' },
  { name: 'Dwayne Johnson', category: 'Hollywood Titan', emoji: '💪' },
  { name: 'Travis Scott', category: 'Hip-Hop Mogul', emoji: '🎵' },
  { name: 'Kylie Jenner', category: 'Beauty Mogul', emoji: '💋' },
  { name: 'Drake', category: 'Rap Royalty', emoji: '🎤' },
];

function calculateTimeToEarn(annualEarnings: number, itemValue: number): { time: string; seconds: number } {
  const earningsPerSecond = annualEarnings / (365 * 24 * 60 * 60);
  const secondsToEarn = itemValue / earningsPerSecond;
  
  if (secondsToEarn < 60) {
    const rounded = Math.round(secondsToEarn);
    return { time: `${rounded} seconds`, seconds: secondsToEarn };
  } else if (secondsToEarn < 3600) {
    const minutes = Math.round(secondsToEarn / 60);
    return { time: `${minutes} minutes`, seconds: secondsToEarn };
  } else if (secondsToEarn < 86400) {
    const hours = Math.round(secondsToEarn / 3600);
    return { time: `${hours} hours`, seconds: secondsToEarn };
  } else {
    const days = Math.round(secondsToEarn / 86400);
    return { time: `${days} days`, seconds: secondsToEarn };
  }
}

function generateOptions(correctTime: string, secondsToEarn: number): string[] {
  const options: string[] = [correctTime];
  const multipliers = [0.1, 0.25, 3, 8, 24, 48];
  
  // Generate wrong options based on different time scales
  while (options.length < 4) {
    const multiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
    const wrongSeconds = secondsToEarn * multiplier;
    
    let wrongTime: string;
    if (wrongSeconds < 60) {
      wrongTime = `${Math.max(1, Math.round(wrongSeconds))} seconds`;
    } else if (wrongSeconds < 3600) {
      wrongTime = `${Math.round(wrongSeconds / 60)} minutes`;
    } else if (wrongSeconds < 86400) {
      wrongTime = `${Math.round(wrongSeconds / 3600)} hours`;
    } else if (wrongSeconds < 604800) {
      wrongTime = `${Math.round(wrongSeconds / 86400)} days`;
    } else {
      wrongTime = `${Math.round(wrongSeconds / 604800)} weeks`;
    }
    
    if (!options.includes(wrongTime) && wrongTime !== correctTime) {
      options.push(wrongTime);
    }
  }
  
  // Shuffle options
  return options.sort(() => Math.random() - 0.5);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');
    
    if (!PERPLEXITY_API_KEY) {
      console.error('PERPLEXITY_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { count = 5 } = await req.json().catch(() => ({}));
    
    // Shuffle and select celebrities
    const shuffledCelebs = [...CELEBRITY_POOL].sort(() => Math.random() - 0.5).slice(0, count);
    
    // Fetch earnings data from Perplexity for each celebrity
    const questions: QuizQuestion[] = [];
    
    for (const celeb of shuffledCelebs) {
      try {
        console.log(`Fetching earnings for ${celeb.name}...`);
        
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'sonar',
            messages: [
              {
                role: 'system',
                content: 'You are a financial data expert. Return ONLY valid JSON with no markdown, no code blocks, no explanation. Just the raw JSON object.'
              },
              {
                role: 'user',
                content: `What is ${celeb.name}'s estimated annual earnings or income for 2024? I need their YEARLY income from all sources (salary, endorsements, investments, etc).

Return a JSON object with:
- annualEarnings: number in USD (e.g., 100000000 for $100 million per year)
- funFact: a short fun fact about their wealth or earnings (max 80 characters)

Be accurate based on recent Forbes, Bloomberg, or financial reports. Return ONLY the JSON.`
              }
            ],
            search_recency_filter: 'month',
            temperature: 0,
          }),
        });

        if (!response.ok) {
          console.error(`Perplexity error for ${celeb.name}:`, response.status);
          continue;
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        
        console.log(`Perplexity response for ${celeb.name}:`, content.substring(0, 200));
        
        // Parse JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.log(`Could not parse JSON for ${celeb.name}`);
          continue;
        }
        
        const parsed = JSON.parse(jsonMatch[0]);
        const annualEarnings = Number(parsed.annualEarnings);
        
        if (!annualEarnings || annualEarnings < 1000000) {
          console.log(`Invalid earnings for ${celeb.name}:`, annualEarnings);
          continue;
        }
        
        // Pick a random item for the question
        const item = QUIZ_ITEMS[Math.floor(Math.random() * QUIZ_ITEMS.length)];
        
        // Calculate time to earn
        const { time: correctTime, seconds } = calculateTimeToEarn(annualEarnings, item.value);
        
        // Generate options
        const options = generateOptions(correctTime, seconds);
        
        // Create question
        const question: QuizQuestion = {
          celebrity: celeb.name,
          emoji: celeb.emoji,
          category: celeb.category,
          correctTime,
          options,
          itemName: item.name,
          itemEmoji: item.emoji,
          itemValue: item.value,
          annualEarnings,
          funFact: parsed.funFact || `${celeb.name} earns an incredible amount every single day!`,
        };
        
        questions.push(question);
        console.log(`Generated question for ${celeb.name}: ${correctTime} to earn ${item.name}`);
        
      } catch (error) {
        console.error(`Error processing ${celeb.name}:`, error);
      }
    }
    
    if (questions.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'Failed to generate questions',
        questions: []
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ 
      questions,
      count: questions.length
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating quiz questions:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      questions: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS configuration - restrict to allowed origins
const ALLOWED_ORIGINS = [
  'https://earningsexplorer.shop',
  'https://www.earningsexplorer.shop',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:8080',
];

function getCorsHeaders(origin: string | null): Record<string, string> {
  // Allow production, localhost, and preview/staging domains
  const allowedOrigin = origin && (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.lovable.app'))
    ? origin
    : ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// Question types for variety
type QuestionType = 'time_to_earn' | 'net_worth_comparison' | 'income_source' | 'wealth_fact';

interface QuizQuestion {
  questionType: QuestionType;
  questionText: string;
  celebrity: string;
  celebrity2?: string;
  emoji: string;
  emoji2?: string;
  category: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  educationalFact: string;
}

// Items for time-to-earn questions with realistic values
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
  { name: 'Average US annual salary', emoji: '💵', value: 60000 },
  { name: 'College tuition (1 year)', emoji: '🎓', value: 35000 },
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
  { name: 'Mark Zuckerberg', category: 'Tech Founder', emoji: '👤' },
  { name: 'Warren Buffett', category: 'Investment Legend', emoji: '📈' },
  { name: 'Serena Williams', category: 'Tennis Icon', emoji: '🎾' },
  { name: 'Jay-Z', category: 'Hip-Hop Billionaire', emoji: '🎤' },
  { name: 'Roger Federer', category: 'Tennis Legend', emoji: '🎾' },
];

// Educational wealth facts for true/false questions
const WEALTH_FACTS = [
  {
    celebrity: 'Elon Musk',
    trueFact: 'became a billionaire before age 40',
    falseFact: 'inherited most of his wealth from family',
    explanation: 'Musk built his wealth through startups like PayPal, Tesla, and SpaceX - he was a billionaire by age 41.',
  },
  {
    celebrity: 'Taylor Swift',
    trueFact: 'earns more from touring than streaming',
    falseFact: 'makes most of her money from Spotify streams',
    explanation: 'Concert tours and live performances generate the majority of income for top artists, often 80%+ of their earnings.',
  },
  {
    celebrity: 'Warren Buffett',
    trueFact: 'made 99% of his wealth after age 50',
    falseFact: 'was a billionaire by age 30',
    explanation: 'Compound interest takes time! Buffett became a billionaire at 56 and made most of his fortune after 60.',
  },
  {
    celebrity: 'Rihanna',
    trueFact: 'makes more from Fenty Beauty than music',
    falseFact: 'earns most of her income from music royalties',
    explanation: 'Fenty Beauty generated over $550M in revenue, making her a billionaire mainly through cosmetics, not music.',
  },
  {
    celebrity: 'LeBron James',
    trueFact: 'earns more from endorsements than his NBA salary',
    falseFact: 'makes most of his money from his basketball contract',
    explanation: 'LeBron earns ~$50M+ annually from Nike and other endorsements, compared to his ~$44M NBA salary.',
  },
  {
    celebrity: 'Oprah Winfrey',
    trueFact: 'became a billionaire through owning her own content',
    falseFact: 'made most of her wealth from her TV show salary',
    explanation: 'Owning Harpo Productions meant Oprah kept the profits from syndication, not just a salary.',
  },
  {
    celebrity: 'Jeff Bezos',
    trueFact: 'started Amazon in his garage',
    falseFact: 'came from a wealthy family that funded Amazon',
    explanation: 'Bezos received a $250K investment from his parents but built Amazon from a garage in Bellevue, WA.',
  },
  {
    celebrity: 'MrBeast',
    trueFact: 'reinvests most of his YouTube earnings back into videos',
    falseFact: 'keeps most of his ad revenue as profit',
    explanation: 'MrBeast famously spends millions per video on production and giveaways, reinvesting almost all revenue.',
  },
];

// Income source data for breakdown questions
const INCOME_SOURCES = [
  {
    celebrity: 'Cristiano Ronaldo',
    emoji: '⚽',
    sources: [
      { source: 'Salary & Bonuses', percentage: 35 },
      { source: 'Endorsements', percentage: 50 },
      { source: 'Social Media', percentage: 15 },
    ],
    question: 'What is Cristiano Ronaldo\'s largest income source?',
    correct: 'Endorsements',
    explanation: 'Despite earning ~$75M from Al-Nassr, CR7 makes even more from Nike, Clear, and other sponsors.',
  },
  {
    celebrity: 'Kim Kardashian',
    emoji: '📱',
    sources: [
      { source: 'SKIMS (shapewear)', percentage: 55 },
      { source: 'Reality TV', percentage: 15 },
      { source: 'Social Media & Endorsements', percentage: 30 },
    ],
    question: 'What is Kim Kardashian\'s primary income source?',
    correct: 'SKIMS (shapewear)',
    explanation: 'Kim\'s SKIMS brand is valued at over $4 billion, making it her largest wealth generator.',
  },
  {
    celebrity: 'Dwayne Johnson',
    emoji: '💪',
    sources: [
      { source: 'Film Salaries', percentage: 45 },
      { source: 'Teremana Tequila', percentage: 35 },
      { source: 'Under Armour & Other', percentage: 20 },
    ],
    question: 'Which source generates more income for The Rock?',
    correct: 'Film Salaries',
    explanation: 'The Rock commands $20-25M per film, though his Teremana brand is rapidly growing.',
  },
  {
    celebrity: 'Beyoncé',
    emoji: '👑',
    sources: [
      { source: 'Touring', percentage: 60 },
      { source: 'Music Royalties', percentage: 15 },
      { source: 'Ivy Park & Endorsements', percentage: 25 },
    ],
    question: 'What is Beyoncé\'s biggest money-maker?',
    correct: 'Touring',
    explanation: 'The Renaissance Tour grossed over $500M - live performances dwarf streaming revenue for top artists.',
  },
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

function generateTimeOptions(correctTime: string, secondsToEarn: number): string[] {
  const options: string[] = [correctTime];
  const multipliers = [0.1, 0.25, 3, 8, 24, 48];
  
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
  
  return options.sort(() => Math.random() - 0.5);
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function formatMoney(amount: number): string {
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(0)}M`;
  return `$${amount.toLocaleString()}`;
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims?.sub) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = claimsData.claims.sub;
    console.log(`Quiz questions requested by user: ${userId}`);

    // Rate limiting
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const rateLimitKey = `quiz_${userId}_${clientIp}`;
    
    const { data: isRateLimited } = await supabaseClient.rpc('check_rate_limit', {
      p_ip_address: rateLimitKey,
      p_max_requests: 10,
      p_window_seconds: 60
    });
    
    if (isRateLimited) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');
    
    if (!PERPLEXITY_API_KEY) {
      console.error('PERPLEXITY_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { count = 5 } = await req.json().catch(() => ({}));
    const safeCount = Math.min(Math.max(1, Number(count) || 5), 10);
    
    const questions: QuizQuestion[] = [];
    
    // Distribute question types for variety
    const questionTypes: QuestionType[] = [];
    for (let i = 0; i < safeCount; i++) {
      const types: QuestionType[] = ['time_to_earn', 'net_worth_comparison', 'income_source', 'wealth_fact'];
      questionTypes.push(types[i % types.length]);
    }
    const shuffledTypes = shuffleArray(questionTypes);
    
    // Get celebrities for AI-powered questions
    const shuffledCelebs = shuffleArray([...CELEBRITY_POOL]).slice(0, safeCount + 2);
    
    for (let i = 0; i < safeCount; i++) {
      const questionType = shuffledTypes[i];
      
      try {
        if (questionType === 'time_to_earn') {
          // Time to earn question - uses Perplexity for grounded earnings data
          const celeb = shuffledCelebs[i % shuffledCelebs.length];
          const item = QUIZ_ITEMS[Math.floor(Math.random() * QUIZ_ITEMS.length)];
          
          console.log(`Fetching earnings for ${celeb.name} via Perplexity...`);
          
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
- educationalFact: a short educational fact about how they built their wealth (max 100 characters)

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
          
          const { time: correctTime, seconds } = calculateTimeToEarn(annualEarnings, item.value);
          const options = generateTimeOptions(correctTime, seconds);
          
          questions.push({
            questionType: 'time_to_earn',
            questionText: `How long does it take ${celeb.name} to earn enough for a ${item.name} ${item.emoji}?`,
            celebrity: celeb.name,
            emoji: celeb.emoji,
            category: celeb.category,
            correctAnswer: correctTime,
            options,
            explanation: `${celeb.name} earns approximately ${formatMoney(annualEarnings)} per year.`,
            educationalFact: parsed.educationalFact || `${celeb.name} has built wealth through multiple income streams.`,
          });
          
        } else if (questionType === 'net_worth_comparison') {
          // Net worth comparison - two celebrities via Perplexity
          const celeb1 = shuffledCelebs[i % shuffledCelebs.length];
          const celeb2 = shuffledCelebs[(i + 1) % shuffledCelebs.length];
          
          if (celeb1.name === celeb2.name) continue;
          
          console.log(`Comparing net worth via Perplexity: ${celeb1.name} vs ${celeb2.name}...`);
          
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
                  content: 'You are a financial data expert. Return ONLY valid JSON with no markdown.'
                },
                {
                  role: 'user',
                  content: `Compare the net worth of ${celeb1.name} vs ${celeb2.name} based on Forbes/Bloomberg data.

Return JSON: {"winner": "name of richer person", "netWorth1": number for ${celeb1.name}, "netWorth2": number for ${celeb2.name}, "difference": "X times richer" or "$XB more", "educationalFact": "one sentence wealth-building insight"}`
                }
              ],
              search_recency_filter: 'month',
              temperature: 0,
            }),
          });

          if (!response.ok) continue;

          const data = await response.json();
          const content = data.choices?.[0]?.message?.content || '';
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (!jsonMatch) continue;
          
          const parsed = JSON.parse(jsonMatch[0]);
          // Use the celeb names from our pool (not the AI response) to ensure
          // correctAnswer exactly matches an option string
          const winnerName = parsed.winner?.trim();
          const matchedWinner = [celeb1.name, celeb2.name].find(
            name => name.toLowerCase() === winnerName?.toLowerCase()
          );
          
          if (!matchedWinner) {
            console.log(`Winner name mismatch: API returned "${winnerName}", expected "${celeb1.name}" or "${celeb2.name}"`);
            continue;
          }
          
          const loser = matchedWinner === celeb1.name ? celeb2.name : celeb1.name;
          
          questions.push({
            questionType: 'net_worth_comparison',
            questionText: `Who has a higher net worth?`,
            celebrity: celeb1.name,
            celebrity2: celeb2.name,
            emoji: celeb1.emoji,
            emoji2: celeb2.emoji,
            category: 'Net Worth Battle',
            correctAnswer: matchedWinner,
            options: shuffleArray([celeb1.name, celeb2.name, 'About the same', 'Too close to call']),
            explanation: `${matchedWinner} is worth ${formatMoney(Math.max(parsed.netWorth1, parsed.netWorth2))} - ${parsed.difference} than ${loser}.`,
            educationalFact: parsed.educationalFact || 'Diversified income streams are key to building massive wealth.',
          });
          
        } else if (questionType === 'income_source') {
          // Income source breakdown - uses static verified data
          const sourceData = INCOME_SOURCES[Math.floor(Math.random() * INCOME_SOURCES.length)];
          const wrongOptions = sourceData.sources
            .filter(s => s.source !== sourceData.correct)
            .map(s => s.source);
          
          const allOptions = shuffleArray([
            sourceData.correct,
            ...wrongOptions,
            'All sources are equal'
          ]).slice(0, 4);
          
          questions.push({
            questionType: 'income_source',
            questionText: sourceData.question,
            celebrity: sourceData.celebrity,
            emoji: sourceData.emoji,
            category: 'Income Breakdown',
            correctAnswer: sourceData.correct,
            options: allOptions,
            explanation: sourceData.explanation,
            educationalFact: `Income breakdown: ${sourceData.sources.map(s => `${s.source}: ${s.percentage}%`).join(', ')}`,
          });
          
        } else if (questionType === 'wealth_fact') {
          // True/False wealth facts - uses static verified data
          const fact = WEALTH_FACTS[Math.floor(Math.random() * WEALTH_FACTS.length)];
          const isTrue = Math.random() > 0.5;
          const statement = isTrue ? fact.trueFact : fact.falseFact;
          
          questions.push({
            questionType: 'wealth_fact',
            questionText: `True or False: ${fact.celebrity} ${statement}.`,
            celebrity: fact.celebrity,
            emoji: CELEBRITY_POOL.find(c => c.name === fact.celebrity)?.emoji || '💰',
            category: 'Wealth Facts',
            correctAnswer: isTrue ? 'True' : 'False',
            options: ['True', 'False', 'Partially True', 'Unknown'],
            explanation: fact.explanation,
            educationalFact: isTrue 
              ? `This illustrates an important wealth-building principle.`
              : `The truth: ${fact.trueFact}.`,
          });
        }
        
      } catch (error) {
        console.error(`Error generating question ${i}:`, error);
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
      questions: shuffleArray(questions),
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

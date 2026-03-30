import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Topics the AI can pick from to generate diverse lessons
const TOPIC_POOL = [
  "How credit scores work and why they matter",
  "What is a 401(k) and how to maximize it",
  "Understanding real estate investing basics",
  "What are ETFs and how they differ from index funds",
  "The psychology of money — why we make bad financial decisions",
  "How to read a company's balance sheet",
  "What is inflation and how to protect your money",
  "Understanding cryptocurrency basics",
  "How taxes work — brackets, deductions, and strategies",
  "The power of multiple income streams",
  "What is venture capital and how startups get funded",
  "Understanding bonds — the boring investment that works",
  "How to evaluate a business before investing",
  "What is a REIT and how to invest in real estate without buying property",
  "The art of negotiation — how to ask for more money",
  "How insurance works and what you actually need",
  "Understanding market cap — small cap vs large cap",
  "What are options and how do they work",
  "Emergency funds — how much you really need",
  "How billionaires use debt to build wealth",
  "The gig economy — how to turn side hustles into real income",
  "Understanding dividends — getting paid to own stocks",
  "What is a hedge fund and how do they make money",
  "How to build generational wealth",
  "The rule of 72 — quick math for doubling your money",
  "How supply and demand affects everything",
  "What is a recession and how to prepare for one",
  "Understanding P/E ratio — is a stock overpriced",
  "How to budget without being miserable",
  "What is passive income and realistic ways to build it",
  "How the Federal Reserve affects your money",
  "Understanding capital gains tax — short vs long term",
  "What is an IRA and Roth IRA",
  "How to evaluate rental property investments",
  "The importance of financial literacy at a young age",
  "How stock buybacks work and why companies do them",
  "Understanding market orders vs limit orders",
  "What is an IPO and should you invest in one",
  "How to read a stock chart — basics of technical analysis",
  "The difference between saving and investing",
  "How AI is changing investing and finance",
  "What is forex trading",
  "How to protect yourself from financial scams",
  "Understanding escrow, mortgages, and home buying basics",
  "The wealth gap — understanding inequality through numbers",
  "How fractional shares make investing accessible",
  "What is a fiduciary and why it matters",
  "How compounding debt works against you — credit cards explained",
  "Understanding the stock market crash of 2008",
  "How to think about risk vs reward in any investment",
];

const EMOJIS = ["💰", "📊", "🏦", "💳", "🏠", "📈", "🧮", "💎", "🎯", "🔑", "⚡", "🌟", "🎓", "💡", "🏛️", "🚀", "📉", "🤖", "🌍", "🔥"];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get existing lesson titles to avoid duplicates
    const { data: existingLessons } = await supabase
      .from('academy_lessons')
      .select('title, lesson_number')
      .order('lesson_number', { ascending: false });

    const existingTitles = (existingLessons || []).map(l => l.title.toLowerCase());
    const nextLessonNumber = existingLessons && existingLessons.length > 0 
      ? existingLessons[0].lesson_number + 1 
      : 1;

    // Pick a random topic not already covered
    const availableTopics = TOPIC_POOL.filter(t => 
      !existingTitles.some(et => et.includes(t.toLowerCase().split(' ').slice(0, 3).join(' ')))
    );
    
    const topic = availableTopics.length > 0 
      ? availableTopics[Math.floor(Math.random() * availableTopics.length)]
      : TOPIC_POOL[Math.floor(Math.random() * TOPIC_POOL.length)];

    const level = nextLessonNumber <= 12 ? 'Beginner' : nextLessonNumber <= 24 ? 'Intermediate' : 'Advanced';
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

    console.log(`Generating lesson #${nextLessonNumber}: "${topic}" (${level})`);

    // Call Lovable AI to generate the lesson
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: `You are a financial education writer for "Mogul Academy" — a free investing education platform aimed at beginners and young adults. Your writing style:

- Explain concepts so simply a 5th grader could understand
- Use vivid analogies and real-world examples
- Include specific dollar amounts and real numbers
- Tell real stories about real people (verified, factual)
- Use a casual, engaging tone — not boring textbook language
- Make money feel exciting and achievable
- Each lesson should be 400-600 words of content
- Bold section headers using **Header** markdown format

CRITICAL: Return ONLY valid JSON. No markdown code blocks. No explanation outside the JSON.`
          },
          {
            role: 'user',
            content: `Write a ${level} level lesson about: "${topic}"

Return a JSON object with EXACTLY this structure:
{
  "title": "Catchy lesson title (include a fun subtitle in parentheses)",
  "subtitle": "One sentence hook that makes people want to read",
  "intro": "2-3 sentence hook that draws the reader in with a question or surprising fact",
  "content": "The full lesson content, 400-600 words, using **Bold Headers** to break sections. Include real numbers, real examples, and make it conversational.",
  "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4"],
  "caseStudyTitle": "Title of a real-world case study",
  "caseStudyText": "2-3 sentences about a real person or event that illustrates the lesson. Use verified facts.",
  "tags": ["Tag1", "Tag2", "${level}"]
}`
          }
        ],
        temperature: 0.8,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limited, please try again later' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({ error: 'Failed to generate lesson' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || '';
    
    // Parse the JSON from AI response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Could not parse JSON from AI response:', content.substring(0, 200));
      return new Response(JSON.stringify({ error: 'Failed to parse AI response' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const lesson = JSON.parse(jsonMatch[0]);

    // Save to database
    const { data: saved, error: saveError } = await supabase
      .from('academy_lessons')
      .insert({
        lesson_number: nextLessonNumber,
        level,
        title: String(lesson.title || topic),
        subtitle: String(lesson.subtitle || ''),
        emoji,
        intro: String(lesson.intro || ''),
        content: String(lesson.content || ''),
        key_points: Array.isArray(lesson.keyPoints) ? lesson.keyPoints : [],
        case_study_title: lesson.caseStudyTitle ? String(lesson.caseStudyTitle) : null,
        case_study_text: lesson.caseStudyText ? String(lesson.caseStudyText) : null,
        tags: Array.isArray(lesson.tags) ? lesson.tags : [level],
        is_published: true,
        published_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (saveError) {
      console.error('Save error:', saveError);
      return new Response(JSON.stringify({ error: 'Failed to save lesson', details: saveError.message }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Lesson #${nextLessonNumber} saved successfully: "${lesson.title}"`);

    return new Response(JSON.stringify({ 
      success: true, 
      lesson: saved,
      lessonNumber: nextLessonNumber,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('generate-academy-lesson error:', error);
    return new Response(JSON.stringify({ 
      error: 'Service error', 
      details: error instanceof Error ? error.message : 'Unknown' 
    }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

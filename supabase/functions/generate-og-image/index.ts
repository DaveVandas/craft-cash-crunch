// Generate dynamic OG images using AI and cache in storage
// Uses Lovable AI gateway with google/gemini-2.5-flash-image

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Feature display names and prompt themes for AI generation
const FEATURE_PROMPTS: Record<string, { label: string; theme: string }> = {
  home: {
    label: "WEALTH PERSPECTIVE",
    theme: "A luxurious dark background with gold crown, dollar signs floating, and golden light rays. Rich dark tones with amber/gold accents. Premium wealth aesthetic.",
  },
  quiz: {
    label: "WEALTH QUIZ",
    theme: "A luxurious dark background with golden question marks, brain icon, and sparkling effects. Quiz game show aesthetic with gold and dark tones.",
  },
  calculator: {
    label: "REALITY CHECK",
    theme: "A luxurious dark background with golden calculator, dollar bills, and dramatic comparison scales. Wealth comparison aesthetic with gold accents.",
  },
  "mogul-markets": {
    label: "MOGUL MARKETS",
    theme: "A luxurious dark background with golden stock chart going up, bull icon, and trading floor aesthetic. Gold and dark premium trading vibes.",
  },
  trades: {
    label: "TRADE CAREERS",
    theme: "A luxurious dark background with golden tools, wrench and hammer, and rising income chart. Skilled trades with premium gold aesthetic.",
  },
  "side-hustle": {
    label: "SIDE HUSTLES",
    theme: "A luxurious dark background with golden money bag, rocket launching, and stacks of cash. Entrepreneurial energy with gold accents.",
  },
  compare: {
    label: "WHO EARNS MORE?",
    theme: "A luxurious dark background with golden VS symbol, two silhouettes facing off, and dramatic spotlights. Competition aesthetic with gold tones.",
  },
  affiliate: {
    label: "GET PAID TO SHARE",
    theme: "A luxurious dark background with golden megaphone, chain links, and dollar signs raining down. Affiliate marketing with premium gold aesthetic.",
  },
  "wealth-wisdom": {
    label: "WEALTH WISDOM",
    theme: "A luxurious dark background with golden open book, lightbulb, and inspirational rays. Wisdom and knowledge with premium gold aesthetic.",
  },
  "wealth-facts": {
    label: "WEALTH FACTS",
    theme: "A luxurious dark background with golden exclamation mark, mind-blown emoji effect, and sparkling facts. Shocking revelations with gold aesthetic.",
  },
  "mogul-academy": {
    label: "MOGUL ACADEMY",
    theme: "A luxurious dark background with golden graduation cap, books, and ascending steps. Education with premium gold aesthetic.",
  },
  "debt-destroyer": {
    label: "DEBT DESTROYER",
    theme: "A luxurious dark background with golden hammer smashing chains, broken shackles, and freedom rays. Debt freedom with premium gold aesthetic.",
  },
  "celebrity-portfolios": {
    label: "VIP PORTFOLIOS",
    theme: "A luxurious dark background with golden briefcase, VIP badge, and celebrity silhouettes. Exclusive access with premium gold aesthetic.",
  },
  "landing-a": {
    label: "THINK LIKE THE 1%",
    theme: "A premium dark website screenshot aesthetic showing a luxury app interface with gold accents, wealth statistics dashboard, and billionaire silhouette. Modern dark UI with glowing gold data visualizations and earnings tickers. Sleek tech-luxury crossover design.",
  },
  "landing-b": {
    label: "YOUR WEALTH REALITY CHECK",
    theme: "A premium dark website screenshot aesthetic showing a salary comparison tool with dramatic gold numbers, split-screen comparison between average person and celebrity. Modern dark app UI with gold highlights and shocking wealth gap visualization.",
  },
  "landing-c": {
    label: "SEE MONEY DIFFERENTLY",
    theme: "A premium dark website screenshot aesthetic showing a wealth perspective app with real-time earnings counters, gold ticker displays, and celebrity earnings cards. Modern dark UI with ambient gold glow and luxury data presentation.",
  },
  "landing-d": {
    label: "GET PAID TO SHARE",
    theme: "A premium dark website screenshot aesthetic showing an affiliate earnings dashboard with gold commission counters, referral tracking, and viral growth charts. Modern dark app UI with gold accents showing money being earned.",
  },
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const page = url.searchParams.get("page") || "home";
    const forceRegenerate = url.searchParams.get("force") === "true";

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const storagePath = `${page}.png`;

    // Check if image already exists in storage (cache hit)
    if (!forceRegenerate) {
      const { data: existingFile } = await supabase.storage
        .from("og-images")
        .createSignedUrl(storagePath, 60);

      if (existingFile?.signedUrl) {
        // Verify the file actually exists by checking list
        const { data: fileList } = await supabase.storage
          .from("og-images")
          .list("", { search: `${page}.png` });

        if (fileList && fileList.length > 0) {
          const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/og-images/${storagePath}`;
          console.log(`[OG Image] Cache hit for ${page}: ${publicUrl}`);
          return new Response(JSON.stringify({ url: publicUrl, cached: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
    }

    // Get feature config
    const feature = FEATURE_PROMPTS[page] || FEATURE_PROMPTS["home"];

    // Generate image using AI
    // IMPORTANT: We ask for a background-only image (no text) to avoid AI spelling issues.
    // The OG title/description meta tags handle all text content.
    const prompt = `Create a 1200x630 pixel social media Open Graph preview image. ${feature.theme} The image should be purely visual and atmospheric - DO NOT include any text, words, letters, or numbers in the image. No watermarks, no labels, no titles. Just a beautiful, premium, dark and gold themed visual that evokes luxury and wealth. The composition should leave space in the center for overlay text. Aspect ratio 1.9:1 landscape orientation. Ultra high resolution.`;

    console.log(`[OG Image] Generating for ${page} with prompt: ${prompt.substring(0, 100)}...`);

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error(`[OG Image] AI gateway error: ${aiResponse.status} ${errText}`);

      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again later" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const imageData = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageData) {
      console.error("[OG Image] No image in AI response:", JSON.stringify(aiData).substring(0, 500));
      return new Response(JSON.stringify({ error: "No image generated" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract base64 data (remove data:image/png;base64, prefix)
    const base64Match = imageData.match(/^data:image\/\w+;base64,(.+)$/);
    if (!base64Match) {
      console.error("[OG Image] Invalid base64 format");
      return new Response(JSON.stringify({ error: "Invalid image format" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Decode base64 to binary
    const binaryString = atob(base64Match[1]);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from("og-images")
      .upload(storagePath, bytes, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("[OG Image] Upload error:", uploadError);
      return new Response(JSON.stringify({ error: "Failed to cache image" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/og-images/${storagePath}`;
    console.log(`[OG Image] Generated and cached for ${page}: ${publicUrl}`);

    return new Response(JSON.stringify({ url: publicUrl, cached: false, page }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[OG Image] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// OG Share Edge Function - Serves dynamic OG tags for social media crawlers
const SITE_URL = "https://earningsexplorer.shop";

interface PageMeta {
  title: string;
  description: string;
  image: string;
  path: string;
}

const PAGE_META: Record<string, PageMeta> = {
  "home": {
    title: "Wealth Perspective",
    description: "Putting wealth into perspective, one mind-blowing comparison at a time! See how fast billionaires make money.",
    image: "/og-image.png",
    path: "/",
  },
  "debt-destroyer": {
    title: "Debt Destroyer | Wealth Perspective",
    description: "Crush your debt with our calculator. See exactly how much interest you're paying and find your fastest path to freedom!",
    image: "/og-debt-destroyer.png",
    path: "/debt-destroyer",
  },
  "quiz": {
    title: "Wealth Quiz | Wealth Perspective",
    description: "Test your wealth knowledge! Can you guess who earns more? Take the viral quiz that's blowing minds.",
    image: "/og-quiz.png",
    path: "/quiz",
  },
  "calculator": {
    title: "Reality Check Calculator | Wealth Perspective",
    description: "Compare your salary to celebrity earnings. Get a reality check on how fast the rich really earn!",
    image: "/og-calculator.png",
    path: "/calculator",
  },
  "mogul-markets": {
    title: "Mogul Markets | Wealth Perspective",
    description: "Paper trade like a mogul! Build your virtual portfolio and learn investing without the risk.",
    image: "/og-mogul-markets.png",
    path: "/mogul-markets",
  },
  "trades": {
    title: "Trade History | Wealth Perspective",
    description: "Track your paper trading journey. See your wins, losses, and learn from every trade.",
    image: "/og-trades.png",
    path: "/trades",
  },
  "celebrity-portfolios": {
    title: "VIP Portfolios | Wealth Perspective",
    description: "Mirror the trades of billionaires, politicians, and celebrities. See what the rich are investing in!",
    image: "/og-celebrity-portfolios.png",
    path: "/celebrity-portfolios",
  },
  "side-hustle": {
    title: "Side Hustle Ideas | Wealth Perspective",
    description: "Discover lucrative side hustles matched to your skills. Start building wealth today!",
    image: "/og-side-hustle.png",
    path: "/side-hustle",
  },
  "compare": {
    title: "Celebrity Comparison | Wealth Perspective",
    description: "Who earns more? Compare any two celebrities and see the shocking difference in their earnings!",
    image: "/og-compare.png",
    path: "/compare",
  },
  "affiliate": {
    title: "Get Paid to Share | Wealth Perspective",
    description: "Join the mogul movement and earn cash for every friend you bring. Share viral wealth content and get paid!",
    image: "/og-affiliate.png",
    path: "/become-affiliate",
  },
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const page = url.searchParams.get("page") || "home";
    const rawRedirect = url.searchParams.get("redirect");
    const userAgent = req.headers.get("user-agent") || "";

    // Check if this is a social media crawler
    const isCrawler =
      /Twitterbot|facebookexternalhit|Facebot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Discordbot|Pinterest|Applebot/i.test(
        userAgent,
      );

    // Get meta for the requested page, fallback to home
    const meta = PAGE_META[page] || {
      title: "Wealth Perspective",
      description: "Putting wealth into perspective, one mind blowing comparison at a time!",
      image: "/og-image.png",
      path: "/",
    };

    const redirectPath =
      rawRedirect &&
      rawRedirect.startsWith("/") &&
      !rawRedirect.startsWith("//") &&
      !rawRedirect.includes("://")
        ? rawRedirect
        : undefined;

    console.log(
      `[OG Share] Request for page: ${page}, redirect: ${redirectPath ?? "-"}, UA: ${userAgent.substring(0, 100)}`,
    );

    const fullImageUrl = `${SITE_URL}${meta.image}`;
    const canonicalUrl = `${SITE_URL}${redirectPath ?? meta.path}`;

    // For crawlers, return full HTML with OG tags
    // For regular users, redirect to the actual page
    if (!isCrawler) {
      console.log(`[OG Share] Redirecting user to: ${canonicalUrl}`);
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          "Location": canonicalUrl,
        },
      });
    }

    console.log(`[OG Share] Serving OG tags to crawler for: ${page}`);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${meta.title}">
  <meta property="og:description" content="${meta.description}">
  <meta property="og:image" content="${fullImageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Wealth Perspective">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${canonicalUrl}">
  <meta name="twitter:title" content="${meta.title}">
  <meta name="twitter:description" content="${meta.description}">
  <meta name="twitter:image" content="${fullImageUrl}">
  
  <!-- Canonical -->
  <link rel="canonical" href="${canonicalUrl}">
  
  <!-- Redirect for any browsers that somehow render this -->
  <meta http-equiv="refresh" content="0;url=${canonicalUrl}">
</head>
<body>
  <p>Redirecting to <a href="${canonicalUrl}">${meta.title}</a>...</p>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("[OG Share] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

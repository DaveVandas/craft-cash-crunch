import { useState, useRef, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PaywallGate from '@/components/paywall/PaywallGate';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, DollarSign, Rocket, Flame, Zap, Crown, ArrowDown, BookOpen } from 'lucide-react';
import { formatCurrency } from '@/lib/earnings';
import AllHustlesModal, { type SideHustle as SideHustleType } from '@/components/side-hustle/AllHustlesModal';

interface CalculationResult {
  profit: number;
  monthlyProfit: number;
  yearlyProfit: number;
  roi: number;
  salesPerDay: number;
  salesPerWeek: number;
  salesPerMonth: number;
}

// Extended pool of side hustles with categories and guides
const ALL_SIDE_HUSTLES: SideHustleType[] = [
  // Digital & Online
  { 
    name: 'Wealth Perspective Affiliate', emoji: '💎', avgBuyPrice: 0, avgSellPrice: 1.5, salesPerMonth: 500, difficulty: 'Easy', 
    description: 'Share our app, get paid per signup!', tips: 'One viral TikTok = 💰', category: 'digital',
    guide: '🚨 ONE VIRAL TIKTOK = $10,000+ 🚨 This is real. Share Wealth Perspective, get paid for every signup. First 1,000 referrals = $1 each. After that? $2 FOREVER. Do the math: 100K views → 10,000 downloads → up to $20,000. FROM ONE POST. No inventory. No customers. No skills. Just post and collect. Apply at earningsexplorer.shop/become-affiliate → Get your link + QR code → Film yourself reacting to celebrity earnings → Post it. The app sells itself. Grind to 1,000 referrals, unlock the $2 tier, and watch your bank account change overnight. This is how regular people get paid in 2025. 🔥'
  },
  { 
    name: 'Digital Products', emoji: '💻', avgBuyPrice: 0, avgSellPrice: 29, salesPerMonth: 40, difficulty: 'Medium', 
    description: 'Build once, sell infinitely.', tips: 'Notion templates are hot', category: 'digital',
    guide: 'Digital products are the ultimate scalable side hustle—create once, sell forever with zero inventory. The key is solving a specific problem for a specific audience. Notion templates, Canva designs, spreadsheets, and eBooks are hot right now. Start by identifying what you\'re good at that others struggle with. Week 1: Research top-selling digital products on Gumroad and Etsy to understand what sells. Week 2: Create your first product—keep it simple, solve one problem well. Week 3: Set up your storefront on Gumroad (easiest) or Etsy. Week 4: Create 3-5 social media posts showing your product in action. The magic happens when you stack multiple products over time.'
  },
  { 
    name: 'AI Prompt Engineering', emoji: '🤖', avgBuyPrice: 0, avgSellPrice: 15, salesPerMonth: 50, difficulty: 'Medium', 
    description: 'Sell ChatGPT prompts that work.', tips: 'PromptBase marketplace', category: 'digital',
    guide: 'AI prompt engineering is the newest gold rush—businesses and creators desperately need prompts that actually work. The best prompts save hours of trial and error and deliver consistent, high-quality results. Focus on niches: marketing copy, code generation, content creation, or image prompts for Midjourney. Step 1: Master one AI tool deeply—ChatGPT, Claude, or Midjourney. Step 2: Create 5-10 prompts that solve real problems and test them extensively. Step 3: List on PromptBase, Etsy, or your own Gumroad store. Step 4: Create before/after examples showing the prompt\'s output quality. Pro tip: Bundle prompts into themed packs (e.g., "50 Marketing Prompts") for higher prices.'
  },
  { 
    name: 'UGC Content Creator', emoji: '📲', avgBuyPrice: 0, avgSellPrice: 200, salesPerMonth: 8, difficulty: 'Medium', 
    description: 'Create TikTok-style ads for brands.', tips: 'No following needed, just content', category: 'digital',
    guide: 'UGC (User-Generated Content) creation is exploding because brands need authentic-looking content, not polished ads. You don\'t need followers—just the ability to create natural, engaging short-form videos. Brands pay $150-500+ per video. You\'ll film yourself using products, doing unboxings, or sharing testimonials. Start by practicing with products you own—film 10 sample videos to build your portfolio. Create a simple portfolio on Notion or Canva. Join UGC platforms like Billo, JoinBrands, or Insense to find your first clients. Study top-performing TikTok ads to understand hooks, pacing, and CTAs. Once you land 2-3 clients, you\'ll have enough portfolio pieces to pitch brands directly on LinkedIn.'
  },
  { 
    name: 'Virtual Assistant', emoji: '🖥️', avgBuyPrice: 0, avgSellPrice: 30, salesPerMonth: 80, difficulty: 'Easy', 
    description: 'Remote admin support for busy pros.', tips: 'Belay, Time Etc for clients', category: 'digital',
    guide: 'Virtual assistants are in massive demand as entrepreneurs and executives realize they can outsource for less than hiring full-time. You\'ll handle emails, scheduling, research, data entry, and customer service—all from home. The key is positioning yourself as a specialist (e.g., "VA for coaches" or "Real estate VA") rather than a generalist. Week 1: List your skills and identify 2-3 services you can offer confidently. Week 2: Create profiles on Belay, Time Etc, Upwork, and Fiverr. Week 3: Reach out to 10 small business owners on LinkedIn offering a free trial task. Week 4: Deliver exceptional work and ask for testimonials. As you gain experience, raise your rates—top VAs charge $50-75/hour.'
  },
  { 
    name: 'Online Courses', emoji: '🎓', avgBuyPrice: 0, avgSellPrice: 97, salesPerMonth: 15, difficulty: 'Hard', 
    description: 'Teach what you know at scale.', tips: 'Teachable or Kajabi', category: 'digital',
    guide: 'Online courses let you package your expertise and sell it infinitely. The most successful courses solve a specific, painful problem and deliver a transformation. Don\'t try to teach everything—teach one thing really well. Start by validating your idea: post about your topic on social media and see if people engage. Pre-sell your course before you build it—if 10 people pay upfront, you know there\'s demand. Use Teachable, Kajabi, or even Notion for hosting. Film with your phone (good lighting matters more than camera quality). Structure your course as a journey: where is the student now, and where will they be after? Include worksheets and action steps. Launch to your email list first, then expand.'
  },
  { 
    name: 'Newsletter/Substack', emoji: '📧', avgBuyPrice: 0, avgSellPrice: 10, salesPerMonth: 100, difficulty: 'Medium', 
    description: 'Paid newsletter subscriptions.', tips: 'Niche expertise + consistency', category: 'digital',
    guide: 'Paid newsletters are the modern-day magazine subscription—except you keep most of the revenue. The key is providing unique insights, curation, or analysis that readers can\'t get elsewhere. Pick a niche you\'re genuinely obsessed with: finance, AI, career advice, industry news. Start free on Substack to build your audience—aim for 1,000 free subscribers before going paid. Post consistently (weekly minimum). Make your free content valuable enough that people want more. The paid tier should offer exclusive insights, community access, or additional content. Promote by engaging in Twitter/X communities, appearing on podcasts, and cross-promoting with other writers. 1,000 paying subscribers at $10/month = $100K/year.'
  },
  { 
    name: 'Website Flipping', emoji: '🌐', avgBuyPrice: 500, avgSellPrice: 2000, salesPerMonth: 1, difficulty: 'Hard', 
    description: 'Buy, improve, sell websites.', tips: 'Flippa for marketplace', category: 'digital',
    guide: 'Website flipping is real estate for the internet—buy undervalued sites, improve them, and sell for profit. Most flippers look for sites with traffic but poor monetization, outdated design, or neglected SEO. Start by studying Flippa listings to understand valuations (typically 24-36x monthly revenue). Buy sites under $1,000 initially to learn. Focus on improvements: add affiliate links, improve SEO, update design, add email capture. Document your traffic and revenue growth carefully—buyers want proof. Hold sites 6-12 months minimum for meaningful appreciation. The best flippers eventually build from scratch: create niche content sites, grow them, then sell. Join communities like Empire Flippers and MotionInvest for education.'
  },
  { 
    name: 'Dropshipping', emoji: '📦', avgBuyPrice: 8, avgSellPrice: 25, salesPerMonth: 50, difficulty: 'Medium', 
    description: 'Sell without touching product.', tips: 'Find winners on TikTok', category: 'digital',
    guide: 'Dropshipping lets you run an ecommerce store without inventory—you sell products, and suppliers ship directly to customers. The margin game is tight, so product selection is everything. Find winning products by scrolling TikTok Shop and watching what goes viral. Use tools like Minea or Ecomhunt for product research. Build your store on Shopify (cleanest) with a professional theme. Source from AliExpress initially, but graduate to US/EU suppliers for faster shipping. Run TikTok or Facebook ads starting at $20/day to test products. Kill losers fast, scale winners aggressively. Most beginners fail because they pick bad products or give up too early. Test 10-20 products before finding a winner.'
  },
  { 
    name: 'Online Tutoring', emoji: '📚', avgBuyPrice: 0, avgSellPrice: 50, salesPerMonth: 20, difficulty: 'Easy', 
    description: 'Share knowledge, get paid.', tips: 'Wyzant, Varsity Tutors', category: 'digital',
    guide: 'Online tutoring connects your expertise with students worldwide—no commute, flexible hours, and genuine impact. You can tutor academic subjects, test prep (SAT, GRE), languages, or even professional skills. Start by listing on platforms like Wyzant, Varsity Tutors, Preply, or Tutor.com. Create a compelling profile highlighting your credentials and teaching style. Set competitive rates initially ($25-40/hour) and raise them as you get reviews. Invest in good lighting and a quality microphone—presentation matters on video. Prepare materials in advance and track student progress. The best tutors eventually move to private clients and group sessions, charging $75-150/hour. Build an email list of satisfied students for referrals.'
  },
  { 
    name: 'Social Media Mgmt', emoji: '📱', avgBuyPrice: 0, avgSellPrice: 500, salesPerMonth: 3, difficulty: 'Medium', 
    description: 'Get paid to post.', tips: 'Package content + scheduling', category: 'digital',
    guide: 'Small businesses know they need social media but hate doing it—that\'s your opportunity. Social media managers handle content creation, posting, engagement, and analytics. The key is positioning as a specialist (e.g., "Instagram for restaurants" or "LinkedIn for coaches"). Start by managing accounts for 2-3 businesses for free or cheap to build case studies. Create a service package: 12-20 posts/month, daily engagement, monthly analytics report. Use tools like Later, Buffer, or Hootsuite for scheduling. Price packages at $300-800/month for small businesses, $1,500+ for larger ones. Document your results religiously—follower growth, engagement rates, leads generated. Scale by hiring other freelancers and becoming an agency.'
  },
  { 
    name: 'Bookkeeping', emoji: '📊', avgBuyPrice: 0, avgSellPrice: 400, salesPerMonth: 5, difficulty: 'Medium', 
    description: 'Numbers = money.', tips: 'QuickBooks certification helps', category: 'digital',
    guide: 'Bookkeeping is recession-proof—every business needs it, few owners want to do it. You\'ll track income, expenses, reconcile accounts, and prepare financial reports. No accounting degree required, but QuickBooks or Xero certification adds credibility (free online). Start by offering services to small businesses and freelancers in your network. Charge monthly retainers ($200-500 for small clients, $500-1,500 for larger ones). Specialize in an industry for higher rates—real estate, ecommerce, and contractors pay well. Use Bench or Pilot as inspiration for service packaging. Join bookkeeping Facebook groups for community support. As you grow, hire other bookkeepers and build a firm. Many bookkeepers transition into full accounting or CFO services.'
  },
  { 
    name: 'Freelance Design', emoji: '🎨', avgBuyPrice: 0, avgSellPrice: 150, salesPerMonth: 6, difficulty: 'Medium', 
    description: 'Turn creativity into cash.', tips: 'Start Fiverr, build portfolio', category: 'digital',
    guide: 'Freelance design is timeless—every business needs logos, social graphics, presentations, and marketing materials. You don\'t need a degree, but you need a strong portfolio. Start by recreating designs you admire to practice. Use Figma (free) or Canva Pro for tools. Create 5-10 portfolio pieces in a specific niche (e.g., "tech startup branding" or "restaurant menus"). Launch on Fiverr and 99designs to get initial clients and reviews. As you grow, move to direct clients who pay more. Charge by project, not hourly—clients prefer knowing the total cost. Underpromise and overdeliver to earn referrals. Join design communities on Discord for feedback and job leads. Top freelancers charge $500-5,000+ per project.'
  },
  
  // Product Flipping
  { 
    name: 'Reselling Sneakers', emoji: '👟', avgBuyPrice: 180, avgSellPrice: 280, salesPerMonth: 8, difficulty: 'Medium', 
    description: 'Buy limited releases, flip for profit.', tips: 'Follow @snkr_twitr, use bots for drops', category: 'flipping',
    guide: 'Sneaker reselling is a proven hustle with a massive secondary market—limited releases from Nike, Jordan, and Yeezy regularly sell for 2-5x retail. Success depends on hitting drops and knowing which shoes will appreciate. Follow sneaker news accounts (@snaborhood, @snkr_twitr) for release info. Join cook groups (paid communities) that share early links and strategies. For manual copping, practice checkout speed and have multiple browser tabs ready. Consider bots for serious volume, but expect $300-500 investment. Store shoes properly—deadstock condition is everything. Sell on StockX, GOAT, or eBay for verified sales. Start local with Facebook Marketplace for faster cash. Track every purchase and sale in a spreadsheet to understand your true margins.'
  },
  { 
    name: 'Thrift Flipping', emoji: '🏷️', avgBuyPrice: 5, avgSellPrice: 35, salesPerMonth: 20, difficulty: 'Easy', 
    description: "Goodwill to gold.", tips: 'Vintage & designer on Poshmark', category: 'flipping',
    guide: 'Thrift flipping transforms secondhand finds into real profit—Goodwill, estate sales, and garage sales are gold mines if you know what to look for. Focus on learning 2-3 niches deeply: vintage clothing, designer bags, electronics, or home décor. Use the eBay app to scan barcodes and check sold prices in stores. Look for name brands: Patagonia, Lululemon, vintage band tees, Coach bags. Condition matters—check for stains, tears, and wear. Clean and photograph items well; good photos sell. List on Poshmark, Depop, eBay, or Facebook Marketplace. Start with a $50 sourcing budget and reinvest profits. Go to thrift stores early in the week when shelves are freshly stocked. The pros source 2-3 times per week and have systems for listing and shipping.'
  },
  { 
    name: 'Amazon FBA', emoji: '📈', avgBuyPrice: 15, avgSellPrice: 40, salesPerMonth: 100, difficulty: 'Hard', 
    description: 'Let Amazon do the lifting.', tips: 'Use Jungle Scout for research', category: 'flipping',
    guide: 'Amazon FBA (Fulfilled by Amazon) lets you sell products while Amazon handles storage, shipping, and customer service. You focus on finding products and sending inventory to their warehouses. Most beginners start with retail arbitrage: buy clearance items at Walmart or Target and resell on Amazon. Use the Amazon Seller app to scan products in-store and check profitability. Graduate to wholesale (buying from distributors) or private label (your own branded products) for better margins. Use Jungle Scout or Helium 10 for product research—look for items selling 300+ units/month with few reviews. Expect $1,000-3,000 initial investment for inventory. Learn Amazon\'s fee structure deeply—FBA fees eat into margins. Join Facebook groups and YouTube channels dedicated to FBA strategies.'
  },
  { 
    name: 'Flipping Furniture', emoji: '🪑', avgBuyPrice: 25, avgSellPrice: 120, salesPerMonth: 6, difficulty: 'Medium', 
    description: 'Facebook finds to profit.', tips: 'Paint & hardware = magic', category: 'flipping',
    guide: 'Furniture flipping is satisfying and profitable—buy worn-out pieces, restore them, and sell for 3-5x your cost. Start with small pieces: nightstands, end tables, and chairs. Source from Facebook Marketplace, estate sales, and curb alerts. Look for solid wood pieces with "good bones" hiding under ugly paint or outdated finishes. Basic supplies: sandpaper, primer, paint (chalk paint is trendy), new hardware, and polyurethane finish. Watch YouTube tutorials for painting and distressing techniques. Take great before/after photos in natural lighting. List on Facebook Marketplace with dimensions and clear pickup instructions. Price based on comparable sold items. Start with 1-2 pieces per week while learning, then scale. Some flippers specialize in mid-century modern pieces for higher margins.'
  },
  { 
    name: 'Tech Flipping', emoji: '📱', avgBuyPrice: 150, avgSellPrice: 300, salesPerMonth: 6, difficulty: 'Medium', 
    description: 'Phones, laptops, tablets.', tips: 'Facebook Marketplace gold', category: 'flipping',
    guide: 'Tech flipping exploits the constant upgrade cycle—people dump perfectly good phones and laptops that you can refurbish and resell. Focus on iPhones, MacBooks, iPads, and gaming consoles—brands hold value. Source from Facebook Marketplace, OfferUp, and estate sales. Always test devices in person: check screens, batteries, buttons, and carrier locks. Learn basic repairs: screen replacements ($20-50 parts, add $100+ to resale value) and battery swaps. Sell on eBay, Swappa, or back on Marketplace. Check IMEI numbers for stolen devices (use swappa.com/esn). Factor in platform fees and shipping costs. Build relationships with local repair shops for parts and overflow inventory. Some flippers specialize in one device type (e.g., only iPhones) for deep expertise.'
  },
  { 
    name: 'Watch Flipping', emoji: '⌚', avgBuyPrice: 500, avgSellPrice: 900, salesPerMonth: 3, difficulty: 'Hard', 
    description: 'Luxury timepieces, big margins.', tips: 'Learn authentication first', category: 'flipping',
    guide: 'Watch flipping requires capital and knowledge, but margins are substantial—a single flip can net $400-2,000+. Focus on entry luxury brands first: Seiko, Orient, Tissot, Hamilton. As you learn, graduate to Omega, Tudor, and vintage pieces. Study authentication obsessively—fakes are everywhere in watches. Learn to spot service history, replacement parts, and wear patterns. Source from eBay, Chrono24, estate sales, and Reddit\'s r/Watchexchange. Build relationships with local watchmakers for servicing and authentication. Always buy below market value—your profit is made at purchase. Sell on eBay, Chrono24, or Instagram. Join watch collector Facebook groups and forums to learn and network. Start with $2,000-5,000 capital and expect a learning curve with your first few purchases.'
  },
  { 
    name: 'Sports Card Trading', emoji: '🃏', avgBuyPrice: 20, avgSellPrice: 80, salesPerMonth: 15, difficulty: 'Medium', 
    description: 'Collectibles market is booming.', tips: 'eBay + PSA grading', category: 'flipping',
    guide: 'Sports cards have exploded as an alternative investment—rookie cards of top players can appreciate hundreds of percent. Focus on current rookies with breakout potential in NFL, NBA, or MLB. Buy raw cards and send to PSA or BGS for grading—a PSA 10 can be worth 10x an ungraded card. Source from retail stores (Target, Walmart), hobby shops, and eBay. Join Facebook groups dedicated to your sport for market intel. Watch for "card breaks" online where you can buy into cases. Sell on eBay with clear photos of card condition. Track player performance—injuries and trades affect values dramatically. Start small ($200-500) while learning which players and products hold value. The hobby requires constant research, but knowledgeable flippers do very well.'
  },
  { 
    name: 'Concert Tickets', emoji: '🎫', avgBuyPrice: 100, avgSellPrice: 200, salesPerMonth: 8, difficulty: 'Medium', 
    description: 'Event arbitrage opportunity.', tips: 'StubHub, SeatGeek', category: 'flipping',
    guide: 'Ticket reselling profits from demand exceeding supply—hot concerts, sports playoffs, and festivals sell out instantly. Speed is everything: have accounts ready on Ticketmaster, AXS, and venue sites. Use multiple devices and browsers for popular drops. Focus on artists with passionate fanbases: Taylor Swift, Bad Bunny, major tours. Buy the best seats you can afford—premium seats have the highest markup percentage. Sell on StubHub, SeatGeek, or VividSeats. Price aggressively as event date approaches—unsold tickets are worthless. Watch for presale codes (credit card, fan clubs) for early access. Some resellers focus on local sports—season ticket holders often can\'t attend every game. Start with 2-4 tickets per event while learning the market dynamics. Build capital over several successful flips.'
  },
  { 
    name: 'Vintage Antiques', emoji: '🏺', avgBuyPrice: 30, avgSellPrice: 150, salesPerMonth: 5, difficulty: 'Medium', 
    description: 'Estate sales to profit.', tips: 'Learn niche markets', category: 'flipping',
    guide: 'Antique flipping rewards patience and expertise—true vintage pieces appreciate over time while you earn on each flip. Pick 2-3 niches to master: mid-century furniture, vintage pottery (McCoy, Fiesta), old tools, or collectible glassware. Source from estate sales, auctions, and thrift stores. Use the Worthpoint app to research sold prices. Learn maker\'s marks, signatures, and period characteristics that affect value. Condition matters, but some wear is expected—don\'t over-restore. Sell on eBay, Etsy, Ruby Lane, or local antique malls (booth rental $100-300/month). Estate sales on Saturday mornings are goldmines—arrive early with cash. Take photos of marks and labels for easy identification. Join specialty collector groups on Facebook to learn and sell. This hustle grows more profitable as your knowledge deepens.'
  },
  
  // Local Services
  { 
    name: 'Car Detailing', emoji: '🚗', avgBuyPrice: 20, avgSellPrice: 150, salesPerMonth: 12, difficulty: 'Medium', 
    description: 'Mobile detailing = flexibility.', tips: 'Start with friends & family', category: 'services',
    guide: 'Mobile car detailing brings the service to customers—no shop overhead means higher margins. Most cars just need exterior wash, interior vacuum, and basic cleaning ($75-150). Full details with clay bar, polish, and wax run $200-400+. Start with basic supplies: wash mitts, microfiber towels, vacuum, cleaning solutions ($200-300 startup). Watch detailing YouTube channels like AMMO NYC to learn proper techniques. Practice on your own car and friends\' cars to build confidence. Create a simple price menu and flyer. Post on NextDoor and Facebook groups offering intro pricing. Take stunning before/after photos for marketing. Show up early, work efficiently, and communicate professionally. As you grow, add services like ceramic coating ($400-800) and invest in better equipment. The best detailers book 2-3 weeks out.'
  },
  { 
    name: 'Pressure Washing', emoji: '💦', avgBuyPrice: 30, avgSellPrice: 200, salesPerMonth: 8, difficulty: 'Medium', 
    description: 'Satisfying work, great margins.', tips: 'Before/after pics sell', category: 'services',
    guide: 'Pressure washing is oddly satisfying and highly profitable—driveways, decks, siding, and fences all need cleaning. A $300-500 pressure washer from Home Depot gets you started. Learn proper PSI for different surfaces (too much pressure damages wood and paint). Watch YouTube tutorials on technique, chemicals, and surface prep. Price by square footage: driveways average $100-200, houses $200-400. Create flyers and go door-to-door in neighborhoods with dirty driveways—the before/after is obvious. Post on NextDoor and local Facebook groups. Take video of your jobs; satisfying pressure washing content performs well on social media. Book jobs in clusters to minimize drive time. Add soft washing (low pressure + chemicals) for roofs and siding. Upsell deck staining and sealing. This scales well—many operators hire crews and run multiple trucks.'
  },
  { 
    name: 'Lawn Care', emoji: '🌿', avgBuyPrice: 10, avgSellPrice: 75, salesPerMonth: 16, difficulty: 'Easy', 
    description: 'Simple service, recurring income.', tips: 'Upsell seasonal services', category: 'services',
    guide: 'Lawn care is the quintessential recurring revenue business—customers pay weekly or biweekly throughout the growing season. Start with a basic mower, trimmer, and blower ($500-1,000). Price per yard based on size and complexity: small yards $30-50, larger properties $75-150. Focus on one neighborhood initially—driving time kills profit. Go door-to-door with a simple flyer offering a discounted first mow. Create a route of 15-20 yards for efficient scheduling. Deliver consistent quality every visit—mow in patterns, edge cleanly, blow debris. Upsell seasonal services: spring cleanup, fall leaf removal, mulching, and basic landscaping. Track mileage and expenses for tax deductions. Many successful lawn businesses add fertilization (requires licensing in some states) for higher margins. This hustle scales to six figures with employees and equipment.'
  },
  { 
    name: 'Cleaning Service', emoji: '🧹', avgBuyPrice: 15, avgSellPrice: 120, salesPerMonth: 12, difficulty: 'Easy', 
    description: 'Always in demand.', tips: 'Residential or Airbnb focus', category: 'services',
    guide: 'House cleaning is recession-resistant—busy families and Airbnb hosts always need help. Start with basic supplies: cleaning solutions, microfibers, mop, vacuum ($100-200). Create a cleaning checklist for consistency. Price by home size or hourly ($25-45/hour for individuals, $50-75/hour for teams). Offer initial discounts to build your client base. Post on NextDoor, Facebook groups, and Thumbtack. Ask happy clients for Google reviews and referrals. Specialize in Airbnb/short-term rental turnovers for premium rates and consistent work—hosts pay $100-200 per turnover. Develop relationships with property managers for steady leads. Always arrive on time and communicate proactively about scheduling. Scale by hiring cleaners and taking a cut—many owners step back from cleaning and focus on sales and quality control. Background checks and insurance become important as you grow.'
  },
  { 
    name: 'Pet Sitting', emoji: '🐕', avgBuyPrice: 0, avgSellPrice: 50, salesPerMonth: 15, difficulty: 'Easy', 
    description: 'Get paid to hang with pets.', tips: 'Rover app for bookings', category: 'services',
    guide: 'Pet sitting is the feel-good side hustle—you literally get paid to spend time with dogs and cats. Services include drop-in visits ($20-35), dog walking ($15-30), and overnight stays ($50-100+). Sign up for Rover and Wag to get started—these apps handle payments and provide basic insurance. Create a profile highlighting your experience with animals and include photos. Accept your first few bookings at lower rates to build reviews. Communication is key: send photos and updates during every service. Be reliable—pet parents are trusting you with family members. Consider offering add-ons: administering medications, extended playtime, or grooming. Build direct relationships with repeat clients for higher margins (no app fees). Some sitters specialize in specific breeds or care needs. Holiday weekends are premium—book early and charge more.'
  },
  { 
    name: 'Mobile Notary', emoji: '📝', avgBuyPrice: 0, avgSellPrice: 150, salesPerMonth: 10, difficulty: 'Easy', 
    description: 'High per-signing fees.', tips: 'Notary2Pro for training', category: 'services',
    guide: 'Mobile notaries travel to clients for document signings—most commonly loan signings for mortgages and refinances. Each signing pays $75-200, and skilled notaries complete 2-3 per day. Step 1: Get commissioned as a notary in your state ($50-100, online training + exam). Step 2: Complete a loan signing agent course (Notary2Pro or Loan Signing System, $200-400). Step 3: Get E&O insurance and pass background check. Step 4: Sign up with signing services like Snapdocs, NotaryDash, and Signing Agent. Respond quickly to signing requests—speed wins jobs. Arrive early, dress professionally, and guide signers through documents patiently. Most signings take 30-60 minutes. Build relationships with local title companies and mortgage brokers for direct work at higher rates. Evening and weekend availability increases your bookings significantly.'
  },
  { 
    name: 'Junk Removal', emoji: '🚚', avgBuyPrice: 50, avgSellPrice: 250, salesPerMonth: 8, difficulty: 'Medium', 
    description: 'Clear clutter, stack cash.', tips: 'Truck + muscles = money', category: 'services',
    guide: 'Junk removal solves a painful problem—people will pay handsomely to make their clutter disappear. You need a truck or trailer and willingness to do physical work. Price by truck load: 1/8 truck $75-100, full truck $300-500+. Quote on-site after seeing the job—photos can be deceiving. Dump fees vary by location; factor them into pricing. Source jobs from Facebook Marketplace (people giving away items often need removal), NextDoor, and Google Ads. Estate cleanouts are lucrative: families pay $1,000-3,000 to clear entire homes. Sort items as you work: donate usable goods, recycle metals, and dump the rest. Some junk (appliances, scrap metal) actually pays when recycled. Build relationships with realtors—they frequently need cleanouts before listings. This business scales quickly with additional trucks and crews.'
  },
  { 
    name: 'Personal Training', emoji: '🏋️', avgBuyPrice: 0, avgSellPrice: 80, salesPerMonth: 20, difficulty: 'Medium', 
    description: 'Fitness coaching pays well.', tips: 'Get certified, start local', category: 'services',
    guide: 'Personal training monetizes your fitness knowledge while helping others transform their health. Getting certified legitimizes your expertise: NASM, ACE, or ISSA certifications cost $500-1,000 and take 2-3 months of self-study. Start by training friends and coworkers at discounted rates to build testimonials. Decide on your model: gym-based (rent space or work as contractor), in-home (travel to clients), or outdoor/park workouts (free). Price sessions at $50-100 for beginners, $75-150+ as you gain experience. Package sessions for commitment: 10-session packages paid upfront. Take progress photos with client permission for marketing. Specialize in a niche (weight loss, strength, seniors, athletes) for premium positioning. Add online coaching for passive income—write programs clients follow independently. Build an Instagram presence showing workouts and client transformations.'
  },
  { 
    name: 'Pool Cleaning', emoji: '🏊', avgBuyPrice: 20, avgSellPrice: 100, salesPerMonth: 16, difficulty: 'Easy', 
    description: 'Recurring maintenance income.', tips: 'Summer = peak season', category: 'services',
    guide: 'Pool cleaning is recurring revenue gold—customers pay monthly for weekly service throughout pool season (or year-round in warm climates). Weekly service includes testing/balancing chemicals, skimming, brushing, and emptying baskets. Equipment startup costs $500-1,000: test kit, chemicals, pole, net, brush. Learn pool chemistry basics from YouTube and CPO (Certified Pool Operator) courses. Price weekly service at $100-200/month for residential pools. Go door-to-door in neighborhoods with pools—look for green or neglected pools as leads. Create a route for efficient travel between accounts. Upsell opening/closing services ($200-400 each), equipment repairs, and acid washes. Build relationships with pool supply stores for referrals. The business model shines in warm climates where pools run year-round. Many pool routes sell for 10-12x monthly revenue when you\'re ready to exit.'
  },
  { 
    name: 'Home Staging', emoji: '🏠', avgBuyPrice: 50, avgSellPrice: 400, salesPerMonth: 4, difficulty: 'Medium', 
    description: 'Prep homes for real estate sales.', tips: 'Partner with realtors', category: 'services',
    guide: 'Home staging helps properties sell faster and for more money—realtors and sellers pay $200-500 for consultations, $1,500-5,000+ for full staging with furniture rental. Start by offering consultations: walk through homes and provide written recommendations for $150-300. Build an inventory of décor items (artwork, throw pillows, plants, lamps) from thrift stores and HomeGoods. Partner with furniture rental companies for larger pieces. Create a portfolio by staging friends\' homes or offering discounted rates to realtors for first projects. Network aggressively with real estate agents—attend open houses and realtor events. Join the Real Estate Staging Association for credibility and education. Photograph your work professionally; your portfolio is your sales tool. As you grow, rent warehouse space for inventory and hire assistants for installations. Top stagers in hot markets earn six figures.'
  },
  { 
    name: 'Event DJ', emoji: '🎧', avgBuyPrice: 0, avgSellPrice: 500, salesPerMonth: 4, difficulty: 'Medium', 
    description: 'Weddings & parties pay premium.', tips: 'Weekend warrior income', category: 'services',
    guide: 'Event DJing turns your music taste into weekend income—weddings pay $800-2,500+, parties $300-800. Equipment investment: $1,000-3,000 for speakers, controller, laptop, and microphone. Learn to read crowds: watch what makes people dance and adapt in real-time. Build a diverse music library across decades and genres. Create a DJ name and simple website showcasing your services. Start with house parties and small events for experience. Get testimonials and video clips from every gig. List on The Knot, WeddingWire, and local vendor directories for wedding leads. Network with event planners, photographers, and venue coordinators for referrals. Specialize in a style (weddings, corporate, Latin music) for premium positioning. Always meet with clients beforehand to understand their vision. Invest in lighting and effects as you grow—full production packages command higher prices.'
  },
  { 
    name: 'Food Delivery', emoji: '🍕', avgBuyPrice: 5, avgSellPrice: 25, salesPerMonth: 60, difficulty: 'Easy', 
    description: 'Flexible hours, instant pay.', tips: 'Multi-app for max earnings', category: 'services',
    guide: 'Food delivery through DoorDash, UberEats, and Grubhub offers ultimate flexibility—work whenever you want, get paid fast. Sign up for multiple apps simultaneously to maximize order availability. Work during peak times: lunch (11am-1pm), dinner (5-9pm), and weekends. Position yourself near restaurant clusters for faster pickups. Accept orders strategically: aim for $2/mile minimum to cover expenses. Track your mileage religiously—it\'s tax deductible and adds up fast. Keep an insulated bag for food quality and better tips. Learn your market: which restaurants are fast, which areas tip well. Provide excellent service: communicate delays, follow delivery instructions, be courteous. Many drivers earn $20-30/hour during peak times. Consider this a transitional hustle—use the flexibility while building something more scalable. Instant pay features let you cash out daily when needed.'
  },
  
  // Creative & Content
  { 
    name: 'Photography', emoji: '📸', avgBuyPrice: 0, avgSellPrice: 300, salesPerMonth: 4, difficulty: 'Medium', 
    description: 'Capture moments, charge premium.', tips: 'Start with events & portraits', category: 'creative',
    guide: 'Photography turns a creative passion into premium income—weddings pay $2,000-10,000+, portraits $150-500, events $500-1,500. Start with whatever camera you have; skill matters more than gear. Master fundamentals: lighting, composition, posing, and editing. Build a portfolio by offering free or discounted shoots to friends. Choose a niche: weddings, portraits, products, real estate, or events. Create a simple website and Instagram showcasing your best work. Price based on deliverables (edited images, albums) not hourly rates. Shoot in RAW format and develop a consistent editing style. Second shoot weddings for established photographers to learn and earn. Invest in backup equipment—camera failures at events are catastrophic. Join local photography Facebook groups for community and referrals. As you grow, raise prices gradually and book fewer, higher-paying clients.'
  },
  { 
    name: 'YouTube Channel', emoji: '🎬', avgBuyPrice: 0, avgSellPrice: 100, salesPerMonth: 10, difficulty: 'Hard', 
    description: 'Build audience, monetize.', tips: 'Consistency > perfection', category: 'creative',
    guide: 'YouTube is a long game, but successful channels build audiences worth millions. Pick a niche you can create 100+ videos about without burning out. Study successful channels in your niche—not to copy, but to understand what works. Invest in audio quality first (a $50 mic matters more than a $1,000 camera). Create compelling thumbnails and titles—these determine if people click. Post consistently: weekly minimum, 2-3x weekly is better. Engage with every comment in your first year. Optimize for watch time: hook viewers in the first 10 seconds. Study your analytics to understand what content resonates. Monetization kicks in at 1,000 subscribers and 4,000 watch hours. Beyond AdSense: sponsorships, affiliate links, and digital products are where real money lives. Most channels take 1-2 years to gain traction—persistence is everything.'
  },
  { 
    name: 'Voiceover Work', emoji: '🎙️', avgBuyPrice: 0, avgSellPrice: 100, salesPerMonth: 10, difficulty: 'Medium', 
    description: 'Your voice = your product.', tips: 'Fiverr & Voices.com', category: 'creative',
    guide: 'Voiceover artists lend their voices to commercials, audiobooks, e-learning, and YouTube videos—all from a home studio. Start with a decent USB microphone ($100-200) and free software (Audacity). Record in a quiet space with blankets for sound absorption. Create demo reels showcasing different styles: commercial, narrative, character voices. List on Fiverr, Voices.com, and Voice123 to find initial work. Price per finished minute or per project—rates range from $100-500 for short commercial scripts to $200-400 per finished hour for audiobooks. Learn audio editing basics: noise removal, compression, EQ. Take direction well and deliver revisions quickly. Specialize in a niche for higher rates: medical narration, animation, IVR systems. Build a proper home studio as you grow: acoustic treatment, professional mic, interface. Direct clients pay significantly more than marketplace jobs.'
  },
  { 
    name: 'Handmade Crafts', emoji: '🧶', avgBuyPrice: 10, avgSellPrice: 45, salesPerMonth: 15, difficulty: 'Easy', 
    description: 'Turn hobbies into income.', tips: 'Etsy is your best friend', category: 'creative',
    guide: 'Handmade crafts turn hobbies into income—people pay premium for unique, handcrafted items. Popular categories: jewelry, candles, soap, pottery, knitting/crochet, woodworking, and home décor. Focus on items you genuinely enjoy making; authenticity shows in your work. Calculate true costs: materials, time, packaging, and fees. Price for profit—many crafters undercharge. Aim for 2-3x material costs at minimum. Etsy is the primary marketplace; optimize listings with keywords buyers search. Take bright, well-styled product photos from multiple angles. Create a cohesive brand and packaging experience. Offer customization for higher prices and personal connection. Sell at local craft fairs and farmers markets to test products and meet customers. Collect emails for your own customer list. Batch your production for efficiency. As you grow, consider wholesale to boutiques or teaching workshops.'
  },
  { 
    name: 'Print on Demand', emoji: '👕', avgBuyPrice: 12, avgSellPrice: 28, salesPerMonth: 30, difficulty: 'Easy', 
    description: 'Design once, sell forever.', tips: 'Printful + Etsy = passive income', category: 'creative',
    guide: 'Print on demand lets you sell custom-designed products without inventory—designs are printed when customers order. T-shirts are popular, but mugs, phone cases, and posters also sell well. You need design skills or willingness to learn Canva. Study bestselling POD products on Etsy and Redbubble for inspiration. Create designs for specific niches: professions, hobbies, fandoms, humor. Use Printful or Printify connected to Etsy, Shopify, or Amazon Merch. Price competitively but leave room for profit after product cost and fees. Create mockups showing designs on actual products. Optimize listings with keywords your audience searches. Build a catalog—POD is a volume game. Test designs quickly; double down on winners. Consider running low-cost Pinterest or TikTok ads for proven designs. Some creators license designs to others or sell design bundles for additional income streams.'
  },
  { 
    name: 'Consulting', emoji: '💼', avgBuyPrice: 0, avgSellPrice: 200, salesPerMonth: 8, difficulty: 'Hard', 
    description: 'Monetize your expertise.', tips: 'Package your knowledge', category: 'creative',
    guide: 'Consulting packages your professional expertise for premium rates—companies pay $100-500+/hour for specialized knowledge. Identify your expertise: marketing, operations, technology, HR, sales, or industry-specific knowledge. Define the transformation you provide: "I help SaaS companies reduce churn by 30%." Create service packages rather than hourly billing when possible—clients prefer predictable costs. Build credibility through content: LinkedIn posts, blog articles, or a podcast. Network in communities where your ideal clients gather. Start with 2-3 projects at lower rates to build case studies. Document results obsessively—ROI proof sells consulting. Develop frameworks and templates that systematize your approach. Price based on value delivered, not time spent. Consider productized consulting: fixed-scope, fixed-price services for specific outcomes. Many consultants eventually scale by hiring junior consultants or creating courses from their methodology.'
  },
  { 
    name: 'NFT Art', emoji: '🎭', avgBuyPrice: 50, avgSellPrice: 200, salesPerMonth: 3, difficulty: 'Hard', 
    description: 'Digital art with blockchain.', tips: 'Build community first', category: 'creative',
    guide: 'NFT art combines digital creativity with blockchain ownership—successful projects build passionate communities and generate significant revenue. Success requires both artistic skill and marketing/community building. Study successful NFT projects: what makes them collectible? Most focus on consistent style, limited editions, and engaged communities. Create art that tells a story or offers utility (access, membership, future drops). Choose your blockchain: Ethereum (largest market), Solana (lower fees), or newer chains. Use marketplaces like OpenSea, Foundation, or SuperRare. Build Twitter/X presence and engage authentically with the NFT community. Discord communities drive sales—provide value and connect with collectors. Collaborate with other artists for cross-promotion. The market has cooled from 2021 peaks, but dedicated collectors still exist. Focus on sustainable art creation rather than quick flips. Many successful artists transition between traditional commissions and NFT drops.'
  },
  
  // Passive Income
  { 
    name: 'Affiliate Marketing', emoji: '🔗', avgBuyPrice: 0, avgSellPrice: 30, salesPerMonth: 50, difficulty: 'Medium', 
    description: 'Recommend products, earn commissions.', tips: 'Build an email list', category: 'passive',
    guide: 'Affiliate marketing earns commissions recommending products you believe in—no inventory, no customer service, just promotion. Start by choosing a niche you\'re genuinely interested in: technology, fitness, personal finance, software, etc. Join affiliate programs: Amazon Associates (low commission but huge selection), ShareASale, Impact, or direct brand programs. Build a platform for recommendations: blog, YouTube channel, newsletter, or social media. Create genuine, helpful content that naturally incorporates product recommendations. Disclose affiliate relationships transparently—trust is everything. Focus on high-intent content: product reviews, comparisons, "best of" lists, tutorials. Email lists convert better than any other channel—offer a valuable freebie to build your list. Track what converts using affiliate dashboards. SEO is the best long-term traffic source for affiliate sites. Prioritize programs with recurring commissions (SaaS products) for passive income. Success takes 6-12 months of consistent content creation.'
  },
  { 
    name: 'Stock Photography', emoji: '🖼️', avgBuyPrice: 0, avgSellPrice: 5, salesPerMonth: 200, difficulty: 'Easy', 
    description: 'Upload once, earn forever.', tips: 'Shutterstock + Adobe Stock', category: 'passive',
    guide: 'Stock photography lets you earn passive income from photos you\'ve already taken—each image can sell repeatedly for years. Commercial-friendly images sell best: business settings, lifestyle, technology, diversity, and seasonal themes. Avoid recognizable brands, logos, and faces without model releases. Submit to multiple platforms: Shutterstock, Adobe Stock, iStock, Alamy. Each platform has different review processes and payment structures. Keywords are crucial—describe every element in your photos for searchability. Shoot with commercial use in mind: clean compositions, good lighting, space for text overlay. Study bestselling images in your categories for inspiration. Upload consistently; most successful contributors have 1,000+ images. Earnings per download are small ($0.25-$3) but compound over large portfolios. Quality matters more than quantity—rejected images waste review time. Some photographers create series around trending topics or evergreen business needs.'
  },
];

const INSPIRATIONAL_QUOTES = [
  { quote: "The best time to start was yesterday. The second best time is now.", author: "Unknown" },
  { quote: "Every expert was once a beginner.", author: "Helen Hayes" },
  { quote: "Your side hustle could become your main hustle.", author: "Gary Vaynerchuk" },
  { quote: "Wealth is not about having a lot of money; it's about having a lot of options.", author: "Chris Rock" },
  { quote: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "The harder you work, the luckier you get.", author: "Gary Player" },
  { quote: "Stop waiting for the perfect moment. Take the moment and make it perfect.", author: "Unknown" },
  { quote: "Your income is directly related to your philosophy, not the economy.", author: "Jim Rohn" },
  { quote: "Rich people have small TVs and big libraries. Poor people have small libraries and big TVs.", author: "Zig Ziglar" },
  { quote: "It's not about money or connections. It's the willingness to outwork everyone.", author: "Mark Cuban" },
  { quote: "The goal isn't more money. The goal is living life on your terms.", author: "Chris Brogan" },
  { quote: "Formal education will make you a living; self-education will make you a fortune.", author: "Jim Rohn" },
  { quote: "I never dreamed about success. I worked for it.", author: "Estée Lauder" },
];

// Get rotated hustles based on day (changes daily)
const getRotatedHustles = () => {
  const dayOfYear = Math.floor(Date.now() / 86400000);
  const shuffled = [...ALL_SIDE_HUSTLES].sort((a, b) => {
    const hashA = (a.name.charCodeAt(0) + dayOfYear) % 100;
    const hashB = (b.name.charCodeAt(0) + dayOfYear) % 100;
    return hashA - hashB;
  });
  return shuffled.slice(0, 8);
};

// Get random quote (changes on each page load/visit)
const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length);
  return INSPIRATIONAL_QUOTES[randomIndex];
};

const SideHustle = () => {
  const [buyPrice, setBuyPrice] = useState<string>('');
  const [sellPrice, setSellPrice] = useState<string>('');
  const [salesPerPeriod, setSalesPerPeriod] = useState<string>('');
  const [period, setPeriod] = useState<string>('month');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [selectedHustle, setSelectedHustle] = useState<SideHustleType | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Get rotated content on mount
  const [displayedHustles] = useState(() => getRotatedHustles());
  const [displayedQuote] = useState(() => getRandomQuote());

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const calculateResult = (buy: number, sell: number, sales: number, periodType: string) => {
    if (sell <= buy || sales <= 0) {
      setResult(null);
      return;
    }

    const profitPerItem = sell - buy;
    const periodMultiplier = periodType === 'week' ? 4 : periodType === 'day' ? 30 : 1;
    const monthlySales = sales * periodMultiplier;
    const monthlyProfit = profitPerItem * monthlySales;
    const yearlyProfit = monthlyProfit * 12;
    const roi = buy > 0 ? ((sell - buy) / buy) * 100 : 0;

    setResult({
      profit: profitPerItem,
      monthlyProfit,
      yearlyProfit,
      roi: isFinite(roi) ? roi : 0,
      salesPerDay: Math.ceil(monthlySales / 30),
      salesPerWeek: Math.ceil(monthlySales / 4),
      salesPerMonth: monthlySales
    });
  };

  const handleInputChange = (field: 'buy' | 'sell' | 'sales', value: string) => {
    if (field === 'buy') setBuyPrice(value);
    else if (field === 'sell') setSellPrice(value);
    else setSalesPerPeriod(value);

    // Recalculate with new values
    const buy = field === 'buy' ? parseFloat(value) || 0 : parseFloat(buyPrice) || 0;
    const sell = field === 'sell' ? parseFloat(value) || 0 : parseFloat(sellPrice) || 0;
    const sales = field === 'sales' ? parseFloat(value) || 0 : parseFloat(salesPerPeriod) || 0;
    calculateResult(buy, sell, sales, period);
  };

  const applyHustle = (hustle: SideHustleType) => {
    setSelectedHustle(hustle);
    setBuyPrice(hustle.avgBuyPrice.toString());
    setSellPrice(hustle.avgSellPrice.toString());
    setSalesPerPeriod(hustle.salesPerMonth.toString());
    setPeriod('month');
    
    calculateResult(hustle.avgBuyPrice, hustle.avgSellPrice, hustle.salesPerMonth, 'month');
    
    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-10 md:py-12">
        <PaywallGate>
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">
              Side Hustle <span className="gradient-gold-text">Guide</span>
            </h1>
          </div>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Every mogul started somewhere. Pick a hustle, run the numbers, and see what's possible. 💰
          </p>
          
          {/* Inspirational Quote */}
          <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20 max-w-xl mx-auto">
            <p className="text-base md:text-lg italic text-foreground/90">"{displayedQuote.quote}"</p>
            <p className="text-sm text-muted-foreground mt-2">— {displayedQuote.author}</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hot Hustles Grid */}
          <Card className="border-primary/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Flame className="h-6 w-6 text-amber-500" />
                    Today's Hot Picks
                  </CardTitle>
                  <CardDescription className="text-base">
                    Tap any option below to see how the numbers break down
                  </CardDescription>
                </div>
                <AllHustlesModal hustles={ALL_SIDE_HUSTLES} onSelectHustle={applyHustle} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {displayedHustles.map((hustle) => (
                  <button
                    key={hustle.name}
                    onClick={() => applyHustle(hustle)}
                    className={`p-4 rounded-xl border text-left transition-all hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.02] ${
                      selectedHustle?.name === hustle.name 
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20' 
                        : 'border-border/50 bg-card/50'
                    }`}
                  >
                    <span className="text-3xl block mb-2">{hustle.emoji}</span>
                    <span className="text-sm font-semibold block truncate text-foreground">{hustle.name}</span>
                    <span className={`text-xs font-medium ${
                      hustle.difficulty === 'Easy' ? 'text-green-500' :
                      hustle.difficulty === 'Medium' ? 'text-amber-500' : 'text-red-500'
                    }`}>{hustle.difficulty}</span>
                  </button>
                ))}
              </div>
              
              {!selectedHustle && (
                <div className="flex items-center justify-center gap-2 mt-6 text-muted-foreground">
                  <ArrowDown className="h-5 w-5 animate-bounce" />
                  <span className="text-base">Tap a hustle above to see the breakdown</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results & Calculator - Shows when hustle selected */}
          {selectedHustle && (
            <div ref={resultsRef} className="space-y-6 animate-fade-in">
              {/* Selected Hustle Header */}
              <div className="flex items-center gap-4 p-5 rounded-xl bg-primary/5 border border-primary/20">
                <span className="text-4xl">{selectedHustle.emoji}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground">{selectedHustle.name}</h3>
                  <p className="text-base text-foreground/70 mt-1">{selectedHustle.description}</p>
                  <p className="text-sm text-primary mt-2 font-medium">💡 Pro tip: {selectedHustle.tips}</p>
                </div>
              </div>

              {/* Getting Started Guide */}
              <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="h-5 w-5 text-amber-500" />
                    How to Get Started
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-foreground/80 leading-relaxed whitespace-pre-line">
                    {selectedHustle.guide}
                  </p>
                </CardContent>
              </Card>

              {/* Adjustable Inputs + Results Combined */}
              <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-amber-500/5">
                <CardContent className="p-5 md:p-6">
                  <p className="text-sm font-semibold text-foreground mb-4">Adjust the numbers to fit your situation:</p>
                  
                  {/* Inline Adjustable Inputs */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <Label className="text-xs text-foreground/70 font-medium">Buy Price</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          type="text"
                          inputMode="decimal"
                          value={buyPrice}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9.]/g, '');
                            handleInputChange('buy', value);
                          }}
                          className="pl-7 h-11 text-base font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-foreground/70 font-medium">Sell Price</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          type="text"
                          inputMode="decimal"
                          value={sellPrice}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9.]/g, '');
                            handleInputChange('sell', value);
                          }}
                          className="pl-7 h-11 text-base font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-foreground/70 font-medium">Sales/Month</Label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={salesPerPeriod}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          handleInputChange('sales', value);
                        }}
                        className="h-11 text-base font-medium mt-1"
                      />
                    </div>
                  </div>

                  {result && (
                    <>
                      {/* Results Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        <div className="text-center p-4 rounded-xl bg-card border border-border/50">
                          <p className="text-xs text-foreground/60 font-medium mb-1">Profit/Item</p>
                          <p className="text-xl md:text-2xl font-bold text-green-500">{formatCurrency(result.profit)}</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-card border border-border/50">
                          <p className="text-xs text-foreground/60 font-medium mb-1">Monthly</p>
                          <p className="text-xl md:text-2xl font-bold gradient-gold-text">{formatCurrency(result.monthlyProfit)}</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-card border border-border/50">
                          <p className="text-xs text-foreground/60 font-medium mb-1">Yearly</p>
                          <p className="text-xl md:text-2xl font-bold text-primary">{formatCurrency(result.yearlyProfit)}</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-card border border-border/50">
                          <p className="text-xs text-foreground/60 font-medium mb-1">ROI</p>
                          <p className="text-xl md:text-2xl font-bold text-amber-500">{result.roi.toFixed(0)}%</p>
                        </div>
                      </div>

                      {/* Volume Breakdown */}
                      <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                        <p className="text-sm text-foreground/80 mb-3 text-center font-semibold">📦 What it takes to hit these numbers:</p>
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="p-3 rounded-lg bg-secondary/30">
                            <p className="text-xl md:text-2xl font-bold text-foreground">{result.salesPerDay}</p>
                            <p className="text-xs text-foreground/60 font-medium">sales/day</p>
                          </div>
                          <div className="p-3 rounded-lg bg-secondary/30">
                            <p className="text-xl md:text-2xl font-bold text-foreground">{result.salesPerWeek}</p>
                            <p className="text-xs text-foreground/60 font-medium">sales/week</p>
                          </div>
                          <div className="p-3 rounded-lg bg-secondary/30">
                            <p className="text-xl md:text-2xl font-bold text-foreground">{result.salesPerMonth}</p>
                            <p className="text-xs text-foreground/60 font-medium">sales/month</p>
                          </div>
                        </div>
                        <p className="text-sm text-foreground/60 text-center mt-3">
                          That's {formatCurrency(result.profit)} profit per sale × {result.salesPerMonth} sales
                        </p>
                      </div>

                      {/* Motivational Messages based on results */}
                      <div className="mt-5 p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                        {result.yearlyProfit >= 100000 ? (
                          <p className="text-base md:text-lg text-primary font-semibold">
                            🚀 {formatCurrency(result.yearlyProfit)}/year — You could quit your day job!
                          </p>
                        ) : result.yearlyProfit >= 50000 ? (
                          <p className="text-base md:text-lg text-primary font-semibold">
                            🔥 {formatCurrency(result.yearlyProfit)}/year — That's serious side income!
                          </p>
                        ) : result.yearlyProfit >= 20000 ? (
                          <p className="text-base md:text-lg text-primary font-semibold">
                            💪 {formatCurrency(result.yearlyProfit)}/year — A solid extra income stream!
                          </p>
                        ) : result.yearlyProfit >= 5000 ? (
                          <p className="text-base md:text-lg text-primary font-semibold">
                            ✨ {formatCurrency(result.yearlyProfit)}/year — Great start! Scale it up!
                          </p>
                        ) : (
                          <p className="text-base md:text-lg text-primary font-semibold">
                            🌱 Every empire starts small. Keep building!
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Encouragement Footer */}
              <div className="text-center p-5 rounded-xl bg-gradient-to-r from-amber-500/10 via-primary/10 to-amber-500/10 border border-primary/20">
                <Crown className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                <p className="text-lg font-semibold text-foreground">
                  Remember: Consistency beats intensity.
                </p>
                <p className="text-base text-foreground/70 mt-2">
                  Show up every day, learn from mistakes, and watch your hustle grow into something real.
                </p>
              </div>
            </div>
          )}
        </div>
        </PaywallGate>
      </main>

      <Footer />
    </div>
  );
};

export default SideHustle;

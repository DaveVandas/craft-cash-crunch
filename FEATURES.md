# Wealth Perspective App - Complete Feature Documentation

> Last Updated: January 2025

## 💰 Core Features

### Celebrity Earnings Profiles
- Real-time celebrity earnings data via Perplexity AI
- Per-second, per-minute, per-hour, per-day, per-month, per-year breakdowns
- Category-based browsing (Athletes, Musicians, Actors, Business, Influencers, etc.)
- Similar celebrities recommendations
- Favorites system for logged-in users

### Reality Check Calculator (`/calculator`)
- Compare your salary to celebrity earnings
- Shows "They make your salary in X minutes/hours" comparisons
- Shareable branded cards with emoji overlays (😎 for higher earner, 😅 for lower)
- "Kick Me While I'm Down" mode for brutal flame-themed comparisons
- Side Hustle integration after results

### Side-by-Side Comparison (`/compare`)
- Compare any two celebrities head-to-head
- Visual wealth difference graphics
- Witty commentary on earnings gap
- "Flex Mode" with orange theme, flames, and "DOMINATES" declaration
- Tie detection when earnings within 5% of each other

---

## 🎮 Gamification & Engagement

### Wealth Quiz (`/quiz`)
- AI-generated questions via Perplexity API
- Streak system with 2x-5x multipliers
- Points system with streak bonuses
- Fun facts after each question
- Wealth titles based on score (Wealth Rookie → Wealth Wizard)
- Sound effects for correct/incorrect/streak/completion
- Custom loading image (quiz-loading-mogul.png)

### Mogul Markets (`/mogul-markets`)
- Paper trading simulator with virtual $100,000
- Real stock data via edge function
- Buy/sell stocks with virtual currency
- Portfolio tracking with P&L
- Order history and positions list
- Gold bars display for achievements
- Optional $4.99 virtual cash top-up

### Mogul Academy (`/mogul-academy`)
- 8 beginner-to-intermediate financial lessons
- Topics: trading, private equity, ROI, etc.
- 5th-grade reading level
- Lessons rotate every 4 days
- Email subscription for updates

### Trades Education (`/trades`)
- "Who Needs College!" theme
- 8 trade career paths with wage progressions
- Apprentice to master earnings breakdown
- Compound investment calculator
- Resource links for apprenticeships/trade schools

---

## 💵 Monetization

### Pricing Structure
- **Lifetime Access:** $6.99 (one-time payment)
- **Mogul Cash Top-up:** $4.99 (virtual trading money only)
- Stripe payment processing

### Paywall System
- 3 free anonymous searches
- PaywallGate blocks all major features after limit:
  - Calculator, Compare, Quiz, SideHustle
  - Search, Profile, Category, Share pages
- Beta invite system for early access

### Affiliate Program (`/become-affiliate`, `/affiliate-dashboard`)
- Tiered commission: $1 for first 1,000 signups, then $2+
- VIP tier with custom rates up to $2.50
- Payout tracking and management
- Affiliate share cards for promotion

### Referral Program (`/referral`)
- Unique referral codes per user
- Tracks referrals in database
- "Earn Free Access" link in user menu

---

## 📊 Admin Dashboard (`/admin`)

### Revenue Tab (NEW)
- Gross/Net revenue calculations
- Stripe fee breakdowns
- Daily/Weekly/Monthly period cards
- Interactive area chart with time range toggles
- Conversion rate tracking
- Week-over-week growth comparison
- Per-sale economics table
- Affiliate performance summary

### Search Trends Tab
- Most searched celebrities
- Category distribution
- Recent search activity

### User Management Tab
- Total users and paid users count
- User access details

### Beta Management Tab
- Create/manage beta invite codes
- Track beta feedback

### Affiliate Management Tab
- Approve/reject applications
- Set custom commission rates
- Process payouts

---

## 🎨 UI/UX Features

### Navigation
- **Breadcrumbs** on all pages (Home > Category > Page)
- Mobile hamburger menu with PWA update check
- Favorites dropdown in header
- Search with autocomplete

### Engagement Elements
- Money rain animation for billionaires
- "While you've been here" real-time earnings counter
- Time-on-page counter
- Daily Celebrity Spotlight on homepage
- Daily Wealth Facts rotation
- Trending Searches display
- Social Proof Notifications (toast showing recent activity)
- Exit-intent popup for departing users
- Countdown timer offer (24-hour limited deal)

### Share Cards
- Branded cards for Reality Check results
- Branded cards for Compare results
- Multi-platform sharing: X/Twitter, Facebook, Web Share API
- Copy-to-clipboard fallback
- Production domain URLs in shares

---

## 🔧 Technical Features

### PWA (Progressive Web App)
- Offline capability via service worker
- "Check for Updates" button in mobile menu
- Update notification toast
- Custom icons for iOS/Android
- 15-minute automatic update checks

### Navigation Stability
- Instant-preview patterns with 10ms isReady delay
- Scroll-to-top on all page navigations
- Carousel pause when document hidden
- Social proof notification delay on back navigation

### Authentication
- Email/password signup and login
- Auto-confirm email signups
- Profile setup modal for new users
- Admin role system

### Data & Caching
- Celebrity data caching in Supabase
- Admin can manually clear cache
- Rate limiting for API protection
- Search trends tracking

---

## 📁 Key File Locations

### Components
- `/src/components/navigation/Breadcrumb.tsx` - Reusable breadcrumb
- `/src/components/admin/RevenueDashboard.tsx` - Admin revenue metrics
- `/src/components/calculator/` - Reality Check components
- `/src/components/compare/` - Comparison components
- `/src/components/trading/` - Mogul Markets components

### Pages
- `/src/pages/Admin.tsx` - Admin dashboard
- `/src/pages/Calculator.tsx` - Reality Check
- `/src/pages/Compare.tsx` - Celebrity comparison
- `/src/pages/Quiz.tsx` - Wealth quiz
- `/src/pages/MogulMarkets.tsx` - Paper trading
- `/src/pages/MogulAcademy.tsx` - Financial education
- `/src/pages/Trades.tsx` - Trade careers
- `/src/pages/SideHustle.tsx` - Side hustle guide

### Edge Functions
- `/supabase/functions/get-celebrity-data/` - Perplexity AI lookups
- `/supabase/functions/generate-quiz-questions/` - Quiz generation
- `/supabase/functions/get-stock-data/` - Stock prices
- `/supabase/functions/create-payment/` - Stripe payments
- `/supabase/functions/verify-payment/` - Payment verification

---

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| `user_access` | Tracks lifetime access, search count, beta status |
| `profiles` | User display names and avatars |
| `favorites` | Saved celebrities per user |
| `search_trends` | Celebrity search analytics |
| `referrals` | Referral tracking |
| `affiliates` | Affiliate partner data |
| `affiliate_referrals` | Affiliate conversion tracking |
| `affiliate_payouts` | Payout records |
| `beta_invites` | Beta access codes |
| `beta_feedback` | Beta user feedback |
| `trading_portfolios` | Virtual trading accounts |
| `trading_positions` | Current stock holdings |
| `trading_orders` | Trade history |
| `celebrity_images` | Cached celebrity photos |

---

## 🔐 Security

- Row Level Security (RLS) on all tables
- Admin role verification for dashboard access
- Rate limiting on API endpoints
- Secure Stripe payment flow
- No exposed API keys in frontend

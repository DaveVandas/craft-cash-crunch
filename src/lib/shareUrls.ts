/**
 * Generate OG-optimized share URLs for social media.
 * These URLs point to the edge function which serves proper OG meta tags
 * for Twitter, Facebook, LinkedIn, etc.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export type ShareablePage =
  | 'home'
  | 'debt-destroyer'
  | 'quiz'
  | 'calculator'
  | 'mogul-markets'
  | 'trades'
  | 'celebrity-portfolios'
  | 'side-hustle'
  | 'compare'
  | 'affiliate';

const SHARE_URL_VERSION = 2;

function normalizeRedirectPath(redirectPath: string): string {
  if (!redirectPath) return "/";
  return redirectPath.startsWith("/") ? redirectPath : `/${redirectPath}`;
}

/**
 * Get the social-optimized share URL for a page.
 * When shared on Twitter/Facebook, this URL will return proper OG meta tags.
 * When clicked by regular users, it redirects to the actual page.
 */
export function getShareUrl(page: ShareablePage): string {
  return `${SUPABASE_URL}/functions/v1/og-share?page=${page}&v=${SHARE_URL_VERSION}`;
}

/**
 * Like getShareUrl(), but lets you redirect humans to an arbitrary in-app path
 * (e.g. /ref/CODE, /landing-d?ref=CODE). Crawlers still get the OG HTML.
 */
export function getShareUrlWithRedirect(page: ShareablePage, redirectPath: string): string {
  const redirect = normalizeRedirectPath(redirectPath);
  return `${SUPABASE_URL}/functions/v1/og-share?page=${page}&redirect=${encodeURIComponent(redirect)}&v=${SHARE_URL_VERSION}`;
}

/**
 * Page key to friendly name mapping
 */
export const PAGE_NAMES: Record<ShareablePage, string> = {
  'home': 'Wealth Perspective',
  'debt-destroyer': 'Debt Destroyer',
  'quiz': 'Wealth Quiz',
  'calculator': 'Reality Check',
  'mogul-markets': 'Mogul Markets',
  'trades': 'Trade History',
  'celebrity-portfolios': 'VIP Portfolios',
  'side-hustle': 'Side Hustles',
  'compare': 'Celebrity Compare',
  'affiliate': 'Get Paid to Share',
};

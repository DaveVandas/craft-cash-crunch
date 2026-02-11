/**
 * ShareCardDecorations - Premium static visual effects for share cards.
 * 
 * These are pure DOM elements (no CSS animations) so html2canvas captures them perfectly.
 * Each variant matches the card's color theme (gold, orange, red, emerald).
 */

interface ShareCardDecorationsProps {
  /** Color theme: 'gold' (default), 'orange' (flex), 'red' (brutal), 'emerald' (side hustle) */
  variant?: 'gold' | 'orange' | 'red' | 'emerald';
  /** Show corner sparkle ornaments */
  corners?: boolean;
  /** Show scattered gold particle dots */
  particles?: boolean;
  /** Show subtle radial glow overlay */
  glow?: boolean;
  /** Show decorative coin elements */
  coins?: boolean;
}

const THEME = {
  gold: {
    sparkle: '#ffd700',
    sparkleAlt: '#ffb347',
    glow: 'rgba(255, 215, 0, 0.06)',
    glowEdge: 'rgba(255, 215, 0, 0.03)',
    particle: 'rgba(255, 215, 0, 0.15)',
    particleAlt: 'rgba(255, 179, 71, 0.12)',
    coin: '#ffd700',
    coinShadow: 'rgba(255, 215, 0, 0.3)',
  },
  orange: {
    sparkle: '#fb923c',
    sparkleAlt: '#f97316',
    glow: 'rgba(249, 115, 22, 0.06)',
    glowEdge: 'rgba(249, 115, 22, 0.03)',
    particle: 'rgba(249, 115, 22, 0.15)',
    particleAlt: 'rgba(251, 146, 60, 0.12)',
    coin: '#f97316',
    coinShadow: 'rgba(249, 115, 22, 0.3)',
  },
  red: {
    sparkle: '#ef4444',
    sparkleAlt: '#f97316',
    glow: 'rgba(239, 68, 68, 0.06)',
    glowEdge: 'rgba(239, 68, 68, 0.03)',
    particle: 'rgba(239, 68, 68, 0.15)',
    particleAlt: 'rgba(249, 115, 22, 0.12)',
    coin: '#ef4444',
    coinShadow: 'rgba(239, 68, 68, 0.3)',
  },
  emerald: {
    sparkle: '#34d399',
    sparkleAlt: '#6ee7b7',
    glow: 'rgba(52, 211, 153, 0.06)',
    glowEdge: 'rgba(52, 211, 153, 0.03)',
    particle: 'rgba(52, 211, 153, 0.15)',
    particleAlt: 'rgba(110, 231, 183, 0.12)',
    coin: '#34d399',
    coinShadow: 'rgba(52, 211, 153, 0.3)',
  },
};

// 4-point star SVG for corner ornaments
const StarSVG = ({ color, size = 12 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

// Small diamond sparkle
const DiamondSVG = ({ color, size = 8 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
    <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" />
  </svg>
);

// Coin circle with $ sign
const CoinSVG = ({ color, shadow, size = 20 }: { color: string; shadow: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="15" fill="none" stroke={color} strokeWidth="2" opacity="0.4" />
    <circle cx="16" cy="16" r="12" fill="none" stroke={color} strokeWidth="1" opacity="0.2" />
    <text
      x="16"
      y="21"
      textAnchor="middle"
      fill={color}
      fontSize="14"
      fontWeight="bold"
      fontFamily="serif"
      opacity="0.35"
    >
      $
    </text>
  </svg>
);

const ShareCardDecorations = ({
  variant = 'gold',
  corners = true,
  particles = true,
  glow = true,
  coins = true,
}: ShareCardDecorationsProps) => {
  const t = THEME[variant];

  return (
    <>
      {/* Radial glow overlay */}
      {glow && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, ${t.glow} 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, ${t.glowEdge} 0%, transparent 50%)`,
          }}
        />
      )}

      {/* Corner sparkle ornaments */}
      {corners && (
        <>
          {/* Top-left cluster */}
          <div className="absolute top-3 left-3 pointer-events-none" style={{ opacity: 0.7 }}>
            <StarSVG color={t.sparkle} size={14} />
          </div>
          <div className="absolute top-6 left-8 pointer-events-none" style={{ opacity: 0.4 }}>
            <DiamondSVG color={t.sparkleAlt} size={6} />
          </div>

          {/* Top-right cluster */}
          <div className="absolute top-4 right-4 pointer-events-none" style={{ opacity: 0.5 }}>
            <StarSVG color={t.sparkleAlt} size={10} />
          </div>
          <div className="absolute top-8 right-7 pointer-events-none" style={{ opacity: 0.3 }}>
            <DiamondSVG color={t.sparkle} size={7} />
          </div>

          {/* Bottom-left */}
          <div className="absolute bottom-12 left-4 pointer-events-none" style={{ opacity: 0.4 }}>
            <DiamondSVG color={t.sparkle} size={8} />
          </div>

          {/* Bottom-right */}
          <div className="absolute bottom-14 right-3 pointer-events-none" style={{ opacity: 0.5 }}>
            <StarSVG color={t.sparkleAlt} size={11} />
          </div>
        </>
      )}

      {/* Scattered particle dots */}
      {particles && (
        <>
          {[
            { top: '15%', left: '12%', size: 3, opacity: 0.4 },
            { top: '25%', right: '15%', size: 2, opacity: 0.3 },
            { top: '40%', left: '8%', size: 4, opacity: 0.25 },
            { top: '55%', right: '10%', size: 3, opacity: 0.35 },
            { top: '70%', left: '18%', size: 2, opacity: 0.3 },
            { top: '80%', right: '20%', size: 3, opacity: 0.2 },
            { top: '35%', left: '85%', size: 2, opacity: 0.25 },
            { top: '60%', left: '5%', size: 3, opacity: 0.3 },
          ].map((dot, i) => (
            <div
              key={`particle-${i}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                top: dot.top,
                left: dot.left,
                right: (dot as { right?: string }).right,
                width: dot.size,
                height: dot.size,
                backgroundColor: i % 2 === 0 ? t.particle : t.particleAlt,
                opacity: dot.opacity,
              }}
            />
          ))}
        </>
      )}

      {/* Decorative coin elements */}
      {coins && (
        <>
          <div className="absolute top-[22%] right-2 pointer-events-none" style={{ opacity: 0.25 }}>
            <CoinSVG color={t.coin} shadow={t.coinShadow} size={22} />
          </div>
          <div className="absolute bottom-[25%] left-2 pointer-events-none" style={{ opacity: 0.2 }}>
            <CoinSVG color={t.coin} shadow={t.coinShadow} size={18} />
          </div>
        </>
      )}
    </>
  );
};

export default ShareCardDecorations;

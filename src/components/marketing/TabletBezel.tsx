interface TabletBezelProps {
  src: string;
  alt?: string;
  /** Outer width in px at full scale. Height derived from iPad Pro 13" ratio (~1.366). */
  width?: number;
}

/**
 * iPad Pro 13"–style bezel frame for store marketing screenshots.
 * Uniform thin bezel, rounded corners, no home button. Sized in absolute px.
 */
export function TabletBezel({ src, alt = '', width = 1200 }: TabletBezelProps) {
  // iPad Pro 13" native is 2064×2752 ≈ 1.333 ratio (4:3-ish)
  const height = Math.round((width * 2732) / 2048);
  const bezel = Math.max(20, Math.round(width * 0.03));
  const outerRadius = Math.round(width * 0.055);
  const innerRadius = Math.max(8, outerRadius - bezel);

  return (
    <div
      className="relative mx-auto"
      style={{
        width,
        height,
        borderRadius: outerRadius,
        background:
          'linear-gradient(135deg, #3a3a3d 0%, #1c1c1e 40%, #2c2c2e 70%, #4a4a4d 100%)',
        padding: bezel,
        boxShadow:
          '0 60px 120px -20px rgba(0,0,0,0.7), 0 0 0 2px rgba(212,175,55,0.25), inset 0 0 0 1px rgba(255,255,255,0.08)',
      }}
    >
      <div
        className="relative overflow-hidden bg-black"
        style={{ width: '100%', height: '100%', borderRadius: innerRadius }}
      >
        <img
          src={src}
          alt={alt}
          className="block w-full h-full object-cover object-top"
          draggable={false}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: innerRadius,
            background:
              'linear-gradient(115deg, rgba(255,255,255,0.06) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.04) 100%)',
          }}
        />
      </div>
    </div>
  );
}

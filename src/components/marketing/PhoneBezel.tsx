interface PhoneBezelProps {
  src: string;
  alt?: string;
  /** Outer width in px at full scale. Height is derived from 19.5:9 iPhone ratio. */
  width?: number;
}

/**
 * iPhone 15 Pro–style bezel frame used in store marketing screenshots.
 * Renders a thin titanium ring, Dynamic Island, and a screenshot inside.
 * Sized in absolute px so it composes cleanly inside the 1290×2796 marketing
 * cards that render at 1/3 scale in the preview.
 */
export function PhoneBezel({ src, alt = '', width = 900 }: PhoneBezelProps) {
  const height = Math.round((width * 19.5) / 9);
  const bezel = Math.max(14, Math.round(width * 0.018));
  const outerRadius = Math.round(width * 0.13);
  const innerRadius = outerRadius - bezel;
  const islandW = Math.round(width * 0.22);
  const islandH = Math.round(width * 0.06);
  const islandTop = Math.round(bezel + width * 0.025);

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
      {/* inner screen */}
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
        {/* Dynamic Island removed for marketing clarity so app headers stay readable */}
        {/* subtle glare */}
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

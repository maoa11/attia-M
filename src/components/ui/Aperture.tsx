"use client";

/**
 * The lens ring lifted from Attia's own Behance banner, where a faint circle
 * sits behind his name. It is the one piece of graphic language the site owns,
 * so it recurs at three scales: huge and static behind the hero, small beside
 * section labels, and as the cursor ring.
 *
 * `blades` draws the six-leaf aperture inside the ring; the hero uses it, the
 * small marks do not, because at 12px the leaves turn to mud.
 */
export default function Aperture({
  size = 40,
  blades = false,
  className = "",
  strokeWidth = 1,
}: {
  size?: number;
  blades?: boolean;
  className?: string;
  strokeWidth?: number;
}) {
  // Six leaves, each a chord rotated 60° around the centre.
  const leaves = Array.from({ length: 6 }, (_, i) => i * 60);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="50"
        cy="50"
        r="48"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        opacity="0.55"
      />
      {blades && (
        <g stroke="currentColor" strokeWidth={strokeWidth} opacity="0.28">
          {leaves.map((angle) => (
            <line
              key={angle}
              x1="50"
              y1="2"
              x2="91.6"
              y2="26"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
        </g>
      )}
    </svg>
  );
}

interface LogoProps {
  size?: number;
  showText?: boolean;
  variant?: "light" | "dark";
  className?: string;
}

const NAVY = "#1B3A5C";
const AMBER = "#F59E0B";

export function Logo({
  size = 36,
  showText = true,
  variant = "dark",
  className,
}: LogoProps) {
  const textColor = variant === "light" ? "#FFFFFF" : NAVY;

  return (
    <span
      className={["flex flex-row items-center gap-2.5", className]
        .filter(Boolean)
        .join(" ")}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Turbine Nexus"
        className="shrink-0"
      >
        {/* Navy emblem disc */}
        <circle cx="16" cy="16" r="16" fill={NAVY} />
        {/* Turbine blades radiating from the central hub */}
        <g fill={AMBER}>
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d="M16 16 L18.4 5.6 A11 11 0 0 0 13.6 5.6 Z"
              transform={`rotate(${i * 72} 16 16)`}
            />
          ))}
        </g>
        {/* Central hub */}
        <circle cx="16" cy="16" r="3.4" fill={NAVY} />
        <circle cx="16" cy="16" r="2" fill={AMBER} />
      </svg>

      {showText && (
        <span
          className="font-bold tracking-tight leading-none"
          style={{ color: textColor, fontSize: size * 0.42 }}
        >
          TURBINE NEXUS
        </span>
      )}
    </span>
  );
}

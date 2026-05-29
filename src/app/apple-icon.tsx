import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const NAVY = "#1B3A5C";
const AMBER = "#F59E0B";

export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: NAVY,
          position: "relative",
        }}
      >
        <svg
          width="180"
          height="180"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="16" cy="16" r="16" fill={NAVY} />
          <g fill={AMBER}>
            <path d="M16 16 L18.4 5.6 A11 11 0 0 0 13.6 5.6 Z" transform="rotate(0 16 16)" />
            <path d="M16 16 L18.4 5.6 A11 11 0 0 0 13.6 5.6 Z" transform="rotate(72 16 16)" />
            <path d="M16 16 L18.4 5.6 A11 11 0 0 0 13.6 5.6 Z" transform="rotate(144 16 16)" />
            <path d="M16 16 L18.4 5.6 A11 11 0 0 0 13.6 5.6 Z" transform="rotate(216 16 16)" />
            <path d="M16 16 L18.4 5.6 A11 11 0 0 0 13.6 5.6 Z" transform="rotate(288 16 16)" />
          </g>
          <circle cx="16" cy="16" r="4.2" fill={NAVY} />
        </svg>
        <div
          style={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 44,
            fontWeight: 800,
            color: AMBER,
            letterSpacing: -2,
          }}
        >
          TN
        </div>
      </div>
    ),
    { ...size }
  );
}

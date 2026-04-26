import type { BannerContent } from "../../types";

interface Props {
  content: BannerContent;
  logo?: string;
}

export function BannerCell({ content, logo }: Props) {
  const {
    title,
    subtitle,
    showLogo,
    logoPosition,
    gradientFrom,
    gradientTo,
    gradientAngle,
    textAlign,
  } = content;

  const gradient = `linear-gradient(${gradientAngle}deg, ${gradientFrom}, ${gradientTo})`;

  const flexDir = logoPosition === "center" ? "column" : "row";
  const logoFirst = logoPosition === "left";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: gradient,
        borderRadius: "var(--radius-scale)",
        display: "flex",
        flexDirection: flexDir,
        alignItems: logoPosition === "center" ? "center" : "center",
        justifyContent: logoPosition === "center" ? "center" : "flex-start",
        gap: 14,
        padding: 4,
        overflow: "hidden",
      }}
    >
      {/* Subtle noise overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.12)",
          borderRadius: "inherit",
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      {showLogo && logo && (
        <img
          src={logo}
          alt="Brand logo"
          style={{
            height: 40,
            maxWidth: 120,
            objectFit: "contain",
            order: logoFirst ? 0 : 1,
            flexShrink: 0,
            position: "relative",
            filter: "brightness(0) invert(1)",
          }}
        />
      )}

      {/* Text */}
      <div
        style={{
          position: "relative",
          textAlign,
          order: logoFirst ? 1 : 0,
          flex: 1,
          minWidth: 0,
        }}
      >
        {title && (
          <p
            style={{
              margin: 0,
              fontSize: "calc(var(--font-base-size) * 1.5)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              fontFamily: "var(--font-family)",
            }}
          >
            {title}
          </p>
        )}
        {subtitle && (
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "var(--font-base-size)",
              color: "rgba(255,255,255,0.75)",
              fontFamily: "var(--font-family)",
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

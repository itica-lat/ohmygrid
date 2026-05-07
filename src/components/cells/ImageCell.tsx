import type { ImageContent } from "../../types";
import { useT } from "../../lib/i18n";

interface Props {
  content: ImageContent;
}

export function ImageCell({ content }: Props) {
  const { src, alt, fit, position } = content;
  const t = useT();
  if (!src) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.3)",
          fontSize: 13,
          fontFamily: "var(--font-family)",
        }}
      >
        🖼 {t("image.noSource")}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: "100%",
        height: "100%",
        objectFit: fit,
        objectPosition: position,
        display: "block",
        borderRadius: "var(--radius-scale)",
      }}
    />
  );
}

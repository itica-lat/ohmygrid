import { useRef, useState, useEffect } from "react";
import type { BrandTokens, BorderRadiusScale, SpacingScale } from "../types";
import type { Action } from "../state/reducer";
import { loadSavedBrands, saveBrand, deleteSavedBrand } from "../utils/localStorage";
import type { SavedBrand } from "../types";
import { useT } from "../lib/i18n";

const FONT_OPTIONS = [
  { value: "system-ui", label: "System UI" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "'Inter', sans-serif", label: "Inter" },
  { value: "'Poppins', sans-serif", label: "Poppins" },
  { value: "'DM Sans', sans-serif", label: "DM Sans" },
  { value: "'Space Grotesk', sans-serif", label: "Space Grotesk" },
  { value: "'Playfair Display', serif", label: "Playfair Display" },
  { value: "ui-monospace, monospace", label: "Mono" },
];

const GOOGLE_FONTS = ["Inter", "Poppins", "DM Sans", "Space Grotesk", "Playfair Display"];

interface Props {
  brand: BrandTokens;
  dispatch: React.Dispatch<Action>;
}

interface ColorRowProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

function ColorRow({ label, value, onChange }: ColorRowProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <button
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          border: "1px solid rgba(255,255,255,0.15)",
          background: value,
          cursor: "pointer",
          flexShrink: 0,
          padding: 0,
        }}
        onClick={() => inputRef.current?.click()}
      />
      <input
        ref={inputRef}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          if (/^#[0-9a-fA-F]{0,8}$/.test(e.target.value)) onChange(e.target.value);
        }}
        className="input-base"
        style={{ flex: 1, fontSize: 12, fontFamily: "ui-monospace, monospace" }}
      />
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", minWidth: 90 }}>{label}</span>
    </div>
  );
}

export function BrandPanel({ brand, dispatch }: Props) {
  const t = useT();
  const set = (updates: Partial<BrandTokens>) => dispatch({ type: "SET_BRAND", brand: updates });

  // Brand presets
  const [savedBrands, setSavedBrands] = useState<SavedBrand[]>(() => loadSavedBrands());
  const [saveBrandName, setSaveBrandName] = useState("");
  const [showSaveBrandInput, setShowSaveBrandInput] = useState(false);

  // Custom font URL
  const [fontUrlDraft, setFontUrlDraft] = useState(brand.customFontUrl ?? "");

  useEffect(() => {
    setFontUrlDraft(brand.customFontUrl ?? "");
  }, [brand.customFontUrl]);

  function injectFontLink(url: string) {
    const id = "custom-gf-" + btoa(url).slice(0, 16);
    if (url && !document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = url;
      document.head.appendChild(link);
    }
  }

  function handleCustomFontUrl(url: string) {
    setFontUrlDraft(url);
    if (!url) return;
    injectFontLink(url);
    // Try to parse the family name from the URL and set it
    // e.g. fonts.googleapis.com/css2?family=Raleway:wght@400;700
    const match = url.match(/family=([^:&]+)/);
    if (match) {
      const family = decodeURIComponent(match[1]).replace(/\+/g, " ");
      set({ fontFamily: `'${family}', sans-serif`, customFontUrl: url });
    } else {
      set({ customFontUrl: url });
    }
  }

  function handleSaveBrand() {
    const name = saveBrandName.trim();
    if (!name) return;
    const saved = saveBrand(name, brand);
    setSavedBrands((prev) => [...prev, saved]);
    setSaveBrandName("");
    setShowSaveBrandInput(false);
  }

  function handleDeleteBrand(id: string) {
    deleteSavedBrand(id);
    setSavedBrands((prev) => prev.filter((b) => b.id !== id));
  }

  function handleLoadBrand(b: SavedBrand) {
    set(b.brand);
    if (b.brand.customFontUrl) injectFontLink(b.brand.customFontUrl);
  }

  const handleFontChange = (value: string) => {
    set({ fontFamily: value });
    // Inject built-in Google Font link if needed
    const name = GOOGLE_FONTS.find((f) => value.includes(f));
    if (name) {
      const id = `gf-${name.replace(/\s/g, "-")}`;
      if (!document.getElementById(id)) {
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:wght@400;500;600;700&display=swap`;
        document.head.appendChild(link);
      }
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string") set({ logo: ev.target.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      style={{
        width: 272,
        flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.07)",
        overflowY: "auto",
        padding: "16px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div>
        <p className="section-label">{t("brand.brandTokens")}</p>
        <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>
          {t("brand.realtimeHint")}
        </p>
      </div>

      {/* Colors */}
      <section>
        <p className="section-label">{t("brand.colors")}</p>
        <ColorRow
          label={t("brand.primary")}
          value={brand.colorPrimary}
          onChange={(v) => set({ colorPrimary: v })}
        />
        <ColorRow
          label={t("brand.secondary")}
          value={brand.colorSecondary}
          onChange={(v) => set({ colorSecondary: v })}
        />
        <ColorRow
          label={t("brand.accent")}
          value={brand.colorAccent}
          onChange={(v) => set({ colorAccent: v })}
        />
        <ColorRow
          label={t("brand.background")}
          value={brand.colorBackground}
          onChange={(v) => set({ colorBackground: v })}
        />
        <ColorRow
          label={t("brand.surface")}
          value={brand.colorSurface}
          onChange={(v) => set({ colorSurface: v })}
        />
        <ColorRow
          label={t("brand.text")}
          value={brand.colorText}
          onChange={(v) => set({ colorText: v })}
        />
      </section>
      <section>
        <p className="section-label">{t("brand.brandPresets")}</p>
        {savedBrands.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 10 }}>
            {savedBrands.map((b) => (
              <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                  {[b.brand.colorPrimary, b.brand.colorSecondary, b.brand.colorAccent].map(
                    (c, i) => (
                      <div
                        key={i}
                        style={{ width: 12, height: 12, borderRadius: 3, background: c }}
                      />
                    ),
                  )}
                </div>
                <span
                  style={{
                    flex: 1,
                    fontSize: 12,
                    color: "rgba(255,255,255,0.65)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {b.name}
                </span>
                <button
                  className="btn-ghost"
                  style={{ fontSize: 11, padding: "3px 8px", height: 24 }}
                  onClick={() => handleLoadBrand(b)}
                >
                  {t("brand.apply")}
                </button>
                <button
                  onClick={() => handleDeleteBrand(b.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "rgba(239,68,68,0.6)",
                    cursor: "pointer",
                    fontSize: 14,
                    lineHeight: 1,
                    padding: "0 2px",
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        {savedBrands.length === 0 && (
          <p
            style={{
              margin: "0 0 10px",
              fontSize: 11,
              color: "rgba(255,255,255,0.3)",
              lineHeight: 1.5,
            }}
          >
            {t("brand.noSavedPresets")}
          </p>
        )}
        {showSaveBrandInput ? (
          <div style={{ display: "flex", gap: 5 }}>
            <input
              type="text"
              autoFocus
              value={saveBrandName}
              onChange={(e) => setSaveBrandName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveBrand();
                if (e.key === "Escape") setShowSaveBrandInput(false);
              }}
              placeholder={t("brand.presetNamePlaceholder")}
              className="input-base"
              style={{ flex: 1, height: 28, padding: "0 8px", fontSize: 12 }}
            />
            <button
              className="btn-primary"
              style={{ height: 28, padding: "0 10px", fontSize: 12 }}
              onClick={handleSaveBrand}
            >
              {t("brand.save")}
            </button>
            <button
              className="btn-ghost"
              style={{ height: 28, padding: "0 8px", fontSize: 12 }}
              onClick={() => setShowSaveBrandInput(false)}
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            className="btn-ghost"
            style={{ fontSize: 12, height: 28, padding: "0 12px" }}
            onClick={() => setShowSaveBrandInput(true)}
          >
            {t("brand.saveCurrentBrand")}
          </button>
        )}
      </section>

      {/* Typography */}
      <section>
        <p className="section-label">{t("brand.typography")}</p>
        <div style={{ marginBottom: 8 }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
            {t("brand.fontFamily")}
          </p>
          <select
            className="input-base"
            value={brand.fontFamily}
            onChange={(e) => handleFontChange(e.target.value)}
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: "0 0 4px", fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
              {t("brand.baseSizePx")}
            </p>
            <input
              type="number"
              min={10}
              max={24}
              value={brand.fontBaseSize}
              onChange={(e) => set({ fontBaseSize: Math.max(10, Math.min(24, +e.target.value)) })}
              className="input-base"
            />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: "0 0 4px", fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
              {t("brand.typeRatio")}
            </p>
            <input
              type="number"
              min={1.0}
              max={1.618}
              step={0.05}
              value={brand.fontRatio}
              onChange={(e) => set({ fontRatio: Math.max(1, Math.min(1.618, +e.target.value)) })}
              className="input-base"
            />
          </div>
        </div>
        <div
          style={{
            padding: "8px 10px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: brand.fontFamily,
              fontSize: brand.fontBaseSize,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.5,
            }}
          >
            The quick brown fox
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: brand.fontFamily,
              fontSize: brand.fontBaseSize * brand.fontRatio,
              color: "#f8fafc",
              fontWeight: 600,
            }}
          >
            {t("brand.headingPreview")}
          </p>
        </div>

        {/* Custom Google Fonts URL */}
        <div style={{ marginTop: 10 }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
            {t("brand.customGoogleFontUrl")}
          </p>
          <input
            type="text"
            value={fontUrlDraft}
            onChange={(e) => setFontUrlDraft(e.target.value)}
            onBlur={() => {
              if (fontUrlDraft !== (brand.customFontUrl ?? "")) handleCustomFontUrl(fontUrlDraft);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCustomFontUrl(fontUrlDraft);
            }}
            placeholder="https://fonts.googleapis.com/css2?family=…"
            className="input-base"
            style={{ fontSize: 11 }}
          />
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 10,
              color: "rgba(255,255,255,0.25)",
              lineHeight: 1.5,
            }}
          >
            {t("brand.googleFontHelp")}
          </p>
        </div>
      </section>

      {/* Border Radius */}
      <section>
        <p className="section-label">{t("brand.borderRadius")}</p>
        <div style={{ display: "flex", gap: 6 }}>
          {(["sharp", "soft", "pill"] as BorderRadiusScale[]).map((scale) => (
            <button
              key={scale}
              onClick={() => set({ borderRadiusScale: scale })}
              style={{
                flex: 1,
                padding: "6px 0",
                borderRadius: scale === "sharp" ? 4 : scale === "soft" ? 10 : 9999,
                border: `1px solid ${brand.borderRadiusScale === scale ? "rgba(99,102,241,0.7)" : "rgba(255,255,255,0.1)"}`,
                background:
                  brand.borderRadiusScale === scale ? "rgba(99,102,241,0.12)" : "transparent",
                color: brand.borderRadiusScale === scale ? "#f8fafc" : "rgba(255,255,255,0.4)",
                fontSize: 11,
                fontWeight: 500,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {scale}
            </button>
          ))}
        </div>
      </section>

      {/* Spacing */}
      <section>
        <p className="section-label">{t("brand.spacingScale")}</p>
        <div style={{ display: "flex", gap: 6 }}>
          {(["compact", "default", "relaxed"] as SpacingScale[]).map((scale) => (
            <button
              key={scale}
              onClick={() => set({ spacingScale: scale })}
              style={{
                flex: 1,
                padding: "6px 0",
                borderRadius: 8,
                border: `1px solid ${brand.spacingScale === scale ? "rgba(99,102,241,0.7)" : "rgba(255,255,255,0.1)"}`,
                background: brand.spacingScale === scale ? "rgba(99,102,241,0.12)" : "transparent",
                color: brand.spacingScale === scale ? "#f8fafc" : "rgba(255,255,255,0.4)",
                fontSize: 11,
                fontWeight: 500,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {scale}
            </button>
          ))}
        </div>
      </section>

      {/* Logo */}
      <section>
        <p className="section-label">{t("brand.logo")}</p>
        {brand.logo ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <img
              src={brand.logo}
              alt="Logo"
              style={{ height: 32, objectFit: "contain", borderRadius: 6 }}
            />
            <button
              className="btn-ghost"
              style={{ fontSize: 11 }}
              onClick={() => set({ logo: "" })}
            >
              {t("brand.remove")}
            </button>
          </div>
        ) : null}
        <label
          className="btn-ghost"
          style={{ cursor: "pointer", display: "inline-block", fontSize: 12 }}
        >
          {brand.logo ? t("brand.replaceLogo") : t("brand.uploadLogo")}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleLogoUpload}
          />
        </label>
      </section>

      {/* Token table (raw values for devs) */}
      <section>
        <p className="section-label">{t("brand.rawCssVariables")}</p>
        <div className="code-block" style={{ fontSize: 10 }}>
          {`--color-primary: ${brand.colorPrimary};\n--color-secondary: ${brand.colorSecondary};\n--color-accent: ${brand.colorAccent};\n--color-bg: ${brand.colorBackground};\n--color-surface: ${brand.colorSurface};\n--color-text: ${brand.colorText};\n--font-family: ${brand.fontFamily};\n--font-base-size: ${brand.fontBaseSize}px;\n--font-ratio: ${brand.fontRatio};`}
        </div>
      </section>
    </div>
  );
}

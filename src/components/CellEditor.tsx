import { useState, useEffect } from "react";
import type {
  GridCell,
  CellContentType,
  TextContent,
  ImageContent,
  StatContent,
  FeatureContent,
  TagCloudContent,
  CodeContent,
  BannerContent,
  TextAlign,
  HeadingSize,
  ImageFit,
  TrendDirection,
  GridConfig,
  GridMode,
  BrandTokens,
} from "../types";
import type { Action } from "../state/reducer";
import { createDefaultContent } from "../state/initialState";
import { useT } from "../lib/i18n";

interface Props {
  cell: GridCell | null;
  cells: GridCell[];
  gridConfig: GridConfig;
  mode: GridMode;
  brand: BrandTokens;
  dispatch: React.Dispatch<Action>;
}

const CONTENT_TYPES: CellContentType[] = [
  "text",
  "image",
  "stat",
  "feature",
  "tagcloud",
  "code",
  "banner",
];

const CONTENT_TYPE_TO_KEY: Record<CellContentType, string> = {
  text: "editor.textBlock",
  image: "editor.image",
  stat: "editor.statCard",
  feature: "editor.featureCard",
  tagcloud: "editor.tagCloud",
  code: "editor.codeSnippet",
  banner: "editor.bannerLogo",
};

// ─── Collision helpers ────────────────────────────────────────────────────────

function cellsOverlap(
  a: { colStart: number; rowStart: number; colSpan: number; rowSpan: number },
  b: { colStart: number; rowStart: number; colSpan: number; rowSpan: number },
): boolean {
  return (
    a.colStart < b.colStart + b.colSpan &&
    a.colStart + a.colSpan > b.colStart &&
    a.rowStart < b.rowStart + b.rowSpan &&
    a.rowStart + a.rowSpan > b.rowStart
  );
}

function wouldOverlap(
  cells: GridCell[],
  currentId: string,
  geo: { colStart: number; rowStart: number; colSpan: number; rowSpan: number },
): boolean {
  return cells.some((c) => c.id !== currentId && cellsOverlap(c, geo));
}

// ─── UI atoms ─────────────────────────────────────────────────────────────────

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <p style={{ margin: "0 0 4px", fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{label}</p>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "12px 0" }} />;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CellEditor({ cell, cells, gridConfig, mode, brand, dispatch }: Props) {
  const t = useT();
  if (!cell) {
    return (
      <div
        style={{
          width: 280,
          flexShrink: 0,
          borderLeft: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: 24,
          color: "rgba(255,255,255,0.25)",
        }}
      >
        <span style={{ fontSize: 32 }}>✦</span>
        <p style={{ margin: 0, fontSize: 13, textAlign: "center", lineHeight: 1.5 }}>
          {mode === "free" ? t("editor.emptyFree") : t("editor.emptyTemplate")}
        </p>
      </div>
    );
  }

  const { columns, rows } = gridConfig;
  const [geoError, setGeoError] = useState<string | null>(null);

  // Clear geo error when cell selection changes
  useEffect(() => {
    setGeoError(null);
  }, [cell.id]);

  const update = (updates: Partial<Omit<GridCell, "id">>) =>
    dispatch({ type: "UPDATE_CELL", id: cell.id, updates });

  const updateContent = (content: GridCell["content"]) =>
    dispatch({ type: "UPDATE_CELL", id: cell.id, updates: { content } });

  const handleContentTypeChange = (type: CellContentType) => {
    if (type !== cell.content.type) updateContent(createDefaultContent(type));
  };

  // Safe geometry update with overlap + bounds checking
  function tryUpdateGeo(
    partial: Partial<Pick<GridCell, "colStart" | "rowStart" | "colSpan" | "rowSpan">>,
  ) {
    const next = {
      colStart: partial.colStart ?? cell.colStart,
      rowStart: partial.rowStart ?? cell.rowStart,
      colSpan: partial.colSpan ?? cell.colSpan,
      rowSpan: partial.rowSpan ?? cell.rowSpan,
    };
    if (next.colStart + next.colSpan - 1 > columns || next.rowStart + next.rowSpan - 1 > rows) {
      setGeoError(t("editor.geoErrorBounds"));
      return;
    }
    if (wouldOverlap(cells, cell.id, next)) {
      setGeoError(t("editor.geoErrorOverlap"));
      return;
    }
    setGeoError(null);
    update(next);
  }

  const { content } = cell;

  return (
    <div
      style={{
        width: 280,
        flexShrink: 0,
        borderLeft: "1px solid rgba(255,255,255,0.07)",
        overflowY: "auto",
        padding: "16px 14px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <p className="section-label" style={{ marginBottom: 0 }}>
          {t("editor.cellEditor")}
        </p>
        <button
          onClick={() => dispatch({ type: "DELETE_CELL", id: cell.id })}
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.22)",
            color: "#f87171",
            borderRadius: 6,
            padding: "3px 10px",
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          {t("editor.delete")}
        </button>
      </div>

      {/* Position & Size */}
      <section>
        <p className="section-label">{t("editor.positionAndSize")}</p>

        {geoError && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8,
              padding: "7px 10px",
              marginBottom: 10,
              fontSize: 12,
              color: "#fca5a5",
              lineHeight: 1.4,
            }}
          >
            {geoError}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Row label={t("editor.colStart")}>
            <input
              type="number"
              min={1}
              max={columns}
              value={cell.colStart}
              onChange={(e) =>
                tryUpdateGeo({ colStart: Math.max(1, Math.min(columns, +e.target.value)) })
              }
              className="input-base"
            />
          </Row>
          <Row label={t("editor.rowStart")}>
            <input
              type="number"
              min={1}
              max={rows}
              value={cell.rowStart}
              onChange={(e) =>
                tryUpdateGeo({ rowStart: Math.max(1, Math.min(rows, +e.target.value)) })
              }
              className="input-base"
            />
          </Row>
          <Row label={t("editor.colSpan")}>
            <input
              type="number"
              min={1}
              max={columns}
              value={cell.colSpan}
              onChange={(e) =>
                tryUpdateGeo({ colSpan: Math.max(1, Math.min(columns, +e.target.value)) })
              }
              className="input-base"
            />
          </Row>
          <Row label={t("editor.rowSpan")}>
            <input
              type="number"
              min={1}
              max={rows}
              value={cell.rowSpan}
              onChange={(e) =>
                tryUpdateGeo({ rowSpan: Math.max(1, Math.min(rows, +e.target.value)) })
              }
              className="input-base"
            />
          </Row>
        </div>

        {/* Move arrows */}
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 6 }}>
          <button
            className="btn-icon"
            title={t("editor.moveUp")}
            onClick={() => tryUpdateGeo({ rowStart: Math.max(1, cell.rowStart - 1) })}
          >
            ↑
          </button>
          <button
            className="btn-icon"
            title={t("editor.moveDown")}
            onClick={() => tryUpdateGeo({ rowStart: Math.min(rows, cell.rowStart + 1) })}
          >
            ↓
          </button>
          <button
            className="btn-icon"
            title={t("editor.moveLeft")}
            onClick={() => tryUpdateGeo({ colStart: Math.max(1, cell.colStart - 1) })}
          >
            ←
          </button>
          <button
            className="btn-icon"
            title={t("editor.moveRight")}
            onClick={() => tryUpdateGeo({ colStart: Math.min(columns, cell.colStart + 1) })}
          >
            →
          </button>
        </div>
      </section>

      <Divider />

      {/* Cell style overrides */}
      <section>
        <p className="section-label">{t("editor.cellStyle")}</p>
        <Row label={t("editor.background")}>
          <input
            type="text"
            placeholder={t("editor.backgroundPlaceholder")}
            value={cell.customBackground ?? ""}
            onChange={(e) => update({ customBackground: e.target.value || undefined })}
            className="input-base"
          />
        </Row>
        <Row label={t("editor.borderRadius")}>
          <input
            type="text"
            placeholder={t("editor.borderRadiusPlaceholder")}
            value={cell.customBorderRadius ?? ""}
            onChange={(e) => update({ customBorderRadius: e.target.value || undefined })}
            className="input-base"
          />
        </Row>
        <Row label={t("editor.padding")}>
          <input
            type="text"
            placeholder={t("editor.paddingPlaceholder")}
            value={cell.customPadding ?? ""}
            onChange={(e) => update({ customPadding: e.target.value || undefined })}
            className="input-base"
          />
        </Row>
      </section>

      <Divider />

      {/* Content type */}
      <section>
        <p className="section-label">{t("editor.contentType")}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
          {CONTENT_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => handleContentTypeChange(type)}
              style={{
                padding: "7px 6px",
                borderRadius: 8,
                border: `1px solid ${content.type === type ? "rgba(99,102,241,0.7)" : "rgba(255,255,255,0.08)"}`,
                background:
                  content.type === type ? "rgba(99,102,241,0.14)" : "rgba(255,255,255,0.03)",
                color: content.type === type ? "#f8fafc" : "rgba(255,255,255,0.45)",
                fontSize: 11,
                fontWeight: 500,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.12s ease",
              }}
            >
              {t(CONTENT_TYPE_TO_KEY[type] as any)}
            </button>
          ))}
        </div>
      </section>

      <Divider />

      {/* Content editor */}
      <section>
        <p className="section-label">{t("editor.content")}</p>
        {content.type === "text" && (
          <TextEditor content={content} onChange={(c) => updateContent(c)} />
        )}
        {content.type === "image" && (
          <ImageEditor content={content} onChange={(c) => updateContent(c)} />
        )}
        {content.type === "stat" && (
          <StatEditor content={content} onChange={(c) => updateContent(c)} />
        )}
        {content.type === "feature" && (
          <FeatureEditor content={content} onChange={(c) => updateContent(c)} />
        )}
        {content.type === "tagcloud" && (
          <TagCloudEditor content={content} onChange={(c) => updateContent(c)} />
        )}
        {content.type === "code" && (
          <CodeEditor content={content} onChange={(c) => updateContent(c)} />
        )}
        {content.type === "banner" && (
          <BannerEditor content={content} onChange={(c) => updateContent(c)} brand={brand} />
        )}
      </section>
    </div>
  );
}

// ─── Content sub-editors ──────────────────────────────────────────────────────

function TextEditor({
  content,
  onChange,
}: {
  content: TextContent;
  onChange: (c: TextContent) => void;
}) {
  const t = useT();
  return (
    <>
      <Row label={t("editor.heading")}>
        <input
          type="text"
          value={content.heading}
          onChange={(e) => onChange({ ...content, heading: e.target.value })}
          className="input-base"
        />
      </Row>
      <Row label={t("editor.subheading")}>
        <input
          type="text"
          value={content.subheading}
          onChange={(e) => onChange({ ...content, subheading: e.target.value })}
          className="input-base"
        />
      </Row>
      <Row label={t("editor.body")}>
        <textarea
          value={content.body}
          onChange={(e) => onChange({ ...content, body: e.target.value })}
          className="input-base"
          rows={3}
          style={{ resize: "vertical" }}
        />
      </Row>
      <Row label={t("editor.headingSize")}>
        <select
          className="input-base"
          value={content.headingSize}
          onChange={(e) => onChange({ ...content, headingSize: e.target.value as HeadingSize })}
        >
          {(["sm", "md", "lg", "xl", "2xl"] as HeadingSize[]).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Row>
      <Row label={t("editor.alignment")}>
        <div style={{ display: "flex", gap: 4 }}>
          {(["left", "center", "right"] as TextAlign[]).map((a) => (
            <button
              key={a}
              onClick={() => onChange({ ...content, align: a })}
              style={{
                flex: 1,
                padding: "5px 0",
                borderRadius: 6,
                fontSize: 12,
                cursor: "pointer",
                border: `1px solid ${content.align === a ? "rgba(99,102,241,0.7)" : "rgba(255,255,255,0.1)"}`,
                background: content.align === a ? "rgba(99,102,241,0.15)" : "transparent",
                color: content.align === a ? "#f8fafc" : "rgba(255,255,255,0.4)",
              }}
            >
              {a === "left" ? "L" : a === "center" ? "C" : "R"}
            </button>
          ))}
        </div>
      </Row>
    </>
  );
}

function ImageEditor({
  content,
  onChange,
}: {
  content: ImageContent;
  onChange: (c: ImageContent) => void;
}) {
  const t = useT();
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string") onChange({ ...content, src: ev.target.result });
    };
    reader.readAsDataURL(file);
  };
  return (
    <>
      <Row label={t("editor.imageUrl")}>
        <input
          type="text"
          value={content.src}
          onChange={(e) => onChange({ ...content, src: e.target.value })}
          className="input-base"
          placeholder={t("editor.imageUrlPlaceholder")}
        />
      </Row>
      <Row label={t("editor.orUpload")}>
        <label
          className="btn-ghost"
          style={{ cursor: "pointer", display: "inline-block", fontSize: 12 }}
        >
          {t("editor.chooseFile")}
          <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
        </label>
      </Row>
      <Row label={t("editor.altText")}>
        <input
          type="text"
          value={content.alt}
          onChange={(e) => onChange({ ...content, alt: e.target.value })}
          className="input-base"
        />
      </Row>
      <Row label={t("editor.objectFit")}>
        <select
          className="input-base"
          value={content.fit}
          onChange={(e) => onChange({ ...content, fit: e.target.value as ImageFit })}
        >
          {(["cover", "contain", "fill"] as ImageFit[]).map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </Row>
      <Row label={t("editor.position")}>
        <select
          className="input-base"
          value={content.position}
          onChange={(e) => onChange({ ...content, position: e.target.value })}
        >
          {["center center", "top center", "bottom center", "center left", "center right"].map(
            (p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ),
          )}
        </select>
      </Row>
    </>
  );
}

function StatEditor({
  content,
  onChange,
}: {
  content: StatContent;
  onChange: (c: StatContent) => void;
}) {
  const t = useT();
  return (
    <>
      <Row label={t("editor.label")}>
        <input
          type="text"
          value={content.label}
          onChange={(e) => onChange({ ...content, label: e.target.value })}
          className="input-base"
        />
      </Row>
      <Row label={t("editor.value")}>
        <input
          type="text"
          value={content.value}
          onChange={(e) => onChange({ ...content, value: e.target.value })}
          className="input-base"
        />
      </Row>
      <Row label={t("editor.trend")}>
        <input
          type="text"
          value={content.trend}
          onChange={(e) => onChange({ ...content, trend: e.target.value })}
          className="input-base"
        />
      </Row>
      <Row label={t("editor.direction")}>
        <div style={{ display: "flex", gap: 4 }}>
          {(["up", "down", "neutral"] as TrendDirection[]).map((d) => (
            <button
              key={d}
              onClick={() => onChange({ ...content, trendDirection: d })}
              style={{
                flex: 1,
                padding: "5px 0",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 12,
                border: `1px solid ${content.trendDirection === d ? "rgba(99,102,241,0.7)" : "rgba(255,255,255,0.1)"}`,
                background: content.trendDirection === d ? "rgba(99,102,241,0.15)" : "transparent",
                color: content.trendDirection === d ? "#f8fafc" : "rgba(255,255,255,0.4)",
              }}
            >
              {d === "up" ? t("editor.up") : d === "down" ? t("editor.down") : t("editor.flat")}
            </button>
          ))}
        </div>
      </Row>
    </>
  );
}

function FeatureEditor({
  content,
  onChange,
}: {
  content: FeatureContent;
  onChange: (c: FeatureContent) => void;
}) {
  const t = useT();
  return (
    <>
      <Row label={t("editor.iconEmoji")}>
        <input
          type="text"
          value={content.icon}
          onChange={(e) => onChange({ ...content, icon: e.target.value })}
          className="input-base"
        />
      </Row>
      <Row label={t("editor.title")}>
        <input
          type="text"
          value={content.title}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          className="input-base"
        />
      </Row>
      <Row label={t("editor.description")}>
        <textarea
          value={content.description}
          onChange={(e) => onChange({ ...content, description: e.target.value })}
          className="input-base"
          rows={3}
          style={{ resize: "vertical" }}
        />
      </Row>
    </>
  );
}

function TagCloudEditor({
  content,
  onChange,
}: {
  content: TagCloudContent;
  onChange: (c: TagCloudContent) => void;
}) {
  const t = useT();
  const addTag = () => onChange({ ...content, tags: [...content.tags, "Tag"] });
  const removeTag = (i: number) =>
    onChange({ ...content, tags: content.tags.filter((_, idx) => idx !== i) });
  const editTag = (i: number, v: string) =>
    onChange({ ...content, tags: content.tags.map((t, idx) => (idx === i ? v : t)) });
  return (
    <>
      {content.tags.map((tag, i) => (
        <div key={i} style={{ display: "flex", gap: 4, marginBottom: 4 }}>
          <input
            type="text"
            value={tag}
            onChange={(e) => editTag(i, e.target.value)}
            className="input-base"
          />
          <button
            onClick={() => removeTag(i)}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(239,68,68,0.7)",
              cursor: "pointer",
              fontSize: 16,
              padding: "0 4px",
            }}
          >
            ✕
          </button>
        </div>
      ))}
      <button className="btn-ghost" style={{ fontSize: 12, marginTop: 4 }} onClick={addTag}>
        {t("editor.addTag")}
      </button>
    </>
  );
}

function CodeEditor({
  content,
  onChange,
}: {
  content: CodeContent;
  onChange: (c: CodeContent) => void;
}) {
  const t = useT();
  return (
    <>
      <Row label={t("editor.language")}>
        <select
          className="input-base"
          value={content.language}
          onChange={(e) => onChange({ ...content, language: e.target.value })}
        >
          {["ts", "tsx", "js", "jsx", "css", "html", "bash", "json", "python", "rust"].map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </Row>
      <Row label={t("editor.code")}>
        <textarea
          value={content.code}
          onChange={(e) => onChange({ ...content, code: e.target.value })}
          className="input-base"
          rows={8}
          style={{
            resize: "vertical",
            fontFamily: "ui-monospace, Consolas, monospace",
            fontSize: 12,
          }}
          spellCheck={false}
        />
      </Row>
    </>
  );
}

function BannerEditor({
  content,
  onChange,
  brand,
}: {
  content: BannerContent;
  onChange: (c: BannerContent) => void;
  brand: BrandTokens;
}) {
  const t = useT();
  return (
    <>
      <Row label={t("editor.title")}>
        <input
          type="text"
          value={content.title}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          className="input-base"
        />
      </Row>
      <Row label={t("editor.subtitle")}>
        <input
          type="text"
          value={content.subtitle}
          onChange={(e) => onChange({ ...content, subtitle: e.target.value })}
          className="input-base"
        />
      </Row>
      <Row label={t("editor.gradientFrom")}>
        <div style={{ display: "flex", gap: 6 }}>
          <input
            type="color"
            value={content.gradientFrom}
            onChange={(e) => onChange({ ...content, gradientFrom: e.target.value })}
            style={{
              width: 34,
              height: 34,
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.15)",
              cursor: "pointer",
              padding: 2,
              background: "transparent",
            }}
          />
          <input
            type="text"
            value={content.gradientFrom}
            onChange={(e) => onChange({ ...content, gradientFrom: e.target.value })}
            className="input-base"
            style={{ fontFamily: "ui-monospace, monospace", fontSize: 12 }}
          />
        </div>
      </Row>
      <Row label={t("editor.gradientTo")}>
        <div style={{ display: "flex", gap: 6 }}>
          <input
            type="color"
            value={content.gradientTo}
            onChange={(e) => onChange({ ...content, gradientTo: e.target.value })}
            style={{
              width: 34,
              height: 34,
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.15)",
              cursor: "pointer",
              padding: 2,
              background: "transparent",
            }}
          />
          <input
            type="text"
            value={content.gradientTo}
            onChange={(e) => onChange({ ...content, gradientTo: e.target.value })}
            className="input-base"
            style={{ fontFamily: "ui-monospace, monospace", fontSize: 12 }}
          />
        </div>
      </Row>
      <Row label={t("editor.angle")}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="range"
            min={0}
            max={360}
            value={content.gradientAngle}
            onChange={(e) => onChange({ ...content, gradientAngle: +e.target.value })}
            style={{ flex: 1, accentColor: "#6366f1" }}
          />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", minWidth: 32 }}>
            {content.gradientAngle}°
          </span>
        </div>
      </Row>
      <Row label={t("editor.textAlign")}>
        <div style={{ display: "flex", gap: 4 }}>
          {(["left", "center", "right"] as TextAlign[]).map((a) => (
            <button
              key={a}
              onClick={() => onChange({ ...content, textAlign: a })}
              style={{
                flex: 1,
                padding: "5px 0",
                borderRadius: 6,
                fontSize: 12,
                cursor: "pointer",
                border: `1px solid ${content.textAlign === a ? "rgba(99,102,241,0.7)" : "rgba(255,255,255,0.1)"}`,
                background: content.textAlign === a ? "rgba(99,102,241,0.15)" : "transparent",
                color: content.textAlign === a ? "#f8fafc" : "rgba(255,255,255,0.4)",
              }}
            >
              {a === "left" ? "L" : a === "center" ? "C" : "R"}
            </button>
          ))}
        </div>
      </Row>
      <Row label={t("editor.logoPosition")}>
        <div style={{ display: "flex", gap: 4 }}>
          {(["left", "center", "right"] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => onChange({ ...content, logoPosition: pos })}
              style={{
                flex: 1,
                padding: "5px 0",
                borderRadius: 6,
                fontSize: 11,
                cursor: "pointer",
                textTransform: "capitalize",
                border: `1px solid ${content.logoPosition === pos ? "rgba(99,102,241,0.7)" : "rgba(255,255,255,0.1)"}`,
                background: content.logoPosition === pos ? "rgba(99,102,241,0.15)" : "transparent",
                color: content.logoPosition === pos ? "#f8fafc" : "rgba(255,255,255,0.4)",
              }}
            >
              {pos}
            </button>
          ))}
        </div>
      </Row>
      <Row label={t("editor.showLogo")}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={content.showLogo}
            onChange={(e) => onChange({ ...content, showLogo: e.target.checked })}
            style={{ accentColor: "#6366f1", width: 14, height: 14 }}
          />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
            {brand.logo ? t("editor.displayBrandLogo") : t("editor.noLogoSet")}
          </span>
        </label>
      </Row>
    </>
  );
}

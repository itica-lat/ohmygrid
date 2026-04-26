export type GridMode = "template" | "free";
export type ExportTab = "react" | "html";
export type TextAlign = "left" | "center" | "right";
export type HeadingSize = "sm" | "md" | "lg" | "xl" | "2xl";
export type ImageFit = "cover" | "contain" | "fill";
export type TrendDirection = "up" | "down" | "neutral";
export type BorderRadiusScale = "sharp" | "soft" | "pill";
export type SpacingScale = "compact" | "default" | "relaxed";

export interface TextContent {
  type: "text";
  heading: string;
  subheading: string;
  body: string;
  align: TextAlign;
  headingSize: HeadingSize;
}

export interface ImageContent {
  type: "image";
  src: string;
  alt: string;
  fit: ImageFit;
  position: string;
}

export interface StatContent {
  type: "stat";
  label: string;
  value: string;
  trend: string;
  trendDirection: TrendDirection;
}

export interface FeatureContent {
  type: "feature";
  icon: string;
  title: string;
  description: string;
}

export interface TagCloudContent {
  type: "tagcloud";
  tags: string[];
}

export interface CodeContent {
  type: "code";
  language: string;
  code: string;
}

export interface BannerContent {
  type: "banner";
  title: string;
  subtitle: string;
  showLogo: boolean;
  logoPosition: "left" | "center" | "right";
  gradientFrom: string;
  gradientTo: string;
  gradientAngle: number;
  textAlign: TextAlign;
}

export type CellContent =
  | TextContent
  | ImageContent
  | StatContent
  | FeatureContent
  | TagCloudContent
  | CodeContent
  | BannerContent;

export type CellContentType = CellContent["type"];

export interface GridCell {
  id: string;
  colStart: number;
  rowStart: number;
  colSpan: number;
  rowSpan: number;
  content: CellContent;
  customBackground?: string;
  customBorderRadius?: string;
  customPadding?: string;
}

export interface BrandTokens {
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  colorBackground: string;
  colorSurface: string;
  colorText: string;
  fontFamily: string;
  fontBaseSize: number;
  fontRatio: number;
  borderRadiusScale: BorderRadiusScale;
  spacingScale: SpacingScale;
  logo: string;
  customFontUrl: string;
}

export interface SavedTemplate {
  id: string;
  name: string;
  createdAt: number;
  gridConfig: GridConfig;
  cells: GridCell[];
  brand: BrandTokens;
}

export interface SavedBrand {
  id: string;
  name: string;
  createdAt: number;
  brand: BrandTokens;
}

export interface GridConfig {
  columns: number;
  rows: number;
  gap: number;
  padding: number;
}

export interface GridTemplate {
  id: string;
  name: string;
  description: string;
  cells: Omit<GridCell, "id">[];
  config: GridConfig;
}

export interface EditorState {
  mode: GridMode;
  gridConfig: GridConfig;
  cells: GridCell[];
  selectedCellId: string | null;
  brand: BrandTokens;
  isExportModalOpen: boolean;
  exportTab: ExportTab;
  activeTemplateId: string | null;
}

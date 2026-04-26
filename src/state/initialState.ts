import type { EditorState, BrandTokens, GridConfig, GridCell, CellContent } from "../types";

export const DEFAULT_BRAND: BrandTokens = {
  colorPrimary: "#6366f1",
  colorSecondary: "#8b5cf6",
  colorAccent: "#06b6d4",
  colorBackground: "#0a0a0f",
  colorSurface: "#1a1a2e",
  colorText: "#f8fafc",
  fontFamily: "system-ui",
  fontBaseSize: 16,
  fontRatio: 1.25,
  borderRadiusScale: "soft",
  spacingScale: "default",
  logo: "",
  customFontUrl: "",
};

export const DEFAULT_GRID_CONFIG: GridConfig = {
  columns: 4,
  rows: 3,
  gap: 16,
  padding: 24,
};

let _idCounter = 1;
export function newId(): string {
  return `cell-${Date.now()}-${_idCounter++}`;
}

export function createDefaultContent(type: CellContent["type"]): CellContent {
  switch (type) {
    case "text":
      return {
        type: "text",
        heading: "Heading",
        subheading: "Subheading",
        body: "Your description goes here.",
        align: "left",
        headingSize: "lg",
      };
    case "image":
      return {
        type: "image",
        src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop",
        alt: "Image",
        fit: "cover",
        position: "center center",
      };
    case "stat":
      return {
        type: "stat",
        label: "Total Users",
        value: "12,400",
        trend: "+8.2%",
        trendDirection: "up",
      };
    case "feature":
      return {
        type: "feature",
        icon: "⚡",
        title: "Blazing Fast",
        description: "Built for performance with a modern stack.",
      };
    case "tagcloud":
      return {
        type: "tagcloud",
        tags: ["React", "TypeScript", "Vite", "TailwindCSS", "Design", "Systems"],
      };
    case "code":
      return {
        type: "code",
        language: "tsx",
        code: `function Hello() {\n  return <h1>Hello, world!</h1>;\n}`,
      };
    case "banner":
      return {
        type: "banner",
        title: "Your Brand",
        subtitle: "Tagline or description",
        showLogo: true,
        logoPosition: "left",
        gradientFrom: "#6366f1",
        gradientTo: "#06b6d4",
        gradientAngle: 135,
        textAlign: "left",
      };
  }
}

export const INITIAL_CELLS: GridCell[] = [
  {
    id: "c1",
    colStart: 1,
    rowStart: 1,
    colSpan: 2,
    rowSpan: 2,
    content: {
      type: "text",
      heading: "Design your grid",
      subheading: "Apple-style bento layouts",
      body: "A visual editor for beautiful CSS Grid compositions. Add cells, choose content, customize your brand.",
      align: "left",
      headingSize: "xl",
    },
  },
  {
    id: "c2",
    colStart: 3,
    rowStart: 1,
    colSpan: 1,
    rowSpan: 1,
    content: {
      type: "stat",
      label: "Components",
      value: "6",
      trend: "+100%",
      trendDirection: "up",
    },
  },
  {
    id: "c3",
    colStart: 4,
    rowStart: 1,
    colSpan: 1,
    rowSpan: 1,
    content: {
      type: "stat",
      label: "Export Formats",
      value: "2",
      trend: "React & HTML",
      trendDirection: "neutral",
    },
  },
  {
    id: "c4",
    colStart: 3,
    rowStart: 2,
    colSpan: 2,
    rowSpan: 1,
    content: {
      type: "feature",
      icon: "🎨",
      title: "Brand System",
      description: "Full design token control — colors, typography, spacing, and radii.",
    },
  },
  {
    id: "c5",
    colStart: 1,
    rowStart: 3,
    colSpan: 2,
    rowSpan: 1,
    content: {
      type: "tagcloud",
      tags: ["React 19", "TypeScript", "TailwindCSS v4", "Vite", "CSS Grid", "Glass UI"],
    },
  },
  {
    id: "c6",
    colStart: 3,
    rowStart: 3,
    colSpan: 2,
    rowSpan: 1,
    content: {
      type: "code",
      language: "tsx",
      code: `<BentoGrid cols={4} gap={16}>\n  <Cell span={[2,2]}>\n    <HeroText />\n  </Cell>\n</BentoGrid>`,
    },
  },
];

export const BLANK_STATE: EditorState = {
  mode: "free",
  gridConfig: DEFAULT_GRID_CONFIG,
  cells: [],
  selectedCellId: null,
  brand: DEFAULT_BRAND,
  isExportModalOpen: false,
  exportTab: "react",
  activeTemplateId: null,
};

export const INITIAL_STATE: EditorState = {
  mode: "free",
  gridConfig: DEFAULT_GRID_CONFIG,
  cells: INITIAL_CELLS,
  selectedCellId: null,
  brand: DEFAULT_BRAND,
  isExportModalOpen: false,
  exportTab: "react",
  activeTemplateId: null,
};

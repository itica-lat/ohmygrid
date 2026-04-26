import type { SavedTemplate, SavedBrand, BrandTokens, GridCell, GridConfig } from "../types";

const TEMPLATES_KEY = "ohmygrid-user-templates-v1";
const BRANDS_KEY = "ohmygrid-user-brands-v1";

// ─── Templates ────────────────────────────────────────────────────────────────

export function loadSavedTemplates(): SavedTemplate[] {
  try {
    const raw = localStorage.getItem(TEMPLATES_KEY);
    return raw ? (JSON.parse(raw) as SavedTemplate[]) : [];
  } catch {
    return [];
  }
}

export function saveTemplate(
  name: string,
  gridConfig: GridConfig,
  cells: GridCell[],
  brand: BrandTokens,
): SavedTemplate {
  const tpl: SavedTemplate = {
    id: `ut-${Date.now()}`,
    name,
    createdAt: Date.now(),
    gridConfig,
    cells,
    brand,
  };
  const existing = loadSavedTemplates();
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify([tpl, ...existing]));
  return tpl;
}

export function deleteSavedTemplate(id: string): void {
  const existing = loadSavedTemplates().filter((t) => t.id !== id);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(existing));
}

// ─── Brands ───────────────────────────────────────────────────────────────────

export function loadSavedBrands(): SavedBrand[] {
  try {
    const raw = localStorage.getItem(BRANDS_KEY);
    return raw ? (JSON.parse(raw) as SavedBrand[]) : [];
  } catch {
    return [];
  }
}

export function saveBrand(name: string, brand: BrandTokens): SavedBrand {
  const entry: SavedBrand = {
    id: `ub-${Date.now()}`,
    name,
    createdAt: Date.now(),
    brand,
  };
  const existing = loadSavedBrands();
  localStorage.setItem(BRANDS_KEY, JSON.stringify([entry, ...existing]));
  return entry;
}

export function deleteSavedBrand(id: string): void {
  const existing = loadSavedBrands().filter((b) => b.id !== id);
  localStorage.setItem(BRANDS_KEY, JSON.stringify(existing));
}

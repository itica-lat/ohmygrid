export const translations = {
  en: {
    // TopBar
    "topbar.free": "Free",
    "topbar.template": "Template",
    "topbar.builtinTemplates": "Built-in templates…",
    "topbar.cols": "Cols",
    "topbar.rows": "Rows",
    "topbar.gap": "Gap",
    "topbar.cellCount": "{count} cell",
    "topbar.cellCount_plural": "{count} cells",
    "topbar.templateNamePlaceholder": "Template name…",
    "topbar.save": "Save",
    "topbar.cancel": "Cancel",
    "topbar.saveLayout": "Save Layout",
    "topbar.templates": "Templates",
    "topbar.import": "Import",
    "topbar.reset": "Reset",
    "topbar.example": "Example",
    "topbar.export": "Export",

    // Canvas
    "canvas.emptyHint": "Drag on the grid to add a cell",

    // CellEditor
    "editor.cellEditor": "Cell Editor",
    "editor.delete": "Delete",
    "editor.positionAndSize": "Position & Size",
    "editor.geoErrorBounds": "Cell extends beyond the grid bounds.",
    "editor.geoErrorOverlap": "This position overlaps another cell.",
    "editor.colStart": "Col Start",
    "editor.rowStart": "Row Start",
    "editor.colSpan": "Col Span",
    "editor.rowSpan": "Row Span",
    "editor.moveUp": "Move up",
    "editor.moveDown": "Move down",
    "editor.moveLeft": "Move left",
    "editor.moveRight": "Move right",
    "editor.cellStyle": "Cell Style",
    "editor.background": "Background",
    "editor.backgroundPlaceholder": "e.g. rgba(99,102,241,0.1)",
    "editor.borderRadius": "Border Radius",
    "editor.borderRadiusPlaceholder": "e.g. 24px",
    "editor.padding": "Padding",
    "editor.paddingPlaceholder": "e.g. 24px",
    "editor.contentType": "Content Type",
    "editor.content": "Content",
    "editor.emptyFree": "Drag on the canvas to create a cell, then click to select it.",
    "editor.emptyTemplate": "Click a cell on the canvas to edit it.",

    // Content type labels
    "editor.textBlock": "Text Block",
    "editor.image": "Image",
    "editor.statCard": "Stat Card",
    "editor.featureCard": "Feature Card",
    "editor.tagCloud": "Tag Cloud",
    "editor.codeSnippet": "Code Snippet",
    "editor.bannerLogo": "Banner / Logo",

    // TextEditor
    "editor.heading": "Heading",
    "editor.subheading": "Subheading",
    "editor.body": "Body",
    "editor.headingSize": "Heading Size",
    "editor.alignment": "Alignment",

    // ImageEditor
    "editor.imageUrl": "Image URL",
    "editor.imageUrlPlaceholder": "https://…",
    "editor.orUpload": "Or upload",
    "editor.chooseFile": "Choose File",
    "editor.altText": "Alt Text",
    "editor.objectFit": "Object Fit",
    "editor.position": "Position",

    // StatEditor
    "editor.label": "Label",
    "editor.value": "Value",
    "editor.trend": "Trend",
    "editor.direction": "Direction",
    "editor.up": "↑ Up",
    "editor.down": "↓ Down",
    "editor.flat": "→ Flat",

    // FeatureEditor
    "editor.iconEmoji": "Icon (emoji)",
    "editor.title": "Title",
    "editor.description": "Description",

    // TagCloudEditor
    "editor.addTag": "+ Add Tag",

    // CodeEditor
    "editor.language": "Language",
    "editor.code": "Code",

    // BannerEditor
    "editor.subtitle": "Subtitle",
    "editor.gradientFrom": "Gradient From",
    "editor.gradientTo": "Gradient To",
    "editor.angle": "Angle",
    "editor.textAlign": "Text Align",
    "editor.logoPosition": "Logo Position",
    "editor.showLogo": "Show Logo",
    "editor.displayBrandLogo": "Display brand logo",
    "editor.noLogoSet": "No logo set — upload one in Brand panel",

    // BrandPanel
    "brand.brandTokens": "Brand Tokens",
    "brand.realtimeHint": "All changes update the canvas in real time.",
    "brand.colors": "Colors",
    "brand.primary": "Primary",
    "brand.secondary": "Secondary",
    "brand.accent": "Accent",
    "brand.background": "Background",
    "brand.surface": "Surface",
    "brand.text": "Text",
    "brand.brandPresets": "Brand Presets",
    "brand.noSavedPresets": "No saved presets yet.",
    "brand.presetNamePlaceholder": "Preset name…",
    "brand.save": "Save",
    "brand.saveCurrentBrand": "Save Current Brand",
    "brand.apply": "Apply",
    "brand.typography": "Typography",
    "brand.fontFamily": "Font Family",
    "brand.baseSizePx": "Base Size (px)",
    "brand.typeRatio": "Type Ratio",
    "brand.headingPreview": "Heading Preview",
    "brand.customGoogleFontUrl": "Custom Google Font URL",
    "brand.googleFontHelp":
      "Paste a Google Fonts CSS URL. The family name is auto-detected and applied.",
    "brand.borderRadius": "Border Radius",
    "brand.spacingScale": "Spacing Scale",
    "brand.logo": "Logo",
    "brand.remove": "Remove",
    "brand.replaceLogo": "Replace Logo",
    "brand.uploadLogo": "Upload Logo",
    "brand.rawCssVariables": "Raw CSS Variables",

    // ExportModal
    "export.title": "Export Code",
    "export.reactTab": "⚛ React TSX",
    "export.htmlTab": "🌐 HTML/CSS",
    "export.copy": "Copy",
    "export.copied": "✓ Copied!",
    "export.download": "↓ Download",
    "export.reactInfo":
      "Self-contained TSX component with brand tokens as CSS variables. Paste into any React project.",
    "export.htmlInfo":
      "Standalone HTML file with embedded styles. No dependencies required — open in any browser.",

    // ImportModal
    "import.title": "Import Layout",
    "import.instruction":
      "Drop or select an exported <strong>.tsx</strong> or <strong>.html</strong> file from ohmygrid.",
    "import.dropZone": "Click or drag & drop a file here",
    "import.parseError":
      "Could not parse file. Make sure this is an ohmygrid export (.tsx or .html).",
    "import.unexpectedError": "An unexpected error occurred while parsing the file.",
    "import.ready": "Ready to import",
    "import.instruction.before": "Drop or select an exported",
    "import.instruction.or": "or",
    "import.instruction.after": "file from ohmygrid.",
    "import.cells": "Cells",
    "import.columns": "Columns",
    "import.rows": "Rows",
    "import.brand": "Brand",
    "import.included": "included",
    "import.cancel": "Cancel",
    "import.importLayout": "Import Layout",

    // TemplatesModal
    "templates.title": "Templates",
    "templates.savedLayouts": "Saved Layouts",
    "templates.builtin": "Built-in",
    "templates.load": "Load",
    "templates.delete": "Delete",
    "templates.rowInfo": "{columns}×{rows} · {count} cell",
    "templates.rowInfo_plural": "{columns}×{rows} · {count} cells",
    "templates.cellSingular": "cell",
    "templates.cellPlural": "cells",

    // ImageCell
    "image.noSource": "No image source",
  },

  es: {
    // TopBar
    "topbar.free": "Libre",
    "topbar.template": "Plantilla",
    "topbar.builtinTemplates": "Plantillas incorporadas…",
    "topbar.cols": "Cols",
    "topbar.rows": "Filas",
    "topbar.gap": "Espacio",
    "topbar.cellCount": "{count} celda",
    "topbar.cellCount_plural": "{count} celdas",
    "topbar.templateNamePlaceholder": "Nombre de plantilla…",
    "topbar.save": "Guardar",
    "topbar.cancel": "Cancelar",
    "topbar.saveLayout": "Guardar diseño",
    "topbar.templates": "Plantillas",
    "topbar.import": "Importar",
    "topbar.reset": "Restablecer",
    "topbar.example": "Ejemplo",
    "topbar.export": "Exportar",

    // Canvas
    "canvas.emptyHint": "Arrastra en la cuadrícula para añadir una celda",

    // CellEditor
    "editor.cellEditor": "Editor de celda",
    "editor.delete": "Eliminar",
    "editor.positionAndSize": "Posición y tamaño",
    "editor.geoErrorBounds": "La celda se extiende más allá de los límites de la cuadrícula.",
    "editor.geoErrorOverlap": "Esta posición se superpone con otra celda.",
    "editor.colStart": "Col Inicio",
    "editor.rowStart": "Fila Inicio",
    "editor.colSpan": "Col Ext.",
    "editor.rowSpan": "Fila Ext.",
    "editor.moveUp": "Mover arriba",
    "editor.moveDown": "Mover abajo",
    "editor.moveLeft": "Mover izquierda",
    "editor.moveRight": "Mover derecha",
    "editor.cellStyle": "Estilo de celda",
    "editor.background": "Fondo",
    "editor.backgroundPlaceholder": "ej. rgba(99,102,241,0.1)",
    "editor.borderRadius": "Radio de borde",
    "editor.borderRadiusPlaceholder": "ej. 24px",
    "editor.padding": "Relleno",
    "editor.paddingPlaceholder": "ej. 24px",
    "editor.contentType": "Tipo de contenido",
    "editor.content": "Contenido",
    "editor.emptyFree":
      "Arrastra en el lienzo para crear una celda, luego haz clic para seleccionarla.",
    "editor.emptyTemplate": "Haz clic en una celda del lienzo para editarla.",

    // Content type labels
    "editor.textBlock": "Bloque de texto",
    "editor.image": "Imagen",
    "editor.statCard": "Tarjeta de estadística",
    "editor.featureCard": "Tarjeta de característica",
    "editor.tagCloud": "Nube de etiquetas",
    "editor.codeSnippet": "Fragmento de código",
    "editor.bannerLogo": "Banner / Logo",

    // TextEditor
    "editor.heading": "Título",
    "editor.subheading": "Subtítulo",
    "editor.body": "Cuerpo",
    "editor.headingSize": "Tamaño de título",
    "editor.alignment": "Alineación",

    // ImageEditor
    "editor.imageUrl": "URL de imagen",
    "editor.imageUrlPlaceholder": "https://…",
    "editor.orUpload": "O subir",
    "editor.chooseFile": "Elegir archivo",
    "editor.altText": "Texto alternativo",
    "editor.objectFit": "Ajuste de objeto",
    "editor.position": "Posición",

    // StatEditor
    "editor.label": "Etiqueta",
    "editor.value": "Valor",
    "editor.trend": "Tendencia",
    "editor.direction": "Dirección",
    "editor.up": "↑ Sube",
    "editor.down": "↓ Baja",
    "editor.flat": "→ Estable",

    // FeatureEditor
    "editor.iconEmoji": "Icono (emoticono)",
    "editor.title": "Título",
    "editor.description": "Descripción",

    // TagCloudEditor
    "editor.addTag": "+ Añadir etiqueta",

    // CodeEditor
    "editor.language": "Lenguaje",
    "editor.code": "Código",

    // BannerEditor
    "editor.subtitle": "Subtítulo",
    "editor.gradientFrom": "Degradado desde",
    "editor.gradientTo": "Degradado hasta",
    "editor.angle": "Ángulo",
    "editor.textAlign": "Alineación de texto",
    "editor.logoPosition": "Posición del logo",
    "editor.showLogo": "Mostrar logo",
    "editor.displayBrandLogo": "Mostrar logo de marca",
    "editor.noLogoSet": "No hay logo configurado — súbelo en el panel de Marca",

    // BrandPanel
    "brand.brandTokens": "Tokens de marca",
    "brand.realtimeHint": "Todos los cambios actualizan el lienzo en tiempo real.",
    "brand.colors": "Colores",
    "brand.primary": "Primario",
    "brand.secondary": "Secundario",
    "brand.accent": "Acento",
    "brand.background": "Fondo",
    "brand.surface": "Superficie",
    "brand.text": "Texto",
    "brand.brandPresets": "Presets de marca",
    "brand.noSavedPresets": "Aún no hay presets guardados.",
    "brand.presetNamePlaceholder": "Nombre del preset…",
    "brand.save": "Guardar",
    "brand.saveCurrentBrand": "Guardar marca actual",
    "brand.apply": "Aplicar",
    "brand.typography": "Tipografía",
    "brand.fontFamily": "Fuente",
    "brand.baseSizePx": "Tamaño base (px)",
    "brand.typeRatio": "Proporción",
    "brand.headingPreview": "Vista previa de título",
    "brand.customGoogleFontUrl": "URL de Google Fonts personalizada",
    "brand.googleFontHelp":
      "Pega una URL CSS de Google Fonts. El nombre de la fuente se detecta automáticamente.",
    "brand.borderRadius": "Radio de borde",
    "brand.spacingScale": "Escala de espaciado",
    "brand.logo": "Logo",
    "brand.remove": "Eliminar",
    "brand.replaceLogo": "Reemplazar logo",
    "brand.uploadLogo": "Subir logo",
    "brand.rawCssVariables": "Variables CSS brutas",

    // ExportModal
    "export.title": "Exportar código",
    "export.reactTab": "⚛ React TSX",
    "export.htmlTab": "🌐 HTML/CSS",
    "export.copy": "Copiar",
    "export.copied": "✓ ¡Copiado!",
    "export.download": "↓ Descargar",
    "export.reactInfo":
      "Componente TSX autónomo con tokens de marca como variables CSS. Pégalo en cualquier proyecto React.",
    "export.htmlInfo":
      "Archivo HTML independiente con estilos incrustados. Sin dependencias — ábrelo en cualquier navegador.",

    // ImportModal
    "import.title": "Importar diseño",
    "import.instruction":
      "Arrastra o selecciona un archivo <strong>.tsx</strong> o <strong>.html</strong> exportado de ohmygrid.",
    "import.dropZone": "Haz clic o arrastra un archivo aquí",
    "import.parseError":
      "No se pudo analizar el archivo. Asegúrate de que sea una exportación de ohmygrid (.tsx o .html).",
    "import.unexpectedError": "Ocurrió un error inesperado al analizar el archivo.",
    "import.ready": "Listo para importar",
    "import.instruction.before": "Arrastra o selecciona un archivo",
    "import.instruction.or": "o",
    "import.instruction.after": "exportado de ohmygrid.",
    "import.cells": "Celdas",
    "import.columns": "Columnas",
    "import.rows": "Filas",
    "import.brand": "Marca",
    "import.included": "incluida",
    "import.cancel": "Cancelar",
    "import.importLayout": "Importar diseño",

    // TemplatesModal
    "templates.title": "Plantillas",
    "templates.savedLayouts": "Diseños guardados",
    "templates.builtin": "Incorporadas",
    "templates.load": "Cargar",
    "templates.delete": "Eliminar",
    "templates.rowInfo": "{columns}×{rows} · {count} celda",
    "templates.rowInfo_plural": "{columns}×{rows} · {count} celdas",
    "templates.cellSingular": "celda",
    "templates.cellPlural": "celdas",

    // ImageCell
    "image.noSource": "Sin origen de imagen",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

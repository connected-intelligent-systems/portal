import type { PaletteOptions, SxProps } from "@mui/material";
import type { Theme, ThemeOptions } from "@mui/material/styles";

export type ThemeLogoConfig = {
  src: string;
  alt?: string;
  sx?: SxProps<Theme>;
};

export type ThemeModeOverrides = {
  palette?: PaletteOptions;
  typography?: ThemeOptions["typography"];
  spacing?: number;
  shape?: ThemeOptions["shape"];
  sidebarWidth?: number;
  logo?: ThemeLogoConfig;
};

export type ThemeConfig = {
  light?: ThemeModeOverrides;
  dark?: ThemeModeOverrides;
};

export type CategoryTranslations = {
  en: string;
  de: string;
};

export type CategoryConfig = {
  id: string;
  translations: CategoryTranslations;
};

export type MediaTypeConfig = {
  id: string;
  translations: CategoryTranslations;
};

export type AppConfig = {
  title: string;
  theme?: ThemeConfig;
  publicEdcEndpoint?: string;
  categories?: CategoryConfig[];
  mediaTypes?: MediaTypeConfig[];
};

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    config: AppConfig;
  }
}

export const DEFAULT_CATEGORIES: CategoryConfig[] = [
  {
    id: "IoTData",
    translations: {
      en: "IoT & Sensor Data",
      de: "IoT- & Sensordaten",
    },
  },
  {
    id: "TimeSeries",
    translations: {
      en: "Time Series",
      de: "Zeitreihen",
    },
  },
  {
    id: "APIService",
    translations: {
      en: "API & Services",
      de: "API & Dienste",
    },
  },
  {
    id: "MachineLearning",
    translations: {
      en: "Machine Learning & AI",
      de: "Machine Learning & KI",
    },
  },
  {
    id: "Geospatial",
    translations: {
      en: "Geospatial Data",
      de: "Geodaten",
    },
  },
  {
    id: "Stream",
    translations: {
      en: "Real-time Streams",
      de: "Echtzeit-Datenströme",
    },
  },
  {
    id: "Document",
    translations: {
      en: "Documents & Files",
      de: "Dokumente & Dateien",
    },
  },
  {
    id: "Analytics",
    translations: {
      en: "Analytics & Insights",
      de: "Analysen & Auswertungen",
    },
  },
];

export const DEFAULT_MEDIA_TYPES: MediaTypeConfig[] = [
  {
    id: "application/json",
    translations: {
      en: "JSON",
      de: "JSON",
    },
  },
  {
    id: "text/csv",
    translations: {
      en: "CSV",
      de: "CSV",
    },
  },
  {
    id: "application/xml",
    translations: {
      en: "XML",
      de: "XML",
    },
  },
  {
    id: "application/parquet",
    translations: {
      en: "Parquet",
      de: "Parquet",
    },
  },
  {
    id: "application/avro",
    translations: {
      en: "Avro",
      de: "Avro",
    },
  },
  {
    id: "application/octet-stream",
    translations: {
      en: "Binary Data",
      de: "Binärdaten",
    },
  },
  {
    id: "text/plain",
    translations: {
      en: "Plain Text",
      de: "Klartext",
    },
  },
  {
    id: "application/pdf",
    translations: {
      en: "PDF",
      de: "PDF",
    },
  },
  {
    id: "image/jpeg",
    translations: {
      en: "JPEG Image",
      de: "JPEG-Bild",
    },
  },
  {
    id: "image/png",
    translations: {
      en: "PNG Image",
      de: "PNG-Bild",
    },
  },
  {
    id: "application/zip",
    translations: {
      en: "ZIP Archive",
      de: "ZIP-Archiv",
    },
  },
  {
    id: "application/protobuf",
    translations: {
      en: "Protocol Buffers",
      de: "Protocol Buffers",
    },
  },
];

export {};

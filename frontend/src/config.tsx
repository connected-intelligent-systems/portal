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

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    config: {
      title: string;
      theme?: ThemeConfig;
      publicEdcEndpoint?: string;
    };
  }
}

export {};

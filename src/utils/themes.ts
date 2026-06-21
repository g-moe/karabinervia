import {KeyColorPair} from 'src/types/keyboard-rendering';
import {AppleRendererColorByMode} from './apple-colors';

export type Theme = {
  alpha: KeyColorPair;
  mod: KeyColorPair;
  accent: KeyColorPair;
};

export const APPLE_DARK_KEYCAP_THEME: Theme = {
  alpha: {
    c: AppleRendererColorByMode.dark.keyAlpha,
    t: AppleRendererColorByMode.dark.keyLegend,
  },
  mod: {
    c: AppleRendererColorByMode.dark.keyModifier,
    t: AppleRendererColorByMode.dark.keyLegend,
  },
  accent: {
    c: AppleRendererColorByMode.dark.keyModifier,
    t: AppleRendererColorByMode.dark.keyLegend,
  },
};

export const APPLE_LIGHT_KEYCAP_THEME: Theme = {
  alpha: {
    c: AppleRendererColorByMode.light.keyAlpha,
    t: AppleRendererColorByMode.light.keyLegend,
  },
  mod: {
    c: AppleRendererColorByMode.light.keyModifier,
    t: AppleRendererColorByMode.light.keyLegend,
  },
  accent: {
    c: AppleRendererColorByMode.light.keyModifier,
    t: AppleRendererColorByMode.light.keyLegend,
  },
};

export const APPLE_KEYCAP_THEME_BY_MODE = {
  dark: APPLE_DARK_KEYCAP_THEME,
  light: APPLE_LIGHT_KEYCAP_THEME,
} as const;

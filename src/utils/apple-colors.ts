export const AppleInteractionColor = {
  systemBlue: '#0a84ff',
  systemBlueAccessible: '#64a8ff',
  systemGray: '#8e8e93',
  systemYellow: '#ffd60a',
  white: '#ffffff',
} as const;

export const AppleRendererColorByMode = {
  dark: {
    keyboardCase: '#0b0b0c',
    keyboardInnerCase: '#141416',
    keyboardInnerCaseSpecular: '#050506',
    keyAlpha: '#1f1f21',
    keyModifier: '#242426',
    keyLegend: '#f5f5f7',
    keyboardMark: AppleInteractionColor.systemBlue,
  },
  light: {
    keyboardCase: '#d1d1d6',
    keyboardInnerCase: '#f2f2f7',
    keyboardInnerCaseSpecular: AppleInteractionColor.white,
    keyAlpha: '#f8f8fa',
    keyModifier: '#eeeeef',
    keyLegend: '#1d1d1f',
    keyboardMark: AppleInteractionColor.systemBlue,
  },
} as const;

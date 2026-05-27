/**
 * Tailwind v4 颜色访问工具
 * Tailwind v4 使用 CSS 变量暴露主题颜色，不再支持 resolveConfig
 */

// 获取 CSS 变量值
function getCSSVariable(name: string): string {
  if (typeof window === 'undefined') {
    // SSR 环境返回默认值
    return '';
  }
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// 颜色对象结构
interface ColorShades {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950?: string;
}

interface ThemeColors {
  gray: ColorShades;
  blue: ColorShades;
  indigo: ColorShades;
  purple: ColorShades;
  red: ColorShades;
  green: ColorShades;
  cyan: ColorShades;
  white: string;
  black: string;
  transparent: string;
  current: string;
}

// Tailwind v4 默认颜色值（fallback）
const defaultColors: ThemeColors = {
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712'
  },
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554'
  },
  indigo: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b'
  },
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764'
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a'
  },
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16'
  },
  cyan: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
    950: '#083344'
  },
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  current: 'currentColor'
};

// 从 CSS 变量读取颜色的辅助函数
function getColorFromCSS(colorName: string, shade: number): string {
  const cssVar = `--color-${colorName}-${shade}`;
  const value = getCSSVariable(cssVar);
  return value || defaultColors[colorName as keyof ThemeColors]?.[shade as keyof ColorShades] || '';
}

// 创建颜色代理对象，动态从 CSS 变量读取
function createColorProxy(colorName: string): ColorShades {
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const result: Record<number, string> = {};
  
  shades.forEach(shade => {
    result[shade] = getColorFromCSS(colorName, shade);
  });
  
  return result as unknown as ColorShades;
}

// 导出 theme 对象，兼容原有代码
export const theme = {
  colors: {
    gray: createColorProxy('gray'),
    blue: createColorProxy('blue'),
    indigo: createColorProxy('indigo'),
    purple: createColorProxy('purple'),
    red: createColorProxy('red'),
    green: createColorProxy('green'),
    cyan: createColorProxy('cyan'),
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
    current: 'currentColor'
  } as ThemeColors
};

// 默认导出，方便使用
export default theme;

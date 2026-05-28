import { theme } from '~/utils/tailwind-theme';

const defaultGradientBrightness = 200;

// Helper to get color with fallback
function getColorWithFallback(colorName: string, shade: number) {
  const color = theme.colors[colorName as keyof typeof theme.colors];
  if (typeof color === 'string') return color;
  const value = (color as any)?.[shade];
  if (value && value !== '') return value;
}

export type GradientStop = Record<string, string | { color: string; opacity: number }>

export const gradientMap: Record<string, GradientStop> = {
	'gray-blue': {
		0: getColorWithFallback('gray', defaultGradientBrightness),
		100: getColorWithFallback('blue', defaultGradientBrightness)
	},
	'transparent-blue': {
		0: { color: getColorWithFallback('blue', defaultGradientBrightness), opacity: 0.5 },
		100: getColorWithFallback('blue', defaultGradientBrightness)
	},
	'gray-transparent-blue': {
		0: getColorWithFallback('gray', defaultGradientBrightness),
		60: { color: getColorWithFallback('blue', defaultGradientBrightness), opacity: 0 },
		100: { color: getColorWithFallback('blue', defaultGradientBrightness), opacity: 1 }
	},
	'blue-blue-transparent': {
		0: { color: getColorWithFallback('blue', defaultGradientBrightness), opacity: 0.5 },
		60: { color: getColorWithFallback('blue', defaultGradientBrightness), opacity: 1 },
		100: { color: getColorWithFallback('blue', defaultGradientBrightness), opacity: 0 }
	},
	'indigo-blue-transparent': {
		0: { color: getColorWithFallback('indigo', defaultGradientBrightness), opacity: 0 },
		40: { color: getColorWithFallback('indigo', defaultGradientBrightness), opacity: 1 },
		100: getColorWithFallback('blue', defaultGradientBrightness)
	},
	'purple-indigo': {
		0: getColorWithFallback('purple', defaultGradientBrightness),
		100: getColorWithFallback('indigo', defaultGradientBrightness)
	},
	'indigo-blue': {
		0: getColorWithFallback('indigo', defaultGradientBrightness),
		100: getColorWithFallback('blue', defaultGradientBrightness)
	},
	'blue-white': { 0: getColorWithFallback('blue', defaultGradientBrightness), 100: theme.colors.white },
	'red-white': { 0: getColorWithFallback('red', defaultGradientBrightness), 100: theme.colors.white },
	'green-white': { 0: getColorWithFallback('green', defaultGradientBrightness), 100: theme.colors.white },
	'red-purple': {
		90: getColorWithFallback('red', defaultGradientBrightness),
		100: getColorWithFallback('purple', defaultGradientBrightness)
	},
	'blue-purple': {
		0: getColorWithFallback('blue', defaultGradientBrightness),
		100: getColorWithFallback('purple', defaultGradientBrightness)
	},
	'green-purple': {
		0: getColorWithFallback('green', defaultGradientBrightness),
		100: getColorWithFallback('purple', defaultGradientBrightness)
	},
	'blue-gray': {
		0: getColorWithFallback('blue', defaultGradientBrightness),
		50: getColorWithFallback('gray', defaultGradientBrightness)
	},
	'blue-white-blue': {
		0: getColorWithFallback('blue', defaultGradientBrightness),
		40: theme.colors.white,
		60: theme.colors.white,
		100: getColorWithFallback('blue', defaultGradientBrightness)
	},
	'gray-white-blue': {
		0: getColorWithFallback('gray', defaultGradientBrightness),
		50: theme.colors.white,
		60: theme.colors.white,
		100: { color: getColorWithFallback('blue', defaultGradientBrightness), opacity: 0.7 }
	},
	'transparent-purple': {
		0: { color: getColorWithFallback('purple', 100), opacity: 0 },
		100: { color: getColorWithFallback('purple', 200), opacity: 1 }
	},
	'transparent-purple2': {
		0: { color: getColorWithFallback('purple', 400), opacity: 0 },
		100: { color: getColorWithFallback('purple', 200), opacity: 1 }
	},
	'blue-blue': {
		0: getColorWithFallback('blue', 300),
		100: getColorWithFallback('blue', 300)
	},
	'red-red': {
		0: getColorWithFallback('red', 300),
		100: getColorWithFallback('red', 300)
	},
	'green-green': {
		0: getColorWithFallback('green', 300),
		100: getColorWithFallback('green', 300)
	},
	'blue-blue2': {
		0: getColorWithFallback('blue', defaultGradientBrightness),
		100: getColorWithFallback('blue', defaultGradientBrightness)
	},
	'red-red2': {
		0: getColorWithFallback('red', defaultGradientBrightness),
		100: getColorWithFallback('red', defaultGradientBrightness)
	},
	'green-green2': {
		0: getColorWithFallback('green', defaultGradientBrightness),
		100: getColorWithFallback('green', defaultGradientBrightness)
	},
	'gray-gray': {
		0: getColorWithFallback('gray', defaultGradientBrightness),
		100: getColorWithFallback('gray', defaultGradientBrightness)
	},
	'purple-purple': {
		0: theme.colors.purple[300],
		100: theme.colors.purple[300]
	},
	blue: {
		0: getColorWithFallback('blue', defaultGradientBrightness),
		100: getColorWithFallback('blue', defaultGradientBrightness)
	}
}



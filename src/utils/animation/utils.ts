import { theme } from '../tailwind-theme'

export const FADE_OUT_COLOR = theme.colors.gray[100]

export const getGradientStops = (className: string, stopIdx = 1) => {
  return Array.from(document.querySelectorAll(className)).map(
    (el) => el?.querySelectorAll('stop')[stopIdx],
  )
}

export const animateGradient = (
  tl: GSAPTimeline,
  stops: SVGStopElement | (SVGStopElement | undefined)[] | undefined,
  options: GSAPTweenVars = {},
) => {
  if (!stops) return
  const {
    color = 'rgba(255,255,255,0)',
    duration = 0.1,
    ease = 'power1.in',
    offset = { from: '0%', to: '100%' },
    position = '+=0',
    ...rest
  } = options

  const { from = '0%', to = '100%' } = offset

  const initialColor = Array.isArray(stops)
    ? stops.map((d) => d?.getAttribute('stop-color'))
    : stops?.getAttribute('stop-color')

  tl.fromTo(
    stops,
    { attr: { offset: from, 'stop-color': color } },
    { attr: { offset: to, 'stop-color': color }, duration, ease, ...rest },
    position,
  ).to(
    stops,
    {
      attr: {
        offset: to,
        'stop-color': (i: number) =>
          Array.isArray(stops) ? initialColor[i] : initialColor,
      },
      duration,
      ease,
      ...rest,
    },
    '-=50%',
  )
}

/**
 * Fade in elements, optionally keeping non-last tokens visible
 * when only animating the newest token.
 */
export const fadeInReveal = (
  tl: GSAPTimeline,
  targets: any,
  isNextTokenOnly: boolean,
  duration: number,
  position?: string,
) => {
  tl.fromTo(
    targets,
    {
      opacity: (_: number, el: Element) =>
        isNextTokenOnly ? (el.classList.contains('last') ? 0 : 1) : 0,
    },
    { opacity: 1, duration },
    position,
  )
}

/**
 * Animate a gradient stop pair (normal + last-token),
 * selecting only last-token stops when isNextTokenOnly is true.
 */
export const animateGradientPair = (
  tl: GSAPTimeline,
  gradClass: string,
  isNextTokenOnly: boolean,
  options: GSAPTweenVars = {},
  stopIdx?: number,
) => {
  const [grad, gradLast] = getGradientStops(gradClass, stopIdx)
  if (isNextTokenOnly) {
    animateGradient(tl, gradLast, { ...options, position: '<' })
  } else {
    animateGradient(tl, [grad, gradLast], options)
  }
}

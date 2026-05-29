import type { ContentBlock, InlineHtml, NumberedItem } from './types'

// ── Inline markup helpers ────────────────────────────────────────────
// These wrap text in the same HTML tags the old template literals used,
// so the existing CSS rules keep working unchanged.

/** Bold */
export const b = (s: string): string => `<strong>${s}</strong>`

const color =
  (className: string) =>
  (s: string): string =>
    `<span class="${className}">${s}</span>`

/** Blue span */
export const blue = color('blue')

/** Red span */
export const red = color('red')

/** Green span */
export const green = color('green')

/** Purple span */
export const purple = color('purple')

/** Highlight span */
export const hl = color('highlight')

// ── Content block builders ───────────────────────────────────────────

export const p = (html: InlineHtml, spaceAfter = false): ContentBlock => ({
  type: 'paragraph',
  html,
  spaceAfter,
})

export const bq = (html: InlineHtml): ContentBlock => ({
  type: 'blockquote',
  html,
})

export const ul = (...items: InlineHtml[]): ContentBlock => ({
  type: 'ul',
  items,
})

export const ol = (...items: InlineHtml[]): ContentBlock => ({
  type: 'ol',
  items,
})

export const numbered = (...items: (string | [number, string])[]): ContentBlock => ({
  type: 'numbered-list',
  items: items.map((item, i) => {
    if (Array.isArray(item)) {
      return { number: item[0], html: item[1] } as NumberedItem
    }
    return { number: i + 1, html: item } as NumberedItem
  }),
})

/** A piece of inline HTML content (may contain <strong>, <span> etc.) */
export type InlineHtml = string

// ── Content block types ──────────────────────────────────────────────

export interface Paragraph {
  type: 'paragraph'
  html: InlineHtml
  spaceAfter?: boolean
}

export interface Blockquote {
  type: 'blockquote'
  html: InlineHtml
}

export interface UnorderedList {
  type: 'ul'
  items: InlineHtml[]
}

export interface OrderedList {
  type: 'ol'
  items: InlineHtml[]
}

export interface NumberedItem {
  number: number
  html: InlineHtml
}

export interface NumberedList {
  type: 'numbered-list'
  items: NumberedItem[]
}

export type ContentBlock =
  | Paragraph
  | Blockquote
  | UnorderedList
  | OrderedList
  | NumberedList

// ── Textbook page ────────────────────────────────────────────────────

export interface TextbookPage {
  id: string
  title: string
  content?: ContentBlock[]
  component?: any
  timeoutId?: number
  on: () => void
  out: () => void
  complete?: () => void
}

import { textPages } from './index'

/** Call the complete() handler for the textbook page with the given id. */
export function completePage(pageId: string): void {
  textPages.find((p) => p.id === pageId)?.complete?.()
}

/** Call the out() handler for the textbook page with the given id. */
export function outPage(pageId: string): void {
  textPages.find((p) => p.id === pageId)?.out?.()
}

/** Return the index of the textbook page with the given id, or -1 if not found. */
export function pageIndexById(pageId: string): number {
  return textPages.findIndex((p) => p.id === pageId)
}

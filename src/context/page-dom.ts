import { getContext } from 'svelte'

/** Main visualization root (`.main-section` in +page.svelte). */
export const PAGE_DOM_CTX = Symbol('page-dom')

export type PageDomContext = {
	getRoot: () => HTMLElement | undefined
}

/** Fixed header height from +layout.svelte. */
export const LAYOUT_DOM_CTX = Symbol('layout-dom')

export type LayoutDomContext = {
	getTopbarHeight: () => number
}

export function getPageDom(): PageDomContext | undefined {
	return getContext<PageDomContext>(PAGE_DOM_CTX)
}

export function getLayoutDom(): LayoutDomContext | undefined {
	return getContext<LayoutDomContext>(LAYOUT_DOM_CTX)
}

export function queryInPage<K extends keyof HTMLElementTagNameMap>(
	selector: K,
): HTMLElementTagNameMap[K] | null
export function queryInPage(selector: string): Element | null
export function queryInPage(selector: string): Element | null {
	return getPageDom()?.getRoot()?.querySelector(selector) ?? null
}

export function queryAllInPage(selector: string): Element[] {
	const root = getPageDom()?.getRoot()
	if (!root) return []
	return [...root.querySelectorAll(selector)]
}

function updateOpacity(selector: string, opacity: number) {
	const els = document.querySelectorAll(selector);
	for (let i = 0; i < els.length; i++) {
		(els[i] as HTMLElement).style.opacity = String(opacity);
	}
}

function updatePointerEvents(selector: string, value: string) {
	const els = document.querySelectorAll(selector);
	for (let i = 0; i < els.length; i++) {
		(els[i] as HTMLElement).style.pointerEvents = value;
	}
}

/**
 * Highlight attention area
 */
export function highlightAttentionPath() {
	updateOpacity('svg g.path-group', 0.3);
	updateOpacity('svg g.path-group.attention', 1);
	updateOpacity('div.step.softmax', 0.3);
	updateOpacity('div.step.embedding', 0.3);
	updateOpacity('div.step .column', 0.3);
	updateOpacity('div.step.attention .column', 1);
	updateOpacity('div.step.qkv .qkv-column', 1);
	updateOpacity('div.step.mlp .column.initial', 1);
}

/**
 * Remove attention highlighting
 */
export function removeAttentionPathHighlight() {
	updateOpacity('svg g.path-group', 1);
	updateOpacity('div.step.softmax', 1);
	updateOpacity('div.step.embedding', 1);
	updateOpacity('div.step .column', 1);
	updateOpacity('div.step .column.residual', 0.5);
}

/**
 * Highlight logit area
 */
export function highlightLogitPath() {
	updateOpacity('svg g.path-group', 0.3);
	updateOpacity('svg g.path-group.transformer-blocks', 1);
	updateOpacity('svg g.path-group.softmax', 1);
	updateOpacity('div.step > div', 0.3);
	updateOpacity('div.step.softmax > div', 1);
	updateOpacity('div.step.transformer-blocks > div', 1);
	updatePointerEvents('.steps', 'none');
}

/**
 * Highlight path
 */
export function highlightPath(value: string) {
	updateOpacity('svg g.path-group', 0.3);
	updateOpacity(`svg g.path-group.${value}`, 1);
	updateOpacity('div.step > div', 0.3);
	updateOpacity(`div.step.${value} > div`, 1);
	updatePointerEvents('.steps', 'none');

	if (value === 'mlpUp' || value === 'mlpDown') {
		updateOpacity(`div.step.${value} .layer`, 0.3);
		updateOpacity(`div.step.${value} .layer.${value}`, 1);
	}
}

/**
 * Remove path highlighting
 */
export function removePathHighlight() {
	updateOpacity('svg g.path-group', 1);
	updateOpacity('div.step > div', 1);
	updateOpacity('div.step.mlp .layer', 1);
	updatePointerEvents('.steps', 'auto');
}

/**
 * Get transformer-bounding element height
 */
export function getTransformerBoundingHeight(): string | undefined {
	const transformerBounding = document.querySelector('.transformer-bounding');
	if (transformerBounding) {
		return getComputedStyle(transformerBounding).height;
	}
}

/**
 * Sync element height with transformer-bounding height
 */
export function syncWithTransformerBoundingHeight(selector: string) {
	const height = getTransformerBoundingHeight();
	const element = document.querySelector(selector) as HTMLElement;
	if (element && height) {
		element.style.height = height;
	}
}

/**
 * Highlight multiple elements by selectors
 */
export function highlightElements(selectors: string[], className = 'textbook-highlight') {
	selectors.forEach((selector) => {
		const elements = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
		elements.forEach((element) => {
			element.classList.remove('remove-finger');
			element.classList.add(className);
		});
	});
}

/**
 * Remove highlight from multiple elements by selectors
 */
export function removeHighlightFromElements(selectors: string[], className = 'textbook-highlight') {
	selectors.forEach((selector) => {
		const elements = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
		elements.forEach((element) => {
			element.classList.remove(className);
		});
	});
}

/**
 * Remove finger pointer
 */
export function removeFingerFromElements(selectors: string[]) {
	selectors.forEach((selector) => {
		const elements = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
		elements.forEach((element) => {
			element.classList.add('remove-finger');
		});
	});
}

/**
 * Apply transformer-bounding height to multiple elements
 */
export function applyTransformerBoundingHeight(selectors: string[]) {
	const height = getTransformerBoundingHeight();
	selectors.forEach((selector) => {
		const element = document.querySelector(selector) as HTMLElement;
		if (element && height) {
			element.style.height = height;
		}
	});
}

/**
 * Reset height to 100% for multiple elements
 */
export function resetElementsHeight(selectors: string[]) {
	selectors.forEach((selector) => {
		const element = document.querySelector(selector) as HTMLElement;
		if (element) {
			element.style.height = '100%';
		}
	});
}

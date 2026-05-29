<script lang="ts">
import classNames from 'classnames'
import {
  isTextbookOpen,
  textbookCurrentPage,
  textbookCurrentPageId,
  textbookPreviousPage,
  tokens,
} from '~/store'
import { drawResidualLine } from '~/utils/animation/residual'
import { textPages } from '~/utils/textbook/pages/index'
import Operation from './Operation.svelte'

const typeToPageIdMap = {
  activation: 'mlp',
  dropout: 'dropout',
  ln: 'layer-normalization',
  'residual-start': 'residual',
  'residual-end': 'residual',
} as const

type OpType = keyof typeof typeToPageIdMap

let {
  id,
  className = undefined,
  type,
}: {
  id: string
  className?: string | undefined
  type: OpType
} = $props()

let drawLine: () => void = () => {}
let removeLine: () => void = () => {}

$effect(() => {
  ({ drawLine, removeLine } = drawResidualLine(id))
  return removeLine
})

let isHovered = $state(false)
let containerElement: HTMLDivElement | undefined = $state()

const onMouseOver = () => {
  if ($isTextbookOpen && $textbookCurrentPageId === 'residual') return
  isHovered = true
  drawLine()
}
const onMouseOut = () => {
  if ($isTextbookOpen && $textbookCurrentPageId === 'residual') return
  isHovered = false
  removeLine()
}

function openTextbookPage(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()

  const pageId = typeToPageIdMap[type]
  if (!pageId) return

  const pageIndex = textPages.findIndex((page) => page.id === pageId)
  if (pageIndex !== -1) {
    textbookPreviousPage.set($textbookCurrentPage)
    isTextbookOpen.set(true)
    textbookCurrentPage.set(pageIndex)
    textbookCurrentPageId.set(pageId)
  }
}

const isResidual = $derived(type === 'residual-start' || type === 'residual-end')
const isActivation = $derived(type === 'activation')
const containerId = $derived(type === 'residual-start' ? `${id}-start` : type === 'residual-end' ? `${id}-end` : id)
const classSuffix = $derived(isResidual ? 'residual' : type)
const residualAttrs = $derived(isResidual ? { 'data-click': type } : {})
</script>

{#if type}
	<div
		id={containerId}
		class={classNames("operation-col column", classSuffix, className)}
		role="group"
		class:active={isHovered}
		bind:this={containerElement}
		onmouseenter={isResidual ? onMouseOver : () => { isHovered = true }}
		onmouseleave={isResidual ? onMouseOut : () => { isHovered = false }}
		onclick={openTextbookPage}
		{...residualAttrs}
	>
		{#each $tokens as _, index}
			<Operation
				id={isResidual ? id : undefined}
				className={classNames(className, {
					last: index === $tokens.length - 1,
				})}
				{type}
				head={isActivation || type === 'residual-start' ? index === 0 : undefined}
				tail={type !== 'residual-start' ? index === $tokens.length - 1 : undefined}
				active={isHovered}
			/>
		{/each}
	</div>
{/if}

<style lang="scss">
	.column.operation-col {
		cursor: help;
		z-index: $ABOVE_COLUMN;
		height: fit-content;

		&.residual {
			opacity: 0.5 !important;
			&.active {
				opacity: 1 !important;
			}
		}

		&.active {
			z-index: $ABOVE_COLUMN;
			&::after {
				content: "";
				position: absolute;
				height: 100%;
				width: 1.3rem;
				z-index: $POPOVER_INDEX;
			}
		}
	}

	:global(.dropout-popover),
	:global(.ln-popover),
	:global(.residual-popover) {
		width: 10rem;
		z-index: $POPOVER_INDEX;
	}
</style>

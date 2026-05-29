<script lang="ts">
import { MoveRight, ZoomIn } from '@lucide/svelte'
import classNames from 'classnames'
import * as d3 from 'd3'
import { getContext, onMount, setContext, tick } from 'svelte'
import {
  blockIdx,
  expandedBlock,
  isExpandOrCollapseRunning,
  isTextbookOpen,
  modelMeta,
  textbookCurrentPageId,
  tokenIds,
  tokens,
} from '~/store'
import { Flip, gsap } from '~/utils/gsap'
import { theme } from '~/utils/tailwind-theme'
import { completePage } from '~/utils/textbook/pages/actions'
import DaisyTooltip from './common/DaisyTooltip.svelte'
import TextbookTooltip from './common/TextbookTooltip.svelte'
import VectorCanvas from './common/VectorCanvas.svelte'

let { className }: { className?: string | undefined } = $props()

setContext('block-id', 'embedding')

const blockId = getContext('block-id') as string
let isExpanded = $state(false)

$effect(() => {
  if ($expandedBlock.id === blockId) {
    if (!isExpanded) {
      isExpanded = true
      expand()
    }
  } else {
    if (isExpanded) {
      isExpanded = false
      collapse()
    }
  }
})

const onClick = () => {
  if (!isExpanded) {
    expandedBlock.set({ id: blockId })
  }
}

const onClickTitle = (e: MouseEvent | KeyboardEvent) => {
  e.stopPropagation()
  e.preventDefault()
  completePage('embedding')

  if (!isExpanded) {
    expandedBlock.set({ id: blockId })
  } else {
    expandedBlock.set({ id: null })
  }
}

let expandableEl: HTMLDivElement

function handleOutsideClick(e: MouseEvent) {
  if (isExpanded && !expandableEl.contains(e.target as HTMLElement)) {
    expandedBlock.set({ id: null })
  }
}

onMount(() => {
  const mainSection = getContext<{ current: HTMLElement | null }>('main-section')?.current
  if (!mainSection) return
  mainSection.addEventListener('click', handleOutsideClick)
  return () => {
    mainSection.removeEventListener('click', handleOutsideClick)
  }
})

// animation
let containerState: any

const expand = async () => {
  containerState = Flip.getState('.embedding .token-column')
  isExpanded = true

  await tick()

  isExpandOrCollapseRunning.set(true)

  Flip.from(containerState, {
    duration: 0.5,
    ease: 'power2.inOut',
    onComplete: () => {
      isExpandOrCollapseRunning.set(false)
    },
  })
  gsap.to('.embedding-detail', {
    opacity: 1,
    duration: 0.5,
    delay: 0.5,
  })
}

const collapse = async () => {
  containerState = Flip.getState('.embedding .token-column')
  isExpanded = false
  await tick()

  isExpandOrCollapseRunning.set(true)

  Flip.from(containerState, {
    duration: 0.5,
    ease: 'power2.inOut',
    onComplete: () => {
      isExpandOrCollapseRunning.set(false)
    },
  })
}

let isHovered = $state(false)

function handleMouseEnter() {
  isHovered = true
}

function handleMouseLeave() {
  isHovered = false
}

const embeddingVectorColor = 'bg-gray-300'
</script>

<div
	class={classNames('embedding', className, {
		expanded: isExpanded,
		'textbook-highlight': $isTextbookOpen && $textbookCurrentPageId === 'transformer-architecture'
	})}
	bind:this={expandableEl}
	role="none"
	onclick={onClick}
	onkeydown={onClick}
>
	<div
		class="title expandable"
		role="none"
		onclick={onClickTitle}
		onkeydown={onClickTitle}
		onmouseenter={handleMouseEnter}
		onmouseleave={handleMouseLeave}
	>
		<div class="title-text flex w-max items-center gap-1">
			Embedding
			<ZoomIn></ZoomIn>
		</div>
	</div>
	<div class="content relative">
		<div class="bounding embedding-bounding" class:active={isHovered && !isExpanded}></div>
		<div class="token-column resizable resize-watch flex">
			<!-- token -->
			<div class="column token-string relative">
				{#if isExpanded}<div class="subtitle embedding-detail">
						<TextbookTooltip id="token-embedding">Tokenization</TextbookTooltip>
					</div>{/if}
				{#each $tokens as token, index}
					<div class="cell" class:last={index === $tokens.length - 1}>
						<span class="label">{token}</span>
					</div>
				{/each}
			</div>
			{#if isExpanded}
				<!-- token id and embedding -->
				<div class="column token-embedding embedding-detail">
					<div class="subtitle flex items-center gap-1">
						<TextbookTooltip id="token-embedding"><span>Token<br />Embedding</span></TextbookTooltip
						>
					</div>
					{#each $tokens as token, index}
						<div class="token-id flex items-center">
							<div class="vocab-index ellipsis flex items-center text-right text-xs text-gray-400">
								<div class="flex flex-col items-center">
									<MoveRight />
								</div>
							</div>
							<div class="cell flex items-center">
								<div class={`vector ${embeddingVectorColor}`}>
									<VectorCanvas active />
								</div>
								<span class="index-val text-xs">
									{#if index === 0}
										<span class="label">id</span><br />
									{/if}
									<span class="val">{$tokenIds[index]}</span>
								</span>
							</div>
						</div>
					{/each}
				</div>
				<!-- position embedding -->
				<div class="column symbol embedding-detail">
					{#each $tokens}
						<div class="cell text-lg">+</div>
					{/each}
				</div>
				<div class="column embedding-detail position-embedding">
					<div class="subtitle flex gap-1">
						<TextbookTooltip id="positional-encoding">
							<span>Positional<br />Encoding</span>
						</TextbookTooltip>
					</div>
					{#each $tokens as _, index}
						<div class="cell flex items-center">
							<div class={`vector ${embeddingVectorColor}`}>
								<VectorCanvas
									active
									colorScale={(d, i) => {
										return d3
											.scaleDiverging<string>()
											.domain([0, 0.5, 1])
											.range([theme.colors.red[400], 'white', theme.colors.blue[400]])(d);
									}}
								/>
							</div>
							<span class="index-val text-xs">
								{#if index === 0}
									<span class="label">position</span><br />
								{/if}
								<span class="val">{index}</span>
							</span>
						</div>
					{/each}
				</div>
				<div class="column symbol embedding-detail">
					{#each $tokens}
						<div class="cell">=</div>
					{/each}
				</div>
				<DaisyTooltip triggeredBy=".embedding .vector" class="popover" placement="right"
					>vector({$modelMeta.dimension})</DaisyTooltip>
			{/if}
		</div>

		<div class="vector-column block-start-column relative flex">
			<div class="column vectors embedding-column">
				{#each $tokens as _, index}
					<div class={`vector ${embeddingVectorColor}`} class:last={index === $tokens.length - 1}>
						<VectorCanvas active={$blockIdx === 0 && (isHovered || isExpanded)} />
					</div>
				{/each}
			</div>
			<DaisyTooltip triggeredBy=".step.embedding .vector" class="popover" placement="right"
				>vector({$modelMeta.dimension})</DaisyTooltip>
		</div>
	</div>
</div>

<style lang="scss">
	.embedding-bounding {
		top: -0.5rem;
		padding: 0.5rem 0;
		left: 2rem;
		width: calc(100% - 2rem);
		height: 100%;
	}
	.embedding {
		&.expanded {
			.title,
			.content {
				z-index: $EXPANDED_CONTENT_INDEX;
			}
			.operations {
				pointer-events: none;
				opacity: 0.2;
			}
		}
		.embedding-detail {
			opacity: 0;
		}
		.title {
			justify-content: end;
			padding-left: 3rem;
			width: 1rem;
			white-space: nowrap;
		}
		.content {
			padding-left: 2rem;
			display: flex;

			.token-column {
				.column {
					padding: 0 1rem;

					.cell {
						justify-content: flex-end;
						gap: 0.5rem;
						text-align: left;
					}
				}
				.symbol {
					font-size: 0.8rem;
					color: var(--color-gray-400);
				}
			}

			.token-string {
				width: 7rem;
				flex-shrink: 0;
			}

			.subtitle {
				justify-content: center;
				align-items: end;
				line-height: 1.3;
			}
			.index-val .label {
				color: var(--color-gray-400);
				line-height: 1;
				font-size: 0.8rem;
			}
			.index-val .val {
				width: 4rem;
				text-align: left;
				font-size: 0.7rem;
				color: var(--color-gray-600);
				font-family: monospace;
			}

			.token-embedding {
				position: relative;
				width: 11rem;

				.vocab-index {
					width: 5rem;
					flex-shrink: 0;
					display: flex;
					justify-content: center;
					overflow: visible;
					padding-right: 1rem;
				}
			}

			.position-embedding {
				.subtitle {
					margin-left: -1rem;
				}
				.cell {
					justify-content: center;
					gap: 0.5rem;
				}
				.index-val {
					width: 2rem;
					justify-content: start;
				}
			}
		}
	}
</style>


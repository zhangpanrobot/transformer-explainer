<script lang="ts">
import { MoveDown } from '@lucide/svelte'
import classNames from 'classnames'
import { blockIdx, expandedBlock, isBoundingBoxActive, modelMeta, tokens } from '~/store'
import DaisyTooltip from './common/DaisyTooltip.svelte'
import TextbookTooltip from './common/TextbookTooltip.svelte'
import VectorCanvas from './common/VectorCanvas.svelte'

let { className = undefined }: { className?: string | undefined } = $props()
</script>

<div
	class={classNames('transformer-blocks', className, {
		expanded: $expandedBlock.id !== null
	})}
	role="group"
	onmouseenter={() => {
		isBoundingBoxActive.set(true);
	}}
	onmouseleave={() => {
		isBoundingBoxActive.set(false);
	}}
>
	<div class="title"></div>
	<div class="content">
		<div class="column final relative">
			<div
				class="guide flex flex-col items-start gap-1"
				class:active={$blockIdx !== $modelMeta.layer_num - 1}
			>
				<div class="text" class:highlight={$isBoundingBoxActive}>
					<TextbookTooltip id="blocks">
						<span class="strong">{$modelMeta.layer_num - $blockIdx - 1}</span> more identical<br
						/><span class="strong">Transformer<br />Blocks</span>
					</TextbookTooltip>
				</div>
				<MoveDown />
			</div>

			{#each $tokens as _, index}
				<div class="cell" class:last={index === $tokens.length - 1}>
					<div
						class={classNames(`vector shrink-0 bg-blue-200`, {
							'last-token': index === $tokens.length - 1
						})}
					>
						<VectorCanvas colorScale="blue" />
					</div>
				</div>
			{/each}
			<DaisyTooltip class="popover" triggeredBy={'.transformer-blocks .vector'} placement="right"
				>vector({$modelMeta.dimension})</DaisyTooltip>
		</div>
		<div class="second-column">
			<div class="prob-dim" class:expanded={$expandedBlock.id === 'softmax'}></div>
		</div>
	</div>
</div>

<style lang="scss">
	.transformer-blocks {
		&.expanded {
			.guide {
				opacity: 0.2;
			}
		}
		.guide {
			z-index: 200;
			opacity: 0;
			transition: opacity 0.2s;
			white-space: pre;
			position: absolute;
			top: 0;
			left: calc(-50% - 0.5rem);
			transform: translateY(-100%);
			color: var(--color-gray-400);

			.text {
				transition: opacity 0.5s;
				line-height: 1.2;
				padding-left: 0.5rem;
				font-size: 0.85rem;
				.strong {
					font-weight: 600;
				}

				&.highlight {
					.strong {
						transition: all 0.5s;
						color: var(--color-blue-500);
						font-weight: 600;
					}
				}
			}
			&.active {
				opacity: 1;
			}
		}
		.content {
			display: grid;
			grid-template-columns: repeat(4, minmax(var(--min-column-width), 1fr));

			.column.final {
				grid-column-start: 2;

				.label.float {
					left: 2rem;
				}
			}
		}
		.column.initial .cell {
			gap: 0.6rem;
		}
	}

	.second-column {
		grid-column: span 2;
	}
	.prob-dim {
		pointer-events: none;
		position: absolute;
		bottom: -3rem;
		transform: translateX(-1rem);
		width: 100%;
		height: 30%;
		z-index: $ABOVE_COLUMN;
		background-color: white;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);

		&.expanded {
			z-index: $EXPANDED_DIM_INDEX;
		}
	}
</style>

<script lang="ts">
import { CircleX, RefreshCcw, SkipForward } from '@lucide/svelte'
import type { Snippet } from 'svelte'
import { onDestroy, onMount } from 'svelte'
import { weightPopover } from '~/store'

let {
  id,
  title,
  className = undefined,
  isAnimationActive = $bindable(false),
  timeline,
  isOpen = $bindable(true),
  children,
}: {
  id: string
  title: string
  className?: string | undefined
  isAnimationActive?: boolean
  timeline: GSAPTimeline
  isOpen?: boolean
  children?: Snippet
} = $props()

let startTime: number

onMount(() => {
  startTime = performance.now()
})
onDestroy(() => {
  let endTime = performance.now()
  let visibleDuration = endTime - startTime
})
</script>

<div
	class={`weight-popover-card popover bg-white text-sm font-light text-gray-500 ${className}`}
	onclick={(e) => {
		e.stopPropagation();
	}}
>
	<div
		class="weight-popover-title rounded-t-md border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
	>
		<h3 class="font-semibold text-gray-900">{title}</h3>
		<div class="controls">
			{#if isAnimationActive}
				<button
					class="play-control forward"
					onclick={(e) => {
						e.stopPropagation();
						timeline.progress(1);
						isAnimationActive = false;
					}}
					><SkipForward />
				</button>
			{:else}
				<button
					class="play-control restart"
					onclick={(e) => {
						e.stopPropagation();
						isAnimationActive = true;
						timeline.restart();
					}}
				>
					<RefreshCcw /></button
				>
			{/if}
			<button
				class="close"
				onclick={(e) => {
					e.stopPropagation();
					weightPopover.set(null);
					isOpen = false;
				}}><CircleX class="h-5 w-5 text-gray-500" /></button
			>
		</div>
	</div>
	<div class="content">
		{@render children?.()}
	</div>
</div>

<style lang="scss">
	:global(.weight-popover-card) {
		width: max-content !important;
		max-width: none !important;
		padding: 0 !important;
		display: flex;
		flex-direction: column;
	}

	.weight-popover-title {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		gap: 1rem;
		justify-content: space-between;
	}
	.content {
		width: 100%;

		:global(.formula) {
			position: relative;

			:global(.first-row) {
				opacity: 1;
				width: 100%;
				position: absolute;
			}
			:global(.total) {
				opacity: 0;
			}
			:global(.katex-html) {
				font-size: 0.9rem;
			}
		}
	}
	.controls {
		display: flex;
		gap: 0.5rem;
	}

	:global(.weight-popover-content) {
		padding: 3rem 2rem 1.5rem 1rem;
		width: 100%;

		:global(.tokens) {
			padding-right: 0.3rem;
			display: flex;
			flex-direction: column;
		}

		:global(.token-label) {
			font-size: 0.8rem;
			line-height: 1;
			text-align: right;
			color: var(--colors-gray-500);
		}

		:global(.matrix) {
			height: 100%;
			position: relative;
			justify-content: space-around;

			:global(.title),
			:global(.size) {
				color: var(--colors-gray-900);
				font-size: 0.8rem;
				white-space: nowrap;
				position: absolute;
			}
			:global(.size) {
				bottom: -1.5rem;
			}

			:global(.title) {
				line-height: 1.2;
				text-align: center;
				bottom: calc(100% + 1rem);
			}
		}
		:global(.operator) {
			padding: 0 0.5rem;
			font-size: 1.2rem;
			color: black;
			opacity: 0.8;
		}
	}
</style>

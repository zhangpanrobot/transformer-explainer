<script lang="ts">
import { Maximize2 } from '@lucide/svelte'
import { getContext, onMount } from 'svelte'
import { get } from 'svelte/store'
import { fade } from 'svelte/transition'
import { tooltip, topbarHeight, weightPopover } from '~/store'
import {
  highlightAttentionPath,
  highlightLogitPath,
  highlightPath,
  removeAttentionPathHighlight,
  removePathHighlight,
} from '~/utils/textbook/index'
import AttentionWeight from './popovers/AttentionWeight.svelte'
import LogitWeight from './popovers/LogitWeight.svelte'
import MLPDownWeight from './popovers/MLPDownWeight.svelte'
import MLPWeight from './popovers/MLPWeight.svelte'
import QkvWeight from './popovers/QKVWeight.svelte'

let resizeObserver: ResizeObserver
let positions: Record<string, { left: number; top: number }> = $state({
  qkv: { left: 0, top: 0 },
  mlpUp: { left: 0, top: 0 },
  mlpDown: { left: 0, top: 0 },
  attention: { left: 0, top: 0 },
  softmax: { left: 0, top: 0 },
})

const popoverConfig = [
  { key: 'qkv', cssClass: 'qkv-weight-popover', component: QkvWeight },
  { key: 'attention', cssClass: 'attention-weight-popover', component: AttentionWeight },
  { key: 'mlpUp', cssClass: 'mlp-weight-popover', component: MLPWeight },
  { key: 'mlpDown', cssClass: 'mlp-weight-popover', component: MLPDownWeight },
  { key: 'softmax', cssClass: 'softmax-weight-popover', component: LogitWeight },
]

let popoverEl: HTMLElement

function handleOutsideClick(e) {
  if ($weightPopover && !popoverEl.contains(e.target)) {
    weightPopover.set(null)
  }
}
// tooltip state
let isVisible = $derived(!!$tooltip && !$weightPopover);

let x = $state(0)
let y = $state(0)

function handleMouseMove(e: MouseEvent) {
  x = e.clientX + 10
  y = e.clientY + 10
}

onMount(() => {
  const mainSection = getContext<{ current: HTMLElement | null }>('main-section')?.current
  mainSection?.addEventListener('click', handleOutsideClick)

  // set popover positions
  const embedding = document.querySelector('.step.qkv .content')
  const mlp = document.querySelector('.step.mlp .content')
  const mlpDown = document.querySelector('.step.mlp .second-layer')
  const attention = document.querySelector('.step.attention .content .multi-head')
  const softmax = document.querySelector('.step.transformer-blocks .content')

  const setPosition = () => {
    const scrollLeft = window.scrollX
    const tbh = get(topbarHeight)

    const embeddingRect = embedding?.getBoundingClientRect()
    const mlpRect = mlp?.getBoundingClientRect()
    const mlpDownRect = mlpDown?.getBoundingClientRect()
    const attentionRect = attention?.getBoundingClientRect()
    const softmaxRect = softmax?.getBoundingClientRect()

    positions.qkv = { left: embeddingRect?.right + scrollLeft, top: embeddingRect?.top - tbh }
    positions.mlpUp = { left: mlpRect?.left + scrollLeft, top: mlpRect?.top - tbh }
    positions.mlpDown = { left: mlpDownRect?.left + scrollLeft, top: mlpDownRect?.top - tbh }
    positions.attention = {
      left: attentionRect?.right + scrollLeft,
      top: attentionRect?.top + attentionRect?.height / 2 - tbh,
    }
    positions.softmax = {
      left: softmaxRect?.left + scrollLeft,
      top: softmaxRect?.top - tbh,
    }
  }

  setPosition()

  resizeObserver = new ResizeObserver(() => {
    setPosition()
  })
  const elements = document?.querySelectorAll('.resize-watch')
  elements.forEach((el) => {
	resizeObserver.observe(el)
  })

  // tooltip + weight popover highlighting
  window.addEventListener('mousemove', handleMouseMove)

  const unsubscribe = weightPopover.subscribe((value) => {
    if (!value) {
      removePathHighlight()
      removeAttentionPathHighlight()
      return
    }

    if (value === 'attention') {
      highlightAttentionPath()
    } else if (value === 'softmax') {
      highlightLogitPath()
    } else {
      highlightPath(value)
    }
  })

  return () => {
    mainSection?.removeEventListener('click', handleOutsideClick)
    window.removeEventListener('mousemove', handleMouseMove)
    unsubscribe()
  }
})
</script>

{#if isVisible}
	<div
		class="tooltip-box rounded shadow-lg"
		style="left: {x}px; top: {y}px;"
		in:fade={{ duration: 100 }}
	>
		{$tooltip}
		<Maximize2 />
	</div>
{/if}

{#each popoverConfig as p}
	{#if $weightPopover === p.key}
		<div
			bind:this={popoverEl}
			class="{p.cssClass} weight-popover"
			style={`left:${positions[p.key].left}px;top:${positions[p.key].top}px;`}
			in:fade={{ duration: 300 }}
			role="group"
		>
			<svelte:component this={p.component} />
		</div>
	{/if}
{/each}

<style lang="scss">
	.weight-popover {
		z-index: $POPOVER_INDEX;
		position: absolute;
		width: max-content !important;
	}
	.qkv-weight-popover {
		transform: translateX(1rem);
	}
	.attention-weight-popover {
		transform: translate(1rem, -50%);
	}
	.mlp-weight-popover {
		transform: translateX(calc(-100% - 0.5rem));
	}
	.softmax-weight-popover {
		transform: translateX(calc(-100% + 1rem));
	}
	.tooltip-box {
		z-index: $POPOVER_INDEX;

		background-color: white;
		position: fixed;
		border: 1px solid var(--color-gray-200);
		color: var(--color-gray-600);
		padding: 0.2rem 0.4rem;
		border-radius: 0.4rem;
		pointer-events: none;
		white-space: nowrap;
		font-size: 1rem;
		font-weight: 300;

		display: flex;
		align-items: center;
		gap: 2px;
	}
	:global(.formula) {
		height: 4rem;
		position: relative;
	}
	:global(.formula > div) {
		position: absolute;
		width: 100%;
		top: 0;
	}
	:global(.first-row) {
		transform: translateY(100%);
	}
	:global(.katex-display) {
		margin: 0 !important;
	}
</style>


<script lang="ts">
import { onMount } from 'svelte'
import {
  attentionHeadIdx,
  blockIdx,
  isOnBlockTransition,
  modelMeta,
  rootRem,
  tokens,
  tooltip,
  weightPopover,
} from '~/store'
import { theme } from '~/utils/tailwind-theme'
import { completePage } from '~/utils/textbook/pages/actions'
import { createBackPathMap } from './create-back-paths'
import { createGradients } from './create-gradients'
import { createPathMap } from './create-path-map'
import { drawResidualLines } from './draw-residual'
import { drawSankey } from './draw-sankey'
import { defaultCurveOffset as computeDefaultCurveOffset } from './geometry'

let svgBackEl: SVGSVGElement
let svgEl: SVGSVGElement

let resizeObserver: ResizeObserver
let screenWidth: number

let curveFactor = $derived(Math.floor(screenWidth / 1000) || 1)
let defaultCurveOffset = $derived(computeDefaultCurveOffset(screenWidth))
let backPathMap = $derived(createBackPathMap('.block-steps.main', '.block-steps.next'))
let pathMap = $derived(createPathMap({
  blockIdx: $blockIdx,
  isOnBlockTransition: $isOnBlockTransition,
  tokensLength: $tokens.length,
  modelLayerNum: $modelMeta.layer_num,
  rootRem,
  curveFactor,
  tooltip: tooltip.set,
  weightPopover: weightPopover.set,
  completePage,
}))

const updateSvgs = () => {
  drawSankey({
    svgEl,
    svgBackEl,
    pathMap,
    backPathMap,
    defaultCurveOffset,
  })
  drawResidualLines(svgEl, theme)
}

onMount(() => {
  createGradients(svgEl)

  resizeObserver = new ResizeObserver(updateSvgs)

  const elements = document?.querySelectorAll('.resize-watch')
  elements.forEach((el) => {
    resizeObserver.observe(el)
  })

  const transition = document?.querySelector('.transition-watch') as Element

  resizeObserver.observe(transition)

  const unsubscribeAttnIdx = attentionHeadIdx.subscribe(async () => {
    updateSvgs()
  })

  return () => {
    resizeObserver.disconnect()
    unsubscribeAttnIdx()
  }
})

$effect(() => {
  if ($tokens) {
    updateSvgs()
  }
})
</script>

<svelte:window bind:innerWidth={screenWidth} />

<div bind:clientWidth={screenWidth} class="h-full w-full">
	<svg
		bind:this={svgBackEl}
		id="back"
		class="sankey-back absolute left-0 top-0 h-full w-full"
		style={`z-index:${$modelMeta.attention_head_num - 1};`}
	></svg>
	<svg
		bind:this={svgEl}
		class="sankey-top absolute left-0 top-0 h-full w-full"
		style={`z-index:${$modelMeta.attention_head_num};`}
	></svg>
</div>

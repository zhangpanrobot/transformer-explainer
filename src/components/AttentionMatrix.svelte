<script lang="ts">
import { MoveRight, ZoomIn } from '@lucide/svelte'
import classNames from 'classnames'
import * as d3 from 'd3'
import { getContext, onMount } from 'svelte'
import DaisyTooltip from '~/components/common/DaisyTooltip.svelte'
import Matrix from '~/components/common/Matrix.svelte'
import TextbookTooltip from '~/components/common/TextbookTooltip.svelte'
import Katex from '~/components/Katex.svelte'
import { ATTENTION_OUT } from '~/constants/opacity'
import {
  attentionHeadIdx,
  blockIdx,
  expandedBlock,
  hoveredMatrixCell,
  isExpandOrCollapseRunning,
  modelData,
  rootRem,
  tokens,
} from '~/store'
import { maskArray } from '~/utils/array'
import { gsap } from '~/utils/gsap'
import { theme } from '~/utils/tailwind-theme'
import { highlightAttentionPath, removeAttentionPathHighlight } from '~/utils/textbook/index'
import { completePage } from '~/utils/textbook/pages/actions'

$: placeHolderData = Array($tokens.length)
  .fill(0)
  .map(() => Array($tokens.length).fill(-Infinity))

$: queryKey =
  $modelData?.outputs?.[`block_${$blockIdx}_attn_head_${$attentionHeadIdx}_attn`]?.data ||
  placeHolderData
$: masked =
  $modelData?.outputs?.[`block_${$blockIdx}_attn_head_${$attentionHeadIdx}_attn_masked`]?.data ||
  placeHolderData
$: softmaxed =
  $modelData?.outputs?.[`block_${$blockIdx}_attn_head_${$attentionHeadIdx}_attn_dropout`]?.data ||
  placeHolderData

let factor = 1 //todo
let maxCellSize = 20 * factor
let minCellSize = 10 * factor
$: cellSize = Math.min(
  maxCellSize,
  Math.max((1 / $tokens.length) * rootRem * 6 * factor, minCellSize),
)

let attentionQK: HTMLDivElement
let attentionMask: HTMLDivElement
let attentionSoftmax: HTMLDivElement
let attentionResult: HTMLDivElement

let attentionMatrixWidth = 0

let isExpanded = false

const blockId = getContext('block-id')

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

const onClick = (e: MouseEvent | KeyboardEvent) => {
  e.stopPropagation()
  e.preventDefault()
  completePage('masked-self-attention')

  if (!isExpanded) {
    expandedBlock.set({ id: blockId as string })
  }
}

let expandableEl: HTMLDivElement

function handleOutsideClick(e: MouseEvent) {
  if (isExpanded && !expandableEl.contains(e.target as Node)) {
    expandedBlock.set({ id: null })
  }
}
onMount(() => {
  const mainSection = getContext<{ current: HTMLElement | null }>('main-section')?.current
  mainSection?.addEventListener('click', handleOutsideClick as EventListener)
  return () => {
    mainSection?.removeEventListener('click', handleOutsideClick as EventListener)
  }
})

// animation
let expandTl = gsap.timeline()
let collapseTl = gsap.timeline()

function expand() {
  highlightAttentionPath()

  isExpanded = true
  isExpandOrCollapseRunning.set(true)
  collapseTl.progress(1)

  const keyPaths = document.querySelectorAll('div.sankey g.attention path.key-to-attention')
  const queryPaths = document.querySelectorAll('div.sankey g.attention path.query-to-attention')
  const outPaths = document.querySelectorAll('div.sankey g.attention path.to-attention-out')

  ;([...keyPaths, ...queryPaths] as SVGPathElement[]).forEach((path) => {
    const length = path.getTotalLength()
    path.style.strokeDasharray = length.toString()
    path.style.strokeDashoffset = length.toString()
  })

  const QKDuration = 1.2
  const stagger = Number((QKDuration / $tokens.length).toFixed(2))

  expandTl
    .set([attentionMask.querySelector('.prev'), attentionSoftmax.querySelector('.prev')], {
      opacity: 1,
    })
    .set([attentionMask.querySelector('.main'), attentionSoftmax.querySelector('.main')], {
      opacity: 0,
    })
  expandTl.set(outPaths, { opacity: 0 })

  expandTl.to(attentionResult, {
    opacity: 0,
    display: 'none',
    duration: 0.2,
  })

  // show QK
  expandTl
    .set(attentionQK, {
      width: 'auto',
      display: 'flex',
      opacity: 0,
    })
    .to(attentionQK, {
      opacity: 1,
      duration: 0.5,
    })
    .to(keyPaths, {
      strokeDashoffset: 0,
      stagger,
      duration: QKDuration,
      ease: 'power2.out',
    })
    .to(
      queryPaths,
      {
        strokeDashoffset: 0,
        stagger,
        duration: QKDuration,
        ease: 'power2.out',
      },
      '<',
    )
    .from(
      attentionQK.querySelectorAll('svg circle'),
      {
        scale: 0,
        transformOrigin: '50% 50%',
        opacity: 0,
        delay: QKDuration / $tokens.length,
        stagger: Number((QKDuration / $tokens.length ** 2).toFixed(2)),
        ease: 'power2.out',
        duration: QKDuration,
      },
      '<',
    )

  // show Masked
  expandTl
    .set(attentionMask, { width: 0, x: attentionMatrixWidth * -1, opacity: 0 })
    .to(attentionMask, {
      opacity: 1,
      display: 'flex',
      width: attentionMatrixWidth,
      x: 0,
      duration: 0.5,
    })
    .to(attentionMask.querySelector('.prev'), {
      opacity: 0,
      duration: 1,
    })
    .to(
      attentionMask.querySelector('.main'),
      {
        opacity: 1,
        duration: 1,
      },
      '<',
    )

  // show Softmaxed
  expandTl
    .set(attentionSoftmax, { width: 0, x: attentionMatrixWidth * -1, opacity: 0 })
    .to(attentionSoftmax, {
      opacity: 1,
      display: 'flex',
      width: attentionMatrixWidth,
      x: 0,
      duration: 0.4,
    })
    .to(attentionSoftmax.querySelector('.prev'), {
      opacity: 0,
      duration: 1,
    })
    .to(
      attentionSoftmax.querySelector('.main'),
      {
        opacity: 1,
        duration: 1,
      },
      '<',
    )

  expandTl.to(outPaths, {
    opacity: ATTENTION_OUT,
    onComplete: () => {
      isExpandOrCollapseRunning.set(false)
    },
  })
}

function collapse() {
  removeAttentionPathHighlight()
  isExpanded = false
  isExpandOrCollapseRunning.set(true)
  expandTl.progress(1)
  collapseTl.to([attentionQK, attentionMask, attentionSoftmax], {
    opacity: 0,
    display: 'none',
    width: 0,
    duration: 0.5,
  })

  collapseTl.to(
    attentionResult,
    {
      opacity: 1,
      display: 'flex',
      duration: 0.5,
      onComplete: () => {
        isExpandOrCollapseRunning.set(false)
      },
    },
    0,
  )
}

// color scale
$: qkColorScaleDomain = d3.extent(queryKey.flat())
$: qkColorScale = (d: number) => {
  return d3
    .scaleLinear<string>()
    .domain(qkColorScaleDomain as [number, number])
    .range(['white', theme.colors.purple[700]])(d)
}

const maskedColorScale = (d: number) => {
  return d3.scaleLinear<string>().domain([-3, 3]).range(['white', theme.colors.purple[700]])(d)
}

const softmaxColorScale = (d: number) => {
  return d3.interpolate('white', theme.colors.purple[700])(d)
}

const onMouseOverCell = (d: Cell, el?: SVGRectElement | d3.BaseType) => {
  const rowIdx = d.rowIndex
  const colIdx = d.colIndex
  hoveredMatrixCell.set({ row: rowIdx, col: colIdx })
  if (el && Number.isFinite(d.cell)) {
    d3.select(el).attr('stroke', theme.colors.gray[400])
  }
}

const onMouseOutCell = (d: Cell, el?: SVGRectElement | d3.BaseType) => {
  hoveredMatrixCell.set({ row: null, col: null })
  if (el && Number.isFinite(d.cell)) {
    d3.select(el).attr('stroke', !Number.isFinite(d.cell) ? 'none' : theme.colors.gray[200])
  }
}

const showTooltip = (d: number) => {
  if (!Number.isFinite(d)) return
  return d.toFixed(2)
}
</script>

<div
	class="flex items-center gap-8 px-5"
	style={`--attention-matrix-width: ${attentionMatrixWidth}px;`}
>
	<!-- QK -->
	<div
		role="none"
		class={classNames('attention-matrix-container relative flex', {
			active: isExpanded
		})}
		bind:this={expandableEl}
		onclick={onClick}
		onkeydown={onClick}
	>
		<div
			class={classNames('attention-matrix attention-qk flex flex-col items-center', {
				'attention-initial': isExpanded
			})}
			bind:this={attentionQK}
		>
			<Matrix
				className="main"
				data={queryKey}
				showSize={false}
				cellHeight={cellSize}
				cellWidth={cellSize}
				rowGap={3}
				colGap={3}
				shape={'circle'}
				colorScale={qkColorScale}
				{onMouseOverCell}
				{onMouseOutCell}
				{showTooltip}
			/>
			<TextbookTooltip id="masked-self-attention">
				<div class="matrix-label">Dot product</div>
			</TextbookTooltip>

			<DaisyTooltip class="popover tooltip">
				<Katex math={'Q \\cdot K^T'}></Katex>
			</DaisyTooltip>
			<div class="color-scale">
				<span class="val">{qkColorScaleDomain[0]?.toFixed(1)}</span>
				<div class="bar"></div>
				<span class="val">{qkColorScaleDomain[1]?.toFixed(1)}</span>
			</div>
		</div>
		<div
			class="attention-matrix attention-mask flex flex-col items-center"
			bind:this={attentionMask}
		>
			<MoveRight />
			<div>
				<Matrix
					className="prev absolute top-0 left-0 pointer-events-none"
					data={queryKey}
					showSize={false}
					cellHeight={cellSize}
					cellWidth={cellSize}
					rowGap={3}
					colGap={3}
					shape={'circle'}
					colorScale={qkColorScale}
					{onMouseOverCell}
					{onMouseOutCell}
					{showTooltip}
				/>
				<Matrix
					className="main opacity-0"
					data={maskArray(masked)}
					showSize={false}
					cellHeight={cellSize}
					cellWidth={cellSize}
					rowGap={3}
					colGap={3}
					shape={'circle'}
					colorScale={maskedColorScale}
					{onMouseOverCell}
					{onMouseOutCell}
					{showTooltip}
				/>
			</div>
			<TextbookTooltip id="masked-self-attention">
				<div class="matrix-label">Scaling · Mask</div>
			</TextbookTooltip>

			<DaisyTooltip class="popover tooltip">
				<Katex math={'\\frac{QK^T}{\\sqrt{d_k}} + M'}></Katex>
			</DaisyTooltip>
			<div class="color-scale">
				<span class="val">-3.0</span>
				<div class="bar"></div>
				<span class="val">3.0</span>
			</div>
		</div>

		<!-- Softmax -->
		<div
			class={classNames('attention-matrix attention-softmax flex flex-col items-center', {
				'attention-out': isExpanded
			})}
			bind:this={attentionSoftmax}
		>
			<MoveRight />
			<div>
				<Matrix
					className="prev absolute top-0 left-0  pointer-events-none"
					data={maskArray(masked)}
					showSize={false}
					cellHeight={cellSize}
					cellWidth={cellSize}
					rowGap={3}
					colGap={3}
					shape={'circle'}
					colorScale={maskedColorScale}
					{onMouseOverCell}
					{onMouseOutCell}
					{showTooltip}
				/>
				<Matrix
					className="main opacity-0"
					data={maskArray(softmaxed)}
					showSize={false}
					cellHeight={cellSize}
					cellWidth={cellSize}
					rowGap={3}
					colGap={3}
					shape={'circle'}
					colorScale={softmaxColorScale}
					{onMouseOverCell}
					{onMouseOutCell}
					{showTooltip}
				/>
			</div>

			<TextbookTooltip id="masked-self-attention">
				<div class="matrix-label">Softmax</div>
			</TextbookTooltip>
			<DaisyTooltip class="popover tooltip">
				<Katex math={'\\text{softmax}(\\frac{QK^T}{\\sqrt{d_k}} + M)'}></Katex>
			</DaisyTooltip>
			<div class="color-scale">
				<span class="val">0.0</span>
				<div class="bar"></div>
				<span class="val">1.0</span>
			</div>
		</div>
		<div
			class={classNames('attention-matrix attention-result flex flex-col items-center', {
				'attention-initial': !isExpanded,
				'attention-out': !isExpanded
			})}
			bind:this={attentionResult}
			bind:offsetWidth={attentionMatrixWidth}
		>
			<Matrix
				className="main"
				data={maskArray(softmaxed)}
				showSize={false}
				cellHeight={cellSize}
				cellWidth={cellSize}
				rowGap={3}
				colGap={3}
				shape={'circle'}
				colorScale={softmaxColorScale}
				{onMouseOverCell}
				{onMouseOutCell}
				{showTooltip}
			/>

			<div class="matrix-label flex items-center gap-1">
				Attention <ZoomIn />
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.attention-matrix-container {
		cursor: pointer;
		border-radius: 0.5rem;
		transition: 0.2s background-color;
		gap: 1rem;
		padding: 1rem;
	}

	.attention-matrix-container {
		.attention-qk,
		.attention-mask,
		.attention-softmax {
			display: none;
		}

		:global(.matrix) {
			padding: 0.5rem;
		}
		.matrix-label {
			white-space: nowrap;
			color: var(--color-gray-400);
		}
		.attention-result {
			.matrix-label:hover {
				color: var(--color-gray-600);
			}
		}
		.arrow {
			position: absolute;
			left: -1rem;
			top: calc(var(--attention-matrix-width) / 2 - 0.5rem);
			width: 1.2rem;
			height: 1.2rem;
			color: var(--color-gray-300);
		}

		.attention-matrix {
			position: relative;
		}
	}
	.color-scale {
		position: absolute;
		bottom: -1.2rem;
		height: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 0 1rem;
		gap: 0.2rem;

		.bar {
			height: 0.4rem;
			flex: 1 0 0;
			border: 1px solid var(--color-gray-200);
			background: linear-gradient(90deg, white 0%, var(--color-purple-700) 100%);
		}
		.val {
			flex-shrink: 0;
			font-family: monospace;
			font-size: 0.7rem;
			color: var(--color-gray-600);
		}
	}
</style>

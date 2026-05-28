<script lang="ts">
import classNames from 'classnames'
import MatrixSvg from './MatrixSvg.svelte'

type Data = (number | null)[][]

interface Props {
  data: Data
  showSize?: boolean | undefined | string
  cellHeight?: number
  cellWidth?: number
  rowGap?: number
  colGap?: number
  groupBy?: 'row' | 'col'
  shape?: 'circle' | 'rect'
  colorScale?: string | ((t: number, i?: number) => any) | undefined
  className?: string | undefined
  title?: string | undefined
  titlePos?: 't' | 'b' | undefined
  transpose?: boolean
  highlightRow?: number | undefined
  highlightCol?: number | undefined
  onMouseOverCell?: (cell: Cell, el?: SVGRectElement | d3.BaseType) => void
  onMouseOutCell?: (cell: Cell, el?: SVGRectElement | d3.BaseType) => void
  onMouseOutSvg?: (matrixData: Data, el?: SVGRectElement | d3.BaseType) => void
  showTooltip?: (value: number) => string | undefined
}

let {
  data,
  showSize = true,
  cellHeight = 24,
  cellWidth = 24,
  rowGap = 2,
  colGap = 0,
  groupBy = 'row',
  shape = 'rect',
  colorScale = undefined,
  className = undefined,
  title = undefined,
  titlePos = 't',
  transpose = false,
  highlightRow = undefined,
  highlightCol = undefined,
  onMouseOverCell,
  onMouseOutCell,
  onMouseOutSvg,
  showTooltip,
}: Props = $props()

let rowLen: number = $state(0)
let dimension: number = $state(0)

$effect(() => {
  rowLen = data.length
  dimension = data[0]?.length || 0
})

let matrixSvgProps = $derived({
  data,
  cellHeight,
  cellWidth,
  rowLen,
  dimension,
  rowGap,
  colGap,
  transpose,
  groupBy,
  shape,
  colorScale,
  onMouseOverCell,
  onMouseOutCell,
  onMouseOutSvg,
  showTooltip,
  highlightRow,
  highlightCol,
})

let isDataReady = $derived(data.length > 0)
</script>

<div
	data-id="matrix"
	class={classNames(
		className,
		"matrix-container flex flex-col items-center gap-1 leading-none",
	)}
>
	{#if title && titlePos === "t"}
		<div class="leading-none">{title}</div>
	{/if}
	<div class={classNames("matrix inline-block  align-top")}>
		<slot name="inner-title" />
		{#if isDataReady}
			<MatrixSvg {...matrixSvgProps} />
		{/if}
	</div>
	{#if title || showSize}
		<div class="flex flex-col items-center gap-0.5">
			{#if title && titlePos === "b"}
				<div class="whitespace-nowrap leading-none text-gray-500">
					{title}
				</div>
			{/if}
			{#if showSize}
				{#if typeof showSize === "string"}
					<div class="whitespace-nowrap leading-none text-gray-500">
						{showSize}
					</div>{:else}
					<div class="whitespace-nowrap leading-none text-gray-500">
						({rowLen}, {dimension})
					</div>
				{/if}
			{/if}
		</div>
	{/if}
</div>
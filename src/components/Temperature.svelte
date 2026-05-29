<script lang="ts">
import { temperature } from '~/store'
import { completePage } from '~/utils/textbook/pages/actions'
import TextbookTooltip from './common/TextbookTooltip.svelte'

let { disabled = false }: { disabled?: boolean } = $props()
// TEMPERATURE
let temperatureIndex = $state(6) // Default to the value corresponding to 0.8 in the array
const temperatureArray = [
  // 0.05, 0.1, // error in Math.exp()
  0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0,
]

let temperatureTemp = $derived(temperatureArray[temperatureIndex])
$effect(() => {
  temperature.set(temperatureTemp)
})
</script>

<div class="temperature-input flex shrink-0 flex-col items-center justify-between h-full">
	<div class="temperature-text flex items-center justify-center gap-[2px] shrink-0 w-full">
		<TextbookTooltip id="temperature">
			<div>Temperature</div></TextbookTooltip
		>
	</div>
	<div class="slider-container flex items-center w-28">
		<input
			{disabled}
			type="range"
			class="range range-xs"
			min={0}
			max={temperatureArray.length - 1}
			step={1}
			bind:value={temperatureIndex}
			onchange={(e) => {
				e.preventDefault();
				e.stopPropagation();
				completePage('temperature');
			}}
		/>
		<div class="value">
			<p>{temperatureTemp}</p>
		</div>
	</div>
</div>

<style lang="scss">
	.temperature-text {
		height: 1rem;
		white-space: nowrap;
		flex-shrink: 0;
		font-size: 0.9rem;
		line-height: 0;
		color: var(--color-gray-600);
	}

	.value {
		white-space: nowrap;
		flex-shrink: 0;
		font-size: 0.9rem;
		line-height: 0;
		font-family: monospace;
		color: var(--color-gray-800);
		margin-left: 0.5rem;
	}
</style>
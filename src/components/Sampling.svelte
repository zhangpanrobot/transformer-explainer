<script lang="ts">
import { sampling } from '~/store'
import { completePage } from '~/utils/textbook/pages/actions'
import TextbookTooltip from './common/TextbookTooltip.svelte'

let { disabled = false }: { disabled?: boolean } = $props()

let samplingValMax = $derived($sampling.type === 'top-k' ? 50 : 1)
let samplingValMin = $derived($sampling.type === 'top-k' ? 1 : 0.1)
let samplingValStep = $derived($sampling.type === 'top-k' ? 1 : 0.1)
</script>

<div class="sampling-input flex shrink-0 flex-col items-center justify-between h-full">
	<div class="sampling-type">
		<div class="title flex items-center gap-[2px]">
			<TextbookTooltip id="sampling">
				<div>Sampling</div></TextbookTooltip
			>
		</div>
		<div class="sampling-type-input flex">
			<label class={`type-btn ${disabled ? 'disabled' : ''} inline-flex items-center gap-1 cursor-pointer`}>
				<input
					type="radio"
					class="radio radio-xs checked:bg-purple-500"
					name="sampling-type"
					value="top-k"
					checked={$sampling.type === 'top-k'}
					{disabled}
					onclick={(e) => {
						e.stopPropagation();
					}}
					onchange={(e) => {
						(e.target as HTMLInputElement).checked && sampling.set({ type: 'top-k', value: 5 });
					}}
				/>
				Top-k
			</label>
			<label class={`type-btn ${disabled ? 'disabled' : ''} inline-flex items-center gap-1 cursor-pointer`}>
				<input
					type="radio"
					class="radio radio-xs checked:bg-purple-500"
					name="sampling-type"
					value="top-p"
					checked={$sampling.type === 'top-p'}
					{disabled}
					onclick={(e) => {
						e.stopPropagation();
					}}
					onchange={(e) => {
						(e.target as HTMLInputElement).checked && sampling.set({ type: 'top-p', value: 0.5 });
					}}
				/>
				Top-p
			</label>
		</div>
	</div>
	<div class="slider-container flex items-center w-28">
		<input
			{disabled}
			type="range"
			class="range range-xs"
			min={samplingValMin}
			max={samplingValMax}
			step={samplingValStep}
			bind:value={$sampling.value}
			onclick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				completePage('sampling');
			}}
		/>
		<div class="value">
			<p>{`${$sampling.type === 'top-k' ? 'k' : 'p'}=${$sampling.value}`}</p>
		</div>
	</div>
</div>

<style lang="scss">
	.sampling-type {
		display: flex;
		gap: 0.5rem;
		height: 1rem;
	}
	.sampling-type-input {
		display: flex;
		gap: 0.5rem;
	}

	:global(.type-btn) {
		font-size: 0.9rem;
		cursor: pointer;
		color: var(--color-gray-900);
		font-weight: 400;
		line-height: 1.4;
	}
	:global(.type-btn.disabled) {
		cursor: not-allowed;
	}
	:global(.type-btn input) {
		width: 0.6rem;
		height: 0.6rem;
		margin-inline-end: 0.2rem;
		cursor: pointer;

		&:checked {
			background-size: 0.6rem 0.6rem;
		}
		&:focus {
			outline: none;
			box-shadow: none;
		}
		&:disabled {
			cursor: not-allowed;
		}
	}
	.title {
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
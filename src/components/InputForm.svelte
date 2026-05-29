<script lang="ts">
import { ChevronDown } from '@lucide/svelte'
import classNames from 'classnames'
import {
  expandedBlock,
  inputText,
  inputTextExample,
  isFetchingModel,
  isLoaded,
  isModelRunning,
  predictedToken,
  selectedExampleIdx,
  weightPopover,
} from '~/store'
import { completeCurrentAnimation } from '~/utils/animation/flow'
import { completePage } from '~/utils/textbook/pages/actions'
import Sampling from './Sampling.svelte'
import Temperature from './Temperature.svelte'

let inputRef: HTMLDivElement
let predictRef: HTMLDivElement
let dropdownDetails: HTMLDetailsElement

$: inputTextTemp = $inputText || ''

$: predictedTokenTemp = $predictedToken?.token || ''

const wordLimit = 12
$: exceedLimit = inputTextTemp.split(' ').length >= wordLimit

// Text input
const onFocusInput = () => {
  let formattedString = (inputTextTemp + predictedTokenTemp).replace(/[\s\n]+/g, ' ')

  inputTextTemp = formattedString

  // set predicted to empty
  predictedTokenTemp = ''
  // set input box text
  inputRef.innerText = inputTextTemp
}

const onInput = () => {
  inputTextTemp = inputRef.innerText
}

const handleSubmit = () => {
  // Complete any running animation before starting new generation
  completeCurrentAnimation()

  setTimeout(() => {
    onFocusInput()
    completePage('how-transformers-work')

    inputText.set(inputTextTemp)
  }, 0)
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    if (disabled || exceedLimit) return
    handleSubmit()
    return
  }
}

// Example select box
const onSelectExample = (d: string, i: number) => {
  if ($isFetchingModel) {
    completePage('how-transformers-work')
  }

  if (dropdownDetails) dropdownDetails.open = false

  selectedExampleIdx.set(i)
  predictedTokenTemp = ''

  inputTextTemp = d
  inputRef.innerText = inputTextTemp
  inputText.update((prev) => {
    if (prev === d.trim()) {
      return `${d} `
    }
    return d.trim()
  })
}

const moveCursorToEnd = (element: HTMLElement) => {
  const range = document.createRange()
  const sel = window.getSelection()
  range.selectNodeContents(element)
  range.collapse(false)
  sel?.removeAllRanges()
  sel?.addRange(range)
  element.focus()
}

$: isLoading = $isFetchingModel || $isModelRunning
$: disabled =
  $isFetchingModel ||
  // $isModelRunning ||
  $expandedBlock.id !== null ||
  !!$weightPopover
$: selectDisabled = $isModelRunning || $expandedBlock.id !== null || !!$weightPopover
$: parameterDisabled = !!$weightPopover
</script>

<div class="input-area">
	<form class="input-form">
		<div class="join input-btn-group">
			<details class="dropdown join-item" bind:this={dropdownDetails}>
				<summary
					class:selectDisabled
					class="select-button"
					aria-disabled={selectDisabled}
				>
					Examples<ChevronDown class="pointer-events-none h-4 w-4 text-gray-500" />
				</summary>
				<ul class="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
					{#each inputTextExample as text, index}
						<li><button
							class={$selectedExampleIdx === index ? 'active' : ''}
							onclick={() => {
								onSelectExample(text, index);
							}}>{text}</button></li>
					{/each}
				</ul>
			</details>

			<div
				class="input-container"
				class:disabled
				role="none"
				onkeydown={(e) => {
					e.stopPropagation();
					inputRef.focus();
				}}
				onclick={(e) => {
					e.stopPropagation();
					inputRef.focus();
				}}
			>
				<div class={`editable ${!$isModelRunning ? 'w-full' : ''}`}>
					<div
						bind:this={inputRef}
						contenteditable={!disabled}
						class="text-box"
						placeholder="Test your own input text"
						onfocus={onFocusInput}
						oninput={onInput}
						onkeydown={handleKeyDown}
						onclick={(e) => {
							e.stopPropagation();
						}}
					>
						{inputTextTemp}
					</div>
					{#if !$isModelRunning}
						<div
							bind:this={predictRef}
							class="predicted"
							role="none"
							onclick={(e) => {
								e.stopPropagation();
								onFocusInput();
								inputRef.focus();
								moveCursorToEnd(inputRef);
							}}
						>
							<span>{predictedTokenTemp}</span>
						</div>
					{/if}
				</div>
				{#if $isModelRunning}
					<span class="loading loading-dots loading-xs"></span>
				{/if}
				{#if $isLoaded && $isFetchingModel}
					<span class="helper-text"
						>Try the examples while GPT-2 model is being downloaded (600MB)</span
					>
				{:else if exceedLimit}
					<span class="helper-text">You can enter up to {wordLimit} words.</span>
				{/if}
			</div>
		</div>
		<button
			disabled={disabled || exceedLimit || exceedLimit}
			class={classNames('generate-button rounded-lg text-center text-sm shadow-sm', {
				disabled: disabled || exceedLimit,
				active: !(disabled || exceedLimit)
			})}
			type="submit"
			onclick={handleSubmit}
		>
			Generate
		</button>
	</form>
	<div class="parameters">
		<Temperature disabled={parameterDisabled} />
		<Sampling disabled={parameterDisabled} />
	</div>
</div>

<style lang="scss">
	.parameters {
		display: flex;
		gap: 1rem;
	}
	.input-area {
		width: 100%;
		flex-shrink: 0;
		display: flex;
		gap: 1rem;
		padding-left: 1rem;
		padding-right: 1.25rem;

		.input-form {
			width: 100%;
			flex: 1 0 0;
			display: flex;
			align-items: center;
			gap: 0.5rem;

			:global(.input-btn-group) {
				flex: 1 0 0;
				display: flex;
			}
		}
	}
	.input-container {
		position: relative;
		display: flex;
		flex: 1 0 0;
		align-items: center;

		border: 1px solid var(--color-gray-300);
		color: var(--color-gray-900);
		border-left: none;
		border-start-end-radius: 0.5rem;
		border-end-end-radius: 0.5rem;
		font-size: 1rem;
		line-height: 1rem;
		padding: 0.5rem;
		white-space: pre-wrap;
		gap: 0.3rem;

		width: 10px; // to keep input box width

		.editable {
			overflow-y: hidden;
			justify-content: end; // to show the last word

			display: flex;
			align-items: center;
			overflow-x: hidden;
			white-space: nowrap;

			.text-box {
				white-space: nowrap;
				br {
					display: none;
				}

				&:focus {
					outline: none;
				}
			}
			.predicted {
				flex: 1 0 0;
				color: var(--predicted-color);
				font-weight: 600;
				span {
					white-space: pre;
				}
			}
		}

		&.disabled {
			cursor: not-allowed;
		}

		.loading {
			flex-shrink: 0;
		}
	}

	summary.select-button {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		flex-shrink: 0;
		font-size: 0.9rem;
		cursor: pointer;
		list-style: none;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-gray-300);
		color: var(--color-gray-900);
		&[aria-disabled="true"] {
			pointer-events: none;
			opacity: 0.5;
			cursor: not-allowed;
		}
		&:hover {
			background-color: var(--color-gray-100);
		}
		&:focus {
			outline: none;
		}
		&.disabled {
			cursor: not-allowed;
		}
	}
	:global(.example-dropdown) {
		:global(.active) {
			background-color: var(--color-gray-100) !important;
		}
	}
	.helper-text {
		position: absolute;
		bottom: 0;
		right: 0;
		padding: 0.3rem 0;
		transform: translate(0, 100%);
		color: var(--color-gray-400);
		font-size: 0.9rem;
	}
	:global(.generate-button) {
		padding: 0.4rem 0.8rem;
		border: 1px solid var(--color-gray-300);
		color: var(--color-gray-900);
		transition: all 0.2s;
		flex-shrink: 0;
	}
	:global(.generate-button.active) {
		&:hover {
			border: 1px solid var(--predicted-color);
			color: var(--predicted-color);
		}
	}
	:global(.generate-button.disabled) {
		opacity: 1;
		background-color: var(--color-gray-100);
		color: var(--color-gray-400);
		cursor: not-allowed;
	}

	:global(.generate-button):focus {
		border: 1px solid var(--predicted-color);
		color: var(--predicted-color);
	}
</style>

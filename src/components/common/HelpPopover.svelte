<script lang="ts">
import type { Snippet } from 'svelte'
import { onClickReadMore } from '~/utils/event'
import DaisyPopover from './DaisyPopover.svelte'

let {
  id,
  placement = 'bottom',
  goTo = undefined,
  textbook = undefined,
  children,
}: {
  id: string
  placement?: string
  goTo?: string | undefined
  textbook?: string | undefined
  children?: Snippet
} = $props()
let triggerEl: SVGElement | undefined = $state(undefined)
</script>

<div {id} class="help">
	<CircleQuestionMark bind:this={triggerEl}/>
</div>
<DaisyPopover
	triggerElements={triggerEl ? [triggerEl] : []}
	{placement}
	class="help popover"
	><div class="help-content">
		{@render children?.()}
		{#if textbook}
			<div class="textbook-link">
				<a
					href={`https://transformer-explainer.github.io/textbook/${textbook}`}
					target="_blank"
					class="text-blue-600 hover:underline"
				>
					Open Textbook
				</a>
			</div>
		{/if}
		{#if goTo}
			<div
				class="more-btn mt-1 text-blue-600 hover:underline"
				onclick={(e) => onClickReadMore(e, goTo)}
			>
				Read more
			</div>
		{/if}
	</div></DaisyPopover>

<style lang="scss">
	.help-content {
		text-align: left !important;
		white-space: pre;
		line-height: 1.2;
		font-weight: 400;
		font-size: 0.8rem;
	}
	.more-btn {
		cursor: pointer;
	}
</style>


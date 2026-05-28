<script lang="ts">
import classNames from 'classnames'
import type { Snippet } from 'svelte'
import { onClickReadMore } from '~/utils/event'
import DaisyPopover from '../common/DaisyPopover.svelte'

let {
  className,
  placement = 'right',
  title,
  goTo,
  reference,
  children,
}: {
  offset?: any
  className?: any
  triggeredBy?: any
  trigger?: string
  placement?: string
  title?: any
  goTo?: any
  reference?: any
  children?: Snippet
} = $props()

</script>

<!-- bug: {triggeredBy} prop triggers show event twice -->
<DaisyPopover
	class={classNames('popover text-sm', className)}
	{title}
	{placement}
	{reference}
	offset={1}
>
	<div class="content">
		{@render children?.()}
		{#if goTo}
			<div
				class="more-btn mt-1 text-blue-600 hover:underline"
				onclick={(e) =>
					onClickReadMore(e, goTo)}
				data-click={`read-more-btn-${className}`}
			>
				Read more
			</div>
		{/if}
	</div></DaisyPopover
>

<style lang="scss">
	.more-btn {
		cursor: pointer;
	}
</style>

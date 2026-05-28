<script lang="ts">
import CommonPopover from './CommonPopover.svelte'

let {
  reference = undefined,
  offset = undefined,
  triggeredBy = undefined,
  trigger = 'hover',
  placement = 'right',
}: {
  reference?: any
  offset?: any
  className?: any
  triggeredBy?: any
  trigger?: any
  placement?: any
} = $props()
</script>

<CommonPopover
	className="residual-popover"
	title="Residual Connection"
	{offset}
	{triggeredBy}
	{trigger}
	{placement}
	{reference}
	goTo="article-residual"
>
	<div class="residual-content">
		Adds layer input to output to help preserve information.
	</div></CommonPopover
>

<style lang="scss">
	.residual-content {
		width: 12rem;
	}
</style>

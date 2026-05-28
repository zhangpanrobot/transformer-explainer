<script lang="ts">
import CommonPopover from './CommonPopover.svelte'

let {
  offset = undefined,
  className = undefined,
  triggeredBy = undefined,
  trigger = 'hover',
  placement = 'right',
}: { offset?: any; className?: any; triggeredBy?: any; trigger?: any; placement?: any } = $props()
</script>

<CommonPopover
	className="dropout-popover"
	title="Dropout"
	{offset}
	{triggeredBy}
	{trigger}
	{placement}
	goTo="article-dropout"
>
	<div class="dropout-content">
		Disables randomly selected neurons. Used only during training.
	</div></CommonPopover
>

<style lang="scss">
	.dropout-content {
		width: 12rem;
	}
</style>

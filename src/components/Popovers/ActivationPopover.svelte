<script lang="ts">
	import CommonPopover from './CommonPopover.svelte';
let { offset = undefined, className = undefined, triggeredBy = undefined, trigger = 'hover', placement = 'right' }: { offset?: any; className?: any; triggeredBy?: any; trigger?: any; placement?: any } = $props();
</script>

<CommonPopover
	className="activation-popover"
	title="GELU Activation"
	{offset}
	{triggeredBy}
	{trigger}
	{placement}
	goTo="article-activation"
>
	<div class="activation-content">
		Applies non-linear transformation to linearly transformed output to learn complex patterns.
	</div></CommonPopover
>

<style>
	.activation-content {
		width: 12rem;
	}
</style>

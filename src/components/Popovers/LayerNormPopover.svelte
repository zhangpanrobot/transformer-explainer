<script lang="ts">
	import CommonPopover from "./CommonPopover.svelte";

	let {
		offset = undefined,
		triggeredBy = undefined,
		trigger = "hover",
		placement = "right",
	}: {
		offset?: any;
		className?: any;
		triggeredBy?: any;
		trigger?: any;
		placement?: any;
	} = $props();
</script>

<CommonPopover
	className="ln-popover"
	title="Layer Normalization"
	{offset}
	{triggeredBy}
	{trigger}
	{placement}
	goTo="article-ln"
>
	<div class="ln-content">
		Normalizes layer input to have a standard distribution for stability.
	</div></CommonPopover
>

<style lang="scss">
	.ln-content {
		width: 12rem;
	}
</style>

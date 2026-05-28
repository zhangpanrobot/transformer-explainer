<script>
	import { page } from '$app/stores';
	import InputForm from '~/components/InputForm.svelte';
let { isActive } = $props();


	// Check if current page is about page
	let isAboutPage = $derived($page.url.pathname === '/about');
</script>

<div class="top-bar flex w-full items-center gap-4 px-10 py-2 pb-3" class:active={isActive}>
	<div class="logo text-bold text-gray-700" data-click="logo">
		T<span class="small">RANSFORMER</span> E<span class="small">XPLAINER</span>
	</div>
	<div class="inputs flex grow items-center">
		<div class="input-wrapper w-full" class:active={isActive}>
			{#if !isAboutPage}
				<InputForm />
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.top-bar {
		background: linear-gradient(to bottom, rgba(255, 255, 255, 1) 60%, rgba(255, 255, 255, 0) 100%);
		.input-wrapper {
			&.active {
				opacity: 1;
				pointer-events: initial;
			}
			opacity: 0;
			transition: opacity 0.2s;
			pointer-events: none;
		}
		.logo {
			flex-shrink: 0;
			white-space: nowrap;
			font-family: 'Jersey 10', sans-serif;

			font-optical-sizing: auto;
			font-style: normal;

			font-size: 2rem;

			background: linear-gradient(
				to right,
				var(--color-blue-500) 0%,
				var(--color-purple-500) 60%
			);
			background-clip: text;
			-webkit-text-fill-color: transparent;

			.small {
				font-size: 1.8rem;
			}
		}
		.icons {
			flex-shrink: 0;
			svg {
				fill: var(--color-gray-600);
			}
		}
	}
</style>

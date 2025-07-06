<script lang="ts">
	interface Props {
		onClick?: undefined | (() => Promise<string>);
		size?: number;
	}

	let {
		onClick = undefined,
		size = 24,
	}: Props = $props();
	
	let sizePx = `${size}px`
	let disabled = onClick == undefined;
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button disabled={disabled} onclick={onClick}>
	<svg style:width={sizePx} style:height={sizePx} viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke="currentColor" class="size-6">
		<path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
	</svg>
</button>

<style>
	button {
		background: none;
	}
</style>

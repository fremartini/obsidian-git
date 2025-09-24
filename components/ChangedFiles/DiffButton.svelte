<script lang="ts">
	interface Props {
		onClick?: undefined | (() => void);
		size?: number;
	}

	let {
		onClick = undefined,
		size = 24,
	}: Props = $props();
	
	let sizePx = `${size}px`
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button onclick={onClick}>
	<svg style:width={sizePx} style:height={sizePx} viewBox="0 0 {size} {size}" fill="none" stroke="currentColor" class="size-6">
		<path opacity="0.1" d="M9 6C9 7.65685 7.65685 9 6 9C4.34315 9 3 7.65685 3 6C3 4.34315 4.34315 3 6 3C7.65685 3 9 4.34315 9 6Z" fill="#a19f9f"/>
		<path opacity="0.1" d="M21 18C21 19.6569 19.6569 21 18 21C16.3431 21 15 19.6569 15 18C15 16.3431 16.3431 15 18 15C19.6569 15 21 16.3431 21 18Z" fill="#a19f9f"/>
		<path d="M9 6C9 7.65685 7.65685 9 6 9C4.34315 9 3 7.65685 3 6C3 4.34315 4.34315 3 6 3C7.65685 3 9 4.34315 9 6Z" stroke="#a19f9f" stroke-width="2"/>
		<path d="M21 18C21 19.6569 19.6569 21 18 21C16.3431 21 15 19.6569 15 18C15 16.3431 16.3431 15 18 15C19.6569 15 21 16.3431 21 18Z" stroke="#a19f9f" stroke-width="2"/>
		<path d="M15 3L12.0605 5.93945V5.93945C12.0271 5.97289 12.0271 6.02711 12.0605 6.06055V6.06055L15 9" stroke="#a19f9f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
		<path d="M9 21L11.9473 18.0527V18.0527C11.9764 18.0236 11.9764 17.9764 11.9473 17.9473V17.9473L9 15" stroke="#a19f9f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
		<path d="M12 6C14.8284 6 16.2426 6 17.1213 6.87868C18 7.75736 18 9.17157 18 12V15" stroke="#a19f9f" stroke-width="2"/>
		<path d="M12 18C9.17157 18 7.75736 18 6.87868 17.1213C6 16.2426 6 14.8284 6 12L6 9" stroke="#a19f9f" stroke-width="2"/>
	</svg>
</button>

<style>
	button {
		background: none;
	}
</style>

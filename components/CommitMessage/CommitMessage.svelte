<script lang="ts">
	import LoadingIndicator from "./LoadingIndicator.svelte";
	import ReloadIcon from "./ReloadButton.svelte";

	interface Props {
		commitMessage: Promise<string>;
		refresh: () => Promise<string>
	}

	let {
		commitMessage,
		refresh,
	}: Props = $props();
</script>

<div class="container">
		<p style="margin: 0em 2em 0em 0em;">Commit message</p>
		{#await commitMessage}
			<LoadingIndicator/>
		{:then msg}
			<input value={msg}/>
			<ReloadIcon onClick={refresh}/>
		{:catch err}
			<input value={err} disabled={true}/>
			<ReloadIcon/>
		{/await}
	</div>
<style>
	.container {
		display: flex;
		gap: var(--size-2-1);
		align-items: center;
	}
	input {
		resize: none;
		border: var(--border-width) solid var(--background-modifier-border);
		color: var(--text-normal);
		border-radius: var(--radius-s);
		padding: var(--size-4-2);
		flex-grow: 3;
	}
</style>

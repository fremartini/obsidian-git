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
	<p>Commit message</p>
	<div class="commit">
		{#await commitMessage}
			<LoadingIndicator/>
			<ReloadIcon/>
		{:then msg}
			<input value={msg}/>
			<ReloadIcon onClick={refresh}/>
		{:catch err}
			<input value={err} disabled={true}/>
			<ReloadIcon/>
		{/await}
	</div>
</div>

<style>
	p {
		margin: 0em 2em 0em 0em;
	}
	.container {
		display: flex;
		gap: var(--size-2-1);
		align-items: center;
		justify-content: space-between;
	}
	.commit {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	input {
		resize: none;
		border: var(--border-width) solid var(--background-modifier-border);
		color: var(--text-normal);
		border-radius: var(--radius-s);
		padding: var(--size-4-2);
	}
</style>

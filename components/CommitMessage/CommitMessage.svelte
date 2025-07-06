<script lang="ts">
	import ReloadIcon from "./ReloadIcon.svelte";

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
			<input value={"Loading..."} disabled={true}/>
			<button disabled={true}>
				<ReloadIcon/>
			</button>
		{:then msg}
			<input value={msg}/>
			<button onclick={refresh}>
				<ReloadIcon/>
			</button>
		{:catch err}
			<input value={err} disabled={true}/>
			<button disabled={true}>
				<ReloadIcon/>
			</button>
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
	button {
		background: none;
	}
</style>

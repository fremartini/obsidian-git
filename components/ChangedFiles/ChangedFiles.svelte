<script lang="ts">
	interface Props {
		changedFiles: string[]
	}

	let yes = $state(true)

	let {
		changedFiles
	} : Props = $props();
</script>

<div class="container">
	{#each changedFiles as changedFile} 
		<div class="entry">
			{changedFile}
			<input type="checkbox" bind:checked={yes} />
		</div>
	{/each}
</div>

<style>
	.container {
		border: var(--border-width) solid var(--background-modifier-border);
		padding: var(--size-4-2);
	}
	.entry {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
</style>

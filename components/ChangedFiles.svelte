<script lang="ts">
	interface Props {
		changedFiles: string[]
	}

	let {
		changedFiles
	} : Props = $props();
</script>

<div class="container">
	{#each changedFiles as changedFile} 
		<div>{changedFile}</div>
	{/each}
</div>

<style>
	.container {
		border: var(--border-width) solid var(--background-modifier-border);
		padding: var(--size-4-2);
	}
</style>

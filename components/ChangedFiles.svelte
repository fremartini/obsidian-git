<script lang="ts">
	interface Props {
		changedFiles: string[]
	}

	let {
		changedFiles
	} : Props = $props();
</script>

<div class="changedFilesContainer">
	{#each changedFiles as changedFile} 
		<div>{changedFile}</div>
	{/each}
</div>

<style>
	.changedFilesContainer {
		border: 1px solid var(--background-modifier-border);
		padding: 10px;
	}
</style>

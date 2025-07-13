<script lang="ts">
	import Checkbox from "./Checkbox.svelte";

	interface Props {
		changedFiles: string[]
		filesToPush: string[]
	}

	let {
		changedFiles,
		filesToPush,
	} : Props = $props();

	function onToggled(toggled: boolean, item: string) {
		if (toggled) {
			filesToPush.push(item);
		} else {
			removeElementFromArray(item, filesToPush);
		}
	}

	function removeElementFromArray(elem: any, arr: any[]) {
		const index = arr.indexOf(elem);
		if (index > -1) {
			arr.splice(index, 1);
		}
	}
</script>

<div class="container">
	{#each changedFiles as changedFile} 
		<div class="entry">
			{changedFile}
			<Checkbox onToggled={(toggled) => {
				onToggled(toggled, changedFile)
			}}/>
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

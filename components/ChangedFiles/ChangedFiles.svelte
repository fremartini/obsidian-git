<script lang="ts">
	import Checkbox from "./Checkbox.svelte";
	import type ChangedFile from "components/ChangedFile";

	interface Props {
		changedFiles: ChangedFile[]
		filesToPush: ChangedFile[]
	}

	let {
		changedFiles,
		filesToPush,
	} : Props = $props();

	function onToggled(toggled: boolean, item: ChangedFile) {
		if (toggled) {
			filesToPush.push(item);
		} else {
			removeElementFromArray(item, filesToPush);
		}
	}

	function removeElementFromArray(elem: ChangedFile, arr: ChangedFile[]) {
		const index = arr.map(e => e.Filename).indexOf(elem.Filename);
		if (index > -1) {
			arr.splice(index, 1);
		}
	}
</script>

<div class="container">
	{#each changedFiles as changedFile} 
		<div class="entry">
			{`${changedFile.State} ${changedFile.Displayname}`}
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

<script lang="ts">
	import Checkbox from "./Checkbox.svelte";
	import type ChangedFile from "components/ChangedFile";
	import DiffButton from "./DiffButton.svelte";
	import ResetButton from "./ResetButton.svelte";

	interface Props {
		changedFiles: ChangedFile[]
		filesToPush: ChangedFile[]
		openDiffView: (arg0: String) => void
		resetFile: (arg0: String) => void
	}

	let {
		changedFiles,
		filesToPush,
		openDiffView,
		resetFile,
	} : Props = $props();

	let files = $state(filesToPush)

	function onToggled(toggled: boolean, item: ChangedFile) {
		if (toggled) {
			files.push(item);
		} else {
			removeElementFromArray(item, files);
		}
	}

	function removeElementFromArray(elem: ChangedFile, arr: ChangedFile[]) {
		const index = arr.map(e => e.Filename).indexOf(elem.Filename);
		if (index > -1) {
			arr.splice(index, 1);
		}
	}

	function determineColor(file: ChangedFile): string {
		switch (file.State) {
			case 'M':
				return 'yellow'
			case 'A':
				return 'green'
			case 'D':
				return 'red'
			default:
				return 'gray'
		}
	}

</script>

<div class="container">
	{#each files as changedFile} 
		<div class="entry">
			<p>
				<span style="color:{determineColor(changedFile)}">{changedFile.State}</span>
				{changedFile.Displayname}
			</p>
			<div class="entry">
				{#if changedFile.State == 'D' || changedFile.State == 'M'}
					<ResetButton onClick={() => {
						resetFile(changedFile.Filename)
						removeElementFromArray(changedFile, files)
					}}/>
				{/if}
				{#if changedFile.State == 'M'}
					<DiffButton onClick={() => openDiffView(changedFile.Filename)}/>
				{/if}
				<Checkbox onToggled={(toggled) => onToggled(toggled, changedFile)
				}/>
			</div>
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

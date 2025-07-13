<script lang="ts">
	import Branch from "./Branch/Branch.svelte";
	import type ChangedFile from "./ChangedFile";
	import ChangedFiles from "./ChangedFiles/ChangedFiles.svelte";
	import CommitMessage from "./CommitMessage/CommitMessage.svelte";
	import PushButton from "./Push/PushButton.svelte";

	interface Props {
		branch: string;
		onSubmit: (arg0: string, arg1: ChangedFile[]) => void;
		changedFiles: ChangedFile[]
	}

	let {
		branch,
		onSubmit,
		changedFiles
	}: Props = $props();

	let commitMessage = $state(getRandomCommitMessage())
	let filesToPush = $state(changedFiles)

	async function getRandomCommitMessage() : Promise<string> {
		try {
			const response = await fetch("https://whatthecommit.com");
			const body = await response.text();

			const regex = /<p>(.*?)<\/p>/;
			const match = body.match(regex);

			if (match && match[1]) {
				return match[1];
			}

			return "";
		} catch (err) {
			return err;
		}
	}
</script>

<div class="container">
	<CommitMessage {commitMessage} refresh={() => commitMessage = getRandomCommitMessage()}/>
	<Branch {branch}/>
	<ChangedFiles {changedFiles} {filesToPush}/>
	<PushButton {onSubmit} {commitMessage} {filesToPush}/>
</div>

<style>
	.container {
		margin: var(--size-4-2);
		display: flex;
		flex-direction: column;
       	gap: var(--size-4-2);
	}
</style>

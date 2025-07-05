<script lang="ts">
	import Branch from "./Branch.svelte";
	import ChangedFiles from "./ChangedFiles.svelte";
	import CommitMessage from "./CommitMessage.svelte";
	import PushButton from "./PushButton.svelte";

	interface Props {
		branch: string;
		onSubmit: (arg0: string) => void;
		changedFiles: string[]
	}

	let {
		branch,
		onSubmit,
		changedFiles
	}: Props = $props();
</script>

<div>
	<CommitMessage/>
	<Branch {branch}/>
	<ChangedFiles {changedFiles}/>
	<PushButton {onSubmit}/>
</div>

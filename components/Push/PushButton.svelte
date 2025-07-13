<script lang="ts">
	import type ChangedFile from "components/ChangedFile";

	interface Props {
		onSubmit: (arg0: string, arg1: ChangedFile[]) => void;
		commitMessage: Promise<string>;
		filesToPush: ChangedFile[];
	}

	let {
		onSubmit,
		commitMessage,
		filesToPush
	}: Props = $props();

	let files = $state(filesToPush)
	let disabled = $derived(files.length == 0)

	let text = $derived(`Push ${files.length} file${files.length != 1 ? 's' : ''}`)
</script>

{#await commitMessage}
	<button disabled={true}>{text}</button>
{:then msg}
	<button {disabled} onclick={() => onSubmit(msg, files)}>{text}</button>
{:catch}
	<button disabled={true}>{text}</button>
{/await}

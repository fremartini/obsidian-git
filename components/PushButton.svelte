<script lang="ts">
	interface Props {
		onSubmit: (arg0: string) => void;
		commitMessage: Promise<string>
	}

	let text = "Push"

	let {
		onSubmit,
		commitMessage,
	}: Props = $props();
</script>

{#await commitMessage}
	<button disabled={true}>{text}</button>
{:then msg} 
	<button onclick={() => onSubmit(msg)}>{text}</button>
{:catch err}
	<button disabled={true}>{text}</button>
{/await}

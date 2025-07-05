<script lang="ts">
	interface Props {
		onSubmit: (arg0: string) => void;
	}

	let {
		onSubmit,
	}: Props = $props();
</script>

<button onclick={() => onSubmit("TODO")}>Push</button>

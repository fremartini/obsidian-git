<script lang="ts">
	interface Props {
		branch: string;
	}

	let {
		branch,
	}: Props = $props();
</script>

<div>
	Branch: {branch}
</div>

<style>
</style>

<script lang="ts">
	interface Props {
		branch: string;
	}

	let {
		branch,
	}: Props = $props();
</script>

<div class="branchContainer">
	Branch: {branch}
</div>

<style>
	.branchContainer {
		padding-bottom: 10px;
	}
</style>

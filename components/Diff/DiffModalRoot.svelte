<script lang="ts">
	interface Props {
		content: string[]
	}

	let {
		content
	}: Props = $props();

	function determineColor(line: string): string {
		switch (line.charAt(0)) {
			case '-':
				return 'red'
			case '+':
				return 'green'
			default:
				return 'gray'
		}
	}
</script>

<div>
	{#each content as diff}
		<p style="color:{determineColor(diff)}">{diff}</p>
	{/each}
</div>

<script lang="ts">
	interface Props {
		onToggled: (value: boolean) => void;
	}

	let {
		onToggled
	} : Props = $props();

	let checked = $state(true)

	function onClick() {
		onToggled(!checked)
	}
</script>

<input type="checkbox" bind:checked={checked} onclick={onClick}/>

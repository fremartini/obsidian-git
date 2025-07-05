<script lang="ts">
	let commitMessage = $state(getRandomCommitMessage())

	async function getRandomCommitMessage() : Promise<string | null> {
		try {
			await sleep(2000);
			const response = await fetch("https://whatthecommit.com");
			const body = await response.text();

			const regex = /<p>(.*?)<\/p>/;
			const match = body.match(regex);

			if (match && match[1]) {
				return match[1];
			}

			return null;
		} catch (err) {
			return null;
		}	
	}
</script>

<div class="container">
		<p style="margin: 0em 2em 0em 0em;">Commit message</p>
		{#await commitMessage}
			<input value={"Loading..."} disabled={true}/>
		{:then msg} 
			<input value={msg}/>
		{:catch err}
			<input value={err} disabled={true}/>
		{/await}
	</div>
<style>
	.container {
		display: flex;
		justify-content: space-between;
	}
	input {
		resize: none;
	}
</style>

<script lang="ts"></script>

<div class="container">
	<div class="loader"></div>
</div>

<style>
	.container {
		background-color: red;
	}
	.loader {
		width: 130px;
		height:100%;
		--c:no-repeat linear-gradient(#6100ee 0 0);
		background: var(--c),var(--c),#d7b8fc;
		background-size: 60% 100%;
		animation: l16 3s infinite;
	}
	@keyframes l16 {
		0%   {background-position:-150% 0,-150% 0}
		66%  {background-position: 250% 0,-150% 0}
		100% {background-position: 250% 0, 250% 0}
	}
</style>

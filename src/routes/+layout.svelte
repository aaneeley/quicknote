<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
	/>
	<title>Quicknote</title>
</svelte:head>

<main class="px-5 md:px-10 xl:px-20">
	{@render children()}
</main>

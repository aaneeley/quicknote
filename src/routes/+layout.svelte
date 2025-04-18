<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<head>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
	/>
</head>

<main class="px-5 md:px-10 xl:px-20">
	{@render children()}
</main>

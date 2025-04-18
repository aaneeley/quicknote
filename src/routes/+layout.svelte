<script lang="ts">
	import '../app.css';

	let { children } = $props();

	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';

	onMount(() => {
		themeChange(false);
	});
</script>

<svelte:head>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
	/>
	<title>Quicknote</title>
</svelte:head>

<div
	class="bg-base-300 flex h-14 w-full flex-row items-center justify-between px-5 max-sm:absolute max-sm:bottom-0 md:px-10 xl:px-20"
>
	<h1>Text</h1>
	<input type="checkbox" class="toggle" data-toggle-theme="light,dark" data-key="theme" />
</div>
<main class="px-5 md:px-10 xl:px-20">
	{@render children()}
</main>

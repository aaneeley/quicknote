<script lang="ts">
	import { Github } from '$lib/icons';
	import '../app.css';

	let { children } = $props();

	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';

	onMount(() => {
		themeChange(false);
	});

	const allowed_themes: { friendlyName: string; value: string }[] = [
		{ friendlyName: 'Bumblebee (Default)', value: 'bumblebee' },
		{ friendlyName: 'Dim', value: 'dim' },
		{ friendlyName: 'Standard Light', value: 'light' },
		{ friendlyName: 'Standard Dark', value: 'dark' },
		{ friendlyName: 'Emerald', value: 'emerald' },
		{ friendlyName: 'Cupcake', value: 'cupcake' },
		{ friendlyName: 'Forest', value: 'forest' },
		{ friendlyName: 'Dracula', value: 'dracula' },
		{ friendlyName: 'Night', value: 'night' },
		{ friendlyName: 'Sunset', value: 'sunset' },
		{ friendlyName: 'Retro', value: 'retro' },
		{ friendlyName: 'Silk', value: 'silk' },
		{ friendlyName: 'Synthwave', value: 'synthwave' },
		{ friendlyName: 'Nord', value: 'nord' }
	];
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
	<h1 class="ui">Quicknote</h1>
	<div class="flex flex-row items-center space-x-6">
		<button
			class="btn btn-ghost transition-all hover:opacity-50"
			onclick={() => window.open('https://github.com/aaneeley/quicknote', '_blank')}
			><Github /></button
		>
		<div class="dropdown dropdown-end max-sm:dropdown-top">
			<div tabindex="-1" role="button" class="btn m-1">
				Theme
				<svg
					width="12px"
					height="12px"
					class="inline-block h-2 w-2 fill-current opacity-60"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 2048 2048"
				>
					<path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
				</svg>
			</div>
			<ul tabindex="-1" class="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl">
				{#each allowed_themes as theme}
					<li>
						<input
							data-key="theme"
							type="radio"
							name="theme-dropdown"
							class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
							aria-label={theme.friendlyName}
							data-set-theme={theme.value}
						/>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
<main class="px-5 md:px-10 xl:px-20">
	{@render children()}
</main>

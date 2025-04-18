<script lang="ts">
	import type { ActionData, PageProps } from './$types';

	let { data, form }: PageProps = $props();
	let decryptedContent: string = $state('');

	if (!data.encrypted) {
		decryptedContent = data.content;
	}

	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/state';
	import { LockClosed, LockOpen, Warning } from '$lib/icons';
	import { decryptAesGcm } from '$lib/utils';
	import { goto } from '$app/navigation';

	let password = $state('');
	let isLoading = $state(false);
	let copied = $state(false);
	let error = $state('');

	const MAX_NOTE_TITLE_LEN = 50;

	let title = $derived(
		decryptedContent?.split('\n')[0].substring(0, MAX_NOTE_TITLE_LEN) || 'Encrypted Note'
	);

	const decrypt = () => {
		isLoading = true;
		decryptAesGcm(data.content, data.iv!, data.salt!, password)
			.then((decrypted) => {
				decryptedContent = decrypted;
			})
			.catch((e) => (error = e))
			.finally(() => (isLoading = false));
	};

	const copyLink = () => {
		try {
			navigator.clipboard.writeText(page.url.toString()).then();
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch (err) {
			alert('Error while copying to clipboard');
		}
	};
</script>

<div class="flex w-full flex-col items-start space-y-4 pt-2 lg:flex-row lg:space-x-4">
	<div class="w-full space-y-2">
		<h2 class="w-full">{title}</h2>
		{#if decryptedContent}
			<div class="textarea bg-base-200 min-h-50 w-full resize-none overflow-hidden">
				{decryptedContent}
			</div>
		{:else}
			<div
				class="fieldset bg-base-200 border-base-300 rounded-box flex flex-col items-center space-y-2 border px-4 py-12"
			>
				<span class="text-sm">This note requires a password to access</span>
				<input
					bind:value={password}
					name="password"
					type="password"
					class="input"
					placeholder="Password"
				/>
				{#if error}
					<span class="text-error text-sm">{error}</span>
				{/if}
				<button class="btn btn-soft btn-success w-30" onclick={decrypt}
					>{isLoading ? 'loading...' : 'Unlock Note'}</button
				>
			</div>
		{/if}
	</div>
	<div class="flex w-full flex-col space-y-2">
		<h2 class="w-full">Note Info</h2>
		<fieldset
			class="fieldset bg-base-200 border-base-300 rounded-box space-y w-full border p-4 sm:w-sm sm:min-w-86"
		>
			<legend class="fieldset-legend">Share</legend>

			<label class="fieldset-label" for="password">Link</label>
			<div class="join w-full">
				<div class="w-full">
					<span class="input join-item">
						<svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
							><g
								stroke-linejoin="round"
								stroke-linecap="round"
								stroke-width="2.5"
								fill="none"
								stroke="currentColor"
								><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path
									d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
								></path></g
							></svg
						>
						<span>{page.url.toString().replaceAll('https://', '').replaceAll('http://', '')}</span>
					</span>
				</div>
				<button class="btn btn-primary join-item" onclick={copyLink}
					>{copied ? 'Copied!' : 'Copy'}</button
				>
			</div>
			<p class="fieldset-label">
				{data.encrypted
					? 'Only people with your password can see this note.'
					: 'Anyone can access this note through the link.'}
			</p>
		</fieldset>
		<button class="btn btn-primary btn-outline" onclick={() => goto('/')}
			><b>+</b>&nbsp;New Note</button
		>
	</div>
</div>

<script lang="ts">
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
	import { applyAction, enhance } from '$app/forms';
	import { LockClosed, LockOpen, Warning } from '$lib/icons';

	let isLoading = $state(false);

	const MAX_NOTE_TITLE_LEN = 50;

	let content = $state('');
	let encrypted = $state(false);
	let markdownView = $state(false);

	let title = $derived(content.split('\n')[0].substring(0, MAX_NOTE_TITLE_LEN) || 'New Note');
	function autoResize(textarea: HTMLTextAreaElement) {
		const resize = () => {
			textarea.style.height = 'auto';
			textarea.style.height = textarea.scrollHeight + 'px';
		};

		textarea.addEventListener('input', resize);
		resize(); // initial sizing

		return {
			destroy() {
				textarea.removeEventListener('input', resize);
			}
		};
	}
</script>

<form
	class="flex w-full flex-col items-end space-y-4 pt-2 lg:flex-row lg:items-start lg:space-x-4"
	method="POST"
	use:enhance={() => {
		return async ({ result }) => {
			if (result.type !== 'redirect') {
				isLoading = false;
			}
			await applyAction(result);
		};
	}}
>
	<div class="w-full space-y-2">
		<div class="flex w-full flex-col justify-between sm:flex-row sm:items-center">
			<h2 class="w-full">{title}</h2>
			<label class="fieldset-label text-left text-sm text-nowrap">
				<input type="checkbox" bind:checked={markdownView} class="toggle toggle-sm" />
				Markdown Mode
			</label>
		</div>
		{#if !markdownView}
			<textarea
				class="textarea min-h-50 w-full resize-none overflow-hidden"
				name="content"
				placeholder="Write anything!"
				bind:value={content}
				use:autoResize
			></textarea>
		{:else}
			<pre>{content}</pre>
		{/if}
	</div>
	<div class="flex flex-col space-y-2">
		<h2 class="w-full">Note Settings</h2>
		<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
			<legend class="fieldset-legend">Encryption</legend>

			<label class="toggle">
				<input bind:checked={encrypted} type="checkbox" />
				<LockOpen stroke="3" />
				<LockClosed stroke="3" />
			</label>

			{#if encrypted}
				<label class="fieldset-label" for="password"
					>Password
					<div
						class="tooltip tooltip-warning cursor-pointer"
						data-tip="If you lose this password it is impossible to recover your note"
					>
						<span class="text-warning">
							<Warning />
						</span>
					</div>
				</label>
				<input type="password" class="input" disabled={!encrypted} placeholder="Password" />
			{/if}
			<p class="fieldset-label">
				Encrypts your note in the database making it impossible for anyone to see your note. Even
				app developers with access to the database.
			</p>
		</fieldset>
		{#if form?.missing}
			<span class="text-error text-sm">Note cannot be empty</span>
		{:else if form?.invalid}
			<span class="text-error text-sm">Something is wrong with your note... Please try again.</span>
		{/if}
		<button class="btn btn-soft btn-success w-30" onclick={() => (isLoading = true)}
			>{isLoading ? 'loading...' : 'Save Note'}</button
		>
	</div>
</form>

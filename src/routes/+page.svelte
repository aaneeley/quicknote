<script lang="ts">
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
	import { applyAction, enhance } from '$app/forms';
	import { LockClosed, LockOpen, Warning } from '$lib/icons';
	import { getLanguageByString } from '$lib/utils';
	import '$lib/themes/github-dark-dimmed.css';

	import hljs from 'highlight.js';

	let language: string = $state('plaintext');

	let isLoading = $state(false);

	let content = $state('');
	let title = $state('New Note');
	let encrypted = $state(false);
	let previewMode = $state(false);

	let highlightedContent = $derived(hljs.highlight(content, { language: language }));

	// let title = $derived(content.split('\n')[0].substring(0, MAX_NOTE_TITLE_LEN) || 'New Note');
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
	class="flex w-full flex-col items-start space-y-4 pt-2 lg:flex-row lg:space-x-4"
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
	<div class="w-full min-w-0 space-y-2 text-sm lg:w-auto lg:flex-1">
		<div class="flex w-full flex-col justify-between py-1 sm:flex-row sm:items-center">
			<input
				name="title"
				class="input input-sm w-sm text-lg font-semibold"
				maxlength="50"
				bind:value={title}
				hidden={previewMode}
			/>
			{#if previewMode}
				<h2 class="max-w-sm overflow-hidden text-nowrap overflow-ellipsis">{title}</h2>
			{/if}
			<label class="fieldset-label text-left text-sm text-nowrap">
				<input type="checkbox" bind:checked={previewMode} class="toggle toggle-sm" />
				Preview Note
			</label>
		</div>
		<textarea
			class="textarea w-full resize-none overflow-x-scroll overflow-y-hidden text-nowrap"
			name="content"
			placeholder="Write anything!"
			bind:value={content}
			use:autoResize
			hidden={previewMode}
		></textarea>
		{#if previewMode}
			<div class="textarea w-full resize-none overflow-x-scroll overflow-y-hidden">
				<pre class="text-nowrap">{@html highlightedContent.value}</pre>
			</div>
		{/if}
	</div>
	<div class="flex flex-col space-y-2">
		<h2 class="w-full">Note Settings</h2>
		<fieldset
			class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4 sm:w-sm sm:min-w-86"
		>
			<legend class="fieldset-legend">Syntax Highlighting</legend>
			<select class="select" name="language" bind:value={language}>
				<option value={'plaintext'} selected>Plain Text</option>
				<option value={'json'}>JSON</option>
				<option value={'yaml'}>YAML</option>
				<option value={'markdown'}>Markdown</option>
				<option value={'python'}>Python</option>
				<option value={'javascript'}>JavaScript</option>
				<option value={'rust'}>Rust</option>
				<option value={'go'}>Go</option>
				<option value={'java'}>Java</option>
			</select>

			<p class="fieldset-label">
				Changes how viewers see your note. Toggle "Preview Note" to see how viewers will see your
				note.
			</p>
		</fieldset>
		<fieldset
			class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4 sm:w-sm sm:min-w-86"
		>
			<legend class="fieldset-legend">Encryption</legend>

			<label class="toggle">
				<input name="encrypted" bind:checked={encrypted} type="checkbox" />
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
				<input
					name="password"
					type="password"
					class="input"
					disabled={!encrypted}
					placeholder="Password"
				/>
			{/if}
			<p class="fieldset-label">
				Encrypts your note in the database making it impossible to read your note without the
				password.
			</p>
			<p class="fieldset-label"><b>Note:</b> Titles are not encrypted</p>
		</fieldset>
		{#if form?.missing}
			<span class="text-error text-sm">Note cannot be empty</span>
		{:else if form?.password_missing}
			<span class="text-error text-sm">Password cannot be empty</span>
		{:else if form?.invalid}
			<span class="text-error text-sm">Something is wrong with your note... Please try again.</span>
		{/if}
		<button class="btn btn-outline btn-success" onclick={() => (isLoading = true)}
			>{isLoading ? 'loading...' : 'Save Note'}</button
		>
	</div>
</form>

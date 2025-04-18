<script lang="ts">
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
	import { applyAction, enhance } from '$app/forms';
	import { LockClosed, LockOpen, Warning } from '$lib/icons';
	import Highlight, { LineNumbers } from 'svelte-highlight';
	import 'svelte-highlight/styles/github-dark.css';
	import {
		go,
		java,
		javascript,
		json,
		markdown,
		plaintext,
		python,
		rust,
		yaml,
		type LanguageType
	} from 'svelte-highlight/languages';
	import { getLanguageByString } from '$lib/utils';

	let language: string = $state('plaintext');

	let isLoading = $state(false);

	const MAX_NOTE_TITLE_LEN = 50;

	let content = $state('');
	let encrypted = $state(false);
	let previewMode = $state(false);

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
	<div class="w-full space-y-2 text-sm">
		<div class="flex w-full flex-col justify-between sm:flex-row sm:items-center">
			<h2 class="w-full">{title}</h2>
			<label class="fieldset-label text-left text-sm text-nowrap">
				<input type="checkbox" bind:checked={previewMode} class="toggle toggle-sm" />
				Preview Note
			</label>
		</div>
		<textarea
			class="textarea min-h-50 w-full resize-none overflow-x-scroll overflow-y-hidden text-nowrap"
			name="content"
			placeholder="Write anything!"
			bind:value={content}
			use:autoResize
			hidden={previewMode}
		></textarea>
		{#if previewMode}
			<Highlight
				class="rounded-field"
				language={getLanguageByString(language)}
				code={content}
				let:highlighted
			>
				<LineNumbers {highlighted} />
			</Highlight>
		{/if}
	</div>
	<div class="flex flex-col space-y-2">
		<h2 class="w-full">Note Settings</h2>
		<fieldset
			class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4 sm:w-sm sm:min-w-86"
		>
			<legend class="fieldset-legend">Format</legend>
			<select class="select" name="language" bind:value={language}>
				<option value={plaintext.name} selected>Plain Text</option>
				<option value={json.name}>JSON</option>
				<option value={yaml.name}>YAML</option>
				<option value={markdown.name}>Markdown</option>
				<option value={python.name}>Python</option>
				<option value={javascript.name}>JavaScript</option>
				<option value={rust.name}>Rust</option>
				<option value={go.name}>Go</option>
				<option value={java.name}>Java</option>
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
				Encrypts your note in the database making it impossible for anyone to see your note. Even
				app developers with access to the database.
			</p>
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

<script lang="ts">
	import type { ActionData, PageProps } from './$types';

	let { data, form }: PageProps = $props();

	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/state';
	import { LockClosed, LockOpen, Warning } from '$lib/icons';

	let isLoading = $state(false);

	const MAX_NOTE_TITLE_LEN = 50;

	let title = $derived(data.content.split('\n')[0].substring(0, MAX_NOTE_TITLE_LEN) || 'New Note');
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

<div class="flex w-full flex-col items-start space-y-4 pt-2 lg:flex-row lg:space-x-4">
	<div class="w-full space-y-2">
		<h2 class="w-full">{title}</h2>
		<div class="textarea bg-base-200 min-h-50 w-full resize-none overflow-hidden">
			{data.content}
		</div>
	</div>
	<div class="flex flex-col space-y-2">
		<h2 class="w-full">Note Info</h2>
		<fieldset class="fieldset bg-base-200 border-base-300 rounded-box min-w-86 border p-4">
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
						<span>{page.url}</span>
					</span>
				</div>
				<button class="btn btn-primary join-item">Copy</button>
			</div>
			<p class="fieldset-label">Anyone can access this note through the link.</p>
		</fieldset>
	</div>
</div>

<script lang="ts">
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
	import { applyAction, enhance } from '$app/forms';

	let isLoading = $state(false);
</script>

<form
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
	<label>
		Note Content
		<input name="content" type="text" />
	</label>
	<button onclick={() => (isLoading = true)}>{isLoading ? 'loading...' : 'Save Note'}</button>
</form>

{#if form?.missing}
	MISSING
{:else if form?.invalid}
	Something went wrong please try again...
{/if}

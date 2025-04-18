<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
</script>

<div class="flex flex-col items-center space-y-4 pt-4">
	<div role="alert" class="alert alert-error w-full sm:w-sm">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6 shrink-0 stroke-current"
			fill="none"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
		<div>
			<h2>{page.status}</h2>
			<span>{page.error?.message}</span>
		</div>
	</div>
	<button class="btn btn-primary btn-outline w-full sm:w-sm" onclick={() => goto('/')}
		><b>+</b>&nbsp;New Note</button
	>
</div>

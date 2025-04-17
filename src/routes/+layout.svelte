<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<main class="px-5 md:px-10 lg:px-30">
	{@render children()}
</main>

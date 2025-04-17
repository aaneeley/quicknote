<script lang="ts">
	import { page } from '$app/state';
</script>

<h1>Oh no!</h1>
<h1>{page.status}: {page.error?.message}</h1>

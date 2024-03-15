<script>
	import { page } from '$app/stores';
</script>

<div class="sm:my-auto max-w-xl mx-auto flex">
	<div class="sm:action-box flex flex-col flex-grow items-center m-10 text-center">
		<h1 class="text-3xl font-bold mt-2">{$page.status}: {$page.error?.message}</h1>
		{#if $page.status === 404}
			<p class="text-lg mt-6">Sorry. We couldn't find what you are looking for.</p>
		{/if}
		<a class="btn btn-primary mt-6" href="./">Go Home</a>
	</div>
</div>

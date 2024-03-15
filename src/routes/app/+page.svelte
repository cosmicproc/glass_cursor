<script>
	import { default as Panel } from '$lib/components/panel.svelte';
	import { default as Editor } from '$lib/components/editor.svelte';
	import { tick } from 'svelte';
</script>

<svelte:head>
	<base target="_blank" />
</svelte:head>

<div class="flex w-[100dvw] h-[100dvh]">
	<Panel />
	{#await tick()}
		<!-- Waiting  -->
	{:then}
		<Editor />
	{/await}
</div>

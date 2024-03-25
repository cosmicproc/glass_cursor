<script>
    import { tick } from 'svelte';
    import Panel from '$lib/components/Panel.svelte';
    import Editor from '$lib/components/Editor.svelte';
</script>

<svelte:head>
    <base target="_blank" />
</svelte:head>

<div class="flex w-screen h-screen">
    <Panel />
    {#await tick()}
        <!-- Waiting  -->
    {:then}
        <Editor />
    {/await}
</div>

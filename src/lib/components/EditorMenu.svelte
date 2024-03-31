<script lang="ts">
    import type { Editor } from '@tiptap/core';
    import {
        Bold,
        Heading1,
        Heading2,
        Italic,
        Strikethrough,
        Text,
    } from 'lucide-svelte';

    export let editor: Editor;
    export let menuElement: HTMLElement;
</script>

<div
    bind:this={menuElement}
    class="flex flex-col justify-center rounded-xl border-2 border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-700 dark:bg-neutral-800"
>
    {#if editor}
        <div>
            <button
                on:click={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()}
                class={`rounded-full p-1 ${editor.isActive('heading', { level: 1 }) ? 'bg-neutral-300 dark:bg-neutral-600' : ''}`}
            >
                <Heading1 class="w-5" />
            </button>
            <button
                on:click={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()}
                class={`rounded-full p-1 ${editor.isActive('heading', { level: 2 }) ? 'bg-neutral-300 dark:bg-neutral-600' : ''}`}
            >
                <Heading2 class="w-5" />
            </button>
            <button
                on:click={() => editor.chain().focus().setParagraph().run()}
                class={`rounded-full p-1 ${editor.isActive('paragraph') ? 'bg-neutral-300 dark:bg-neutral-600' : ''}`}
            >
                <Text class="w-5" />
            </button>
        </div>
        <hr class="my-1" />
        <div class="flex justify-center">
            <button
                on:click={() => editor.chain().focus().toggleBold().run()}
                class={`mx-1 rounded-full p-1 ${editor.isActive('bold') ? 'bg-neutral-300 dark:bg-neutral-600' : ''}`}
            >
                <Bold class="w-4" strokeWidth={2.5} />
            </button>
            <button
                on:click={() => editor.chain().focus().toggleItalic().run()}
                class={`mx-1 rounded-full p-1 ${editor.isActive('italic') ? 'bg-neutral-300 dark:bg-neutral-600' : ''}`}
            >
                <Italic class="w-4" strokeWidth={2.5} />
            </button>
            <button
                on:click={() => editor.chain().focus().toggleStrike().run()}
                class={`mx-1 rounded-full p-1 ${editor.isActive('strike') ? 'bg-neutral-300 dark:bg-neutral-600' : ''}`}
            >
                <Strikethrough class="w-4" strokeWidth={2.5} />
            </button>
        </div>
    {/if}
</div>

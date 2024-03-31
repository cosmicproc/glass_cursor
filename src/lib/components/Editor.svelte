<script lang="ts">
    import { currentNote, notes } from '$lib/stores';
    import { debounce } from '$lib/utils';
    import { Editor } from '@tiptap/core';
    import BubbleMenu from '@tiptap/extension-bubble-menu';
    import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
    import Typography from '@tiptap/extension-typography';
    import StarterKit from '@tiptap/starter-kit';
    import 'highlight.js/styles/github-dark.css';
    import { common, createLowlight } from 'lowlight';
    import { beforeUpdate, onDestroy, onMount } from 'svelte';
    import EditorMenu from './EditorMenu.svelte';

    let editorElement: HTMLElement;
    let menuElement: HTMLElement;
    let editor: Editor;

    const defaultText =
        '<p>Choose a note from the <b>side panel</b> to start typing.<br/> You can toggle the visibility of the side panel by clicking the vertical line at the left.</p>';

    onMount(() => {
        const index = $notes.findIndex(
            (o: { id: number }) => o.id === $currentNote,
        );
        editor = new Editor({
            element: editorElement,
            editorProps: {
                attributes: {
                    class: 'prose dark:prose-invert focus:outline-none w-10/12 md:w-3/4 max-w-none',
                },
            },
            extensions: [
                StarterKit.configure({
                    codeBlock: false,
                }),
                Typography,
                CodeBlockLowlight.configure({
                    lowlight: createLowlight(common),
                }),
                BubbleMenu.configure({
                    element: menuElement,
                }),
            ],
            content: $notes[index]?.content || defaultText,
            editable: !!$notes[index]?.content,
            onTransaction: () => {
                editor = editor;
            },
        });
    });

    onDestroy(() => {
        if (editor) {
            editor.destroy();
        }
    });

    beforeUpdate(() => {
        saveNote();
    });

    currentNote.subscribe((value: number) => {
        if (editor) {
            if (value !== -1) {
                const index = $notes.findIndex(
                    (o: { id: number }) => o.id === value,
                );
                editor.commands.setContent($notes[index]?.content);
                editor.setEditable(true);
            } else {
                editor.commands.setContent(defaultText);
                editor.setEditable(false);
            }
        }
    });

    function saveNote() {
        if (editor) {
            const index = $notes.findIndex(
                (o: { id: number }) => o.id === $currentNote,
            );
            const updated = $notes;
            if (updated[index]) {
                updated[index].content = editor.getHTML();
            }
            notes.set(updated);
        }
    }

    const handleInput = debounce(saveNote, 1000);
</script>

<EditorMenu {editor} bind:menuElement />

<div
    bind:this={editorElement}
    on:input={handleInput}
    data-testid="editor"
    class="flex max-h-full flex-grow justify-center overflow-scroll py-14"
/>

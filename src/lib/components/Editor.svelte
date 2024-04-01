<script lang="ts">
    import { currentNote, notes } from '$lib/stores';
    import { debounce } from '$lib/utils';
    import { Editor } from '@tiptap/core';
    import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
    import Link from '@tiptap/extension-link';
    import Placeholder from '@tiptap/extension-placeholder';
    import Typography from '@tiptap/extension-typography';
    import StarterKit from '@tiptap/starter-kit';
    import 'highlight.js/styles/github-dark.css';
    import { common, createLowlight } from 'lowlight';
    import { onDestroy, onMount } from 'svelte';

    let editorElement: HTMLElement;
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
                CodeBlockLowlight.configure({
                    lowlight: createLowlight(common),
                }),
                Placeholder.configure({
                    placeholder: 'Dump your mind here…',
                    emptyEditorClass:
                        'before:content-[attr(data-placeholder)] before:opacity-50',
                }),
                Link,
                Typography,
            ],
            content: $notes[index]?.content ?? defaultText,
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

    let lastNote: number;
    currentNote.subscribe((value: number) => {
        if (editor) {
            lastNote !== undefined && saveNote(lastNote);
            lastNote = value;
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

    function saveNote(noteId = $currentNote) {
        if (editor) {
            const index = $notes.findIndex(
                (o: { id: number }) => o.id === noteId,
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

<div
    bind:this={editorElement}
    on:input={handleInput}
    data-testid="editor"
    class="flex max-h-full flex-grow justify-center overflow-scroll py-14"
/>

<svelte:head>
    <base target="_blank" />
</svelte:head>

<svelte:window
    on:beforeunload={() => {
        saveNote();
    }}
/>

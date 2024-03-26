<script lang="ts">
    import {
        currentNote,
        notes,
        previewExtended,
        sourceExtended,
    } from '$lib/stores';
    import { faMarkdown } from '@fortawesome/free-brands-svg-icons';
    import {
        faAlignLeft,
        faArrowLeft,
        faArrowRight,
        faQuestion,
    } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
    import hljs from 'highlight.js';
    import 'highlight.js/styles/monokai.css';
    import markdownit from 'markdown-it';

    const md = markdownit({
        linkify: true,
        typographer: true,
        breaks: true,
        highlight: function (str: string, lang: string) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(str, { language: lang }).value;
                } catch (__) {
                    /* empty */
                }
            }

            try {
                return hljs.highlightAuto(str).value;
            } catch (err) {
                /* empty */
            }

            return '';
        },
    });

    let source: HTMLElement;
    let preview: HTMLElement;
    let sourceContent: string;
    let previewContent: string = '';

    $: previewContent = md.render(sourceContent);

    currentNote.subscribe((value: number) => {
        if (value !== -1) {
            const index = $notes.findIndex(
                (o: { id: number }) => o.id === value,
            );
            sourceContent = $notes[index]?.content;
        } else {
            sourceContent = '';
        }
    });

    let autoSynced = false;
    function syncScroll(this: HTMLElement) {
        let first = preview;
        let second = source;
        if (this === source) {
            first = source;
            second = preview;
        } else if (this !== preview) {
            return;
        }
        const firstHeight = first.scrollHeight - first.clientHeight;
        const secondHeight = second.scrollHeight - second.clientHeight;
        if (!autoSynced) {
            autoSynced = true;
            second.scrollTop = (first.scrollTop / firstHeight) * secondHeight;
        } else {
            autoSynced = false;
        }
    }

    function handleKeydown(this: HTMLTextAreaElement, event: KeyboardEvent) {
        if (event.key !== 'Tab') return;
        event.preventDefault();
        const selStart = this?.selectionStart;
        const selEnd = this?.selectionEnd;
        this.value =
            this.value.substring(0, selStart) +
            '\t' +
            this.value.substring(selEnd);
    }

    function handleInput() {
        const index = $notes.findIndex(
            (o: { id: number }) => o.id === $currentNote,
        );
        const updated = $notes;
        updated[index].content = sourceContent;
        notes.set(updated);
    }
</script>

<div class="flex flex-grow basis-0 flex-col overflow-hidden p-10 lg:flex-row">
    <div
        class={`mb-4 flex h-1/2 flex-grow flex-col overflow-hidden rounded-3xl border-2 border-neutral-300 shadow-lg transition-all duration-300 lg:mb-0 lg:h-full lg:w-1/2 dark:border-neutral-500 ${
            $previewExtended && !$sourceExtended
                ? 'lg:-ml-[110%] lg:mr-24'
                : 'lg:mr-2'
        }`}
    >
        <div
            class="flex w-full bg-neutral-200 bg-opacity-70 p-4 text-center backdrop-blur dark:bg-neutral-800 dark:bg-opacity-70"
        >
            <a
                href="https://commonmark.org/help/"
                title="Help"
                class="flex items-center rounded-xl px-2 hover:bg-gray-300 dark:hover:bg-gray-700"
            >
                <FontAwesomeIcon icon={faQuestion} />
            </a>
            <strong class="mx-auto">
                <FontAwesomeIcon icon={faMarkdown} class="align-middle" />
                <span class="ml-1 align-middle">Markdown Editor</span>
            </strong>
            <button
                title={sourceExtended ? 'Shrink' : 'Extend'}
                data-testid="resize-editor"
                class="invisible cursor-pointer rounded-xl px-2 hover:bg-gray-300 lg:visible dark:hover:bg-gray-700"
                on:click={() => {
                    sourceExtended.set(!$sourceExtended);
                }}
            >
                {#if $sourceExtended}
                    <FontAwesomeIcon icon={faArrowLeft} />
                {:else}
                    <FontAwesomeIcon icon={faArrowRight} />
                {/if}
            </button>
        </div>
        <div class="-mt-16 flex h-full w-full flex-grow overflow-auto">
            <textarea
                data-testid="editor"
                class="w-full resize-none bg-transparent p-6 pb-8 pt-[5.5em] font-mono outline-none"
                placeholder={$currentNote === -1
                    ? 'Choose a note from the left-hand side panel to edit.'
                    : 'Dump your mind here.'}
                disabled={$currentNote === -1}
                bind:this={source}
                bind:value={sourceContent}
                on:scroll={syncScroll}
                on:keydown={handleKeydown}
                on:input={handleInput}
                name="editor"
            ></textarea>
        </div>
    </div>
    <div
        class={`mt-4 flex h-1/2 flex-grow flex-col overflow-hidden rounded-3xl border-2 border-neutral-300 shadow-lg transition-all duration-300 lg:mt-0 lg:h-full lg:w-1/2 dark:border-neutral-500 ${
            $sourceExtended && !$previewExtended
                ? 'lg:-mr-[110%] lg:ml-24'
                : 'lg:ml-2'
        }`}
    >
        <div
            class="flex w-full bg-neutral-200 bg-opacity-70 p-4 text-center backdrop-blur dark:bg-neutral-800 dark:bg-opacity-70"
        >
            <button
                title={$previewExtended ? 'Shrink' : 'Extend'}
                data-testid="resize-result-text"
                class="invisible cursor-pointer rounded-xl px-2 hover:bg-gray-300 lg:visible dark:hover:bg-gray-700"
                on:click={() => {
                    previewExtended.set(!$previewExtended);
                }}
            >
                {#if $previewExtended}
                    <FontAwesomeIcon icon={faArrowRight} />
                {:else}
                    <FontAwesomeIcon icon={faArrowLeft} />
                {/if}
            </button>
            <strong class="mx-auto">
                <FontAwesomeIcon icon={faAlignLeft} class="align-middle" />
                <span class="ml-1 align-middle">Formatted Text</span>
            </strong>
            <div class="w-[30px]"></div>
        </div>
        <div
            class="-mt-16 overflow-auto px-6 pt-[5.5em]"
            bind:this={preview}
            on:scroll={syncScroll}
        >
            <article
                data-testid="result-text"
                class="break-word prose mx-auto pb-8 dark:prose-invert dark:prose-pre:bg-gray-900"
            >
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html previewContent}
            </article>
        </div>
    </div>
</div>

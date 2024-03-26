<script lang="ts">
    import { browser } from '$app/environment';
    import Logo from '$lib/components/svg/Logo.svelte';
    import { currentNote, notes, sidebarActive } from '$lib/stores';
    import {
        faGear,
        faPencil,
        faPlus,
        faTrashCan,
    } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
    import { slide } from 'svelte/transition';
    import Settings from './Settings.svelte';
    import ConfirmDeletion from './ConfirmDeletion.svelte';
    import RenameNote from './RenameNote.svelte';
    import { tick } from 'svelte';

    let settings: Settings;

    let confirmDeleteTargetName: string;
    let confirmDeleteTargetIndex: number;
    let confirmDeletion: ConfirmDeletion;

    let renameNoteTargetIndex: number;
    let renameNote: RenameNote;

    let notesDiv: HTMLDivElement;

    function findNoteIndex(id: number) {
        return $notes.findIndex((o: { id: number }) => o.id === id);
    }
</script>

<div class="z-10 flex" data-testid="panel">
    {#if browser}
        <aside
            data-testid="panel-aside"
            class={`flex w-[95dvw] flex-col bg-neutral-100 px-2 transition-all sm:w-80 dark:bg-neutral-900 duration-300${
                !$sidebarActive ? ' -ml-[95dvw] md:-ml-80' : ''
            }`}
        >
            <div
                class="mx-4 mt-2 flex border-b-2 border-gray-400 py-4 dark:border-gray-500"
            >
                <div class="basis-full">
                    <h1 class="text-2xl font-bold">Your Notes</h1>
                </div>
                <button
                    class="flex cursor-pointer items-center rounded-xl hover:bg-gray-300 dark:hover:bg-gray-800"
                    title="New Note"
                    data-testid="new-note"
                    on:click={() => {
                        notesDiv.scrollTop = notesDiv.scrollHeight;
                        const id = Math.max(...$notes.map((o) => o.id), -1) + 1;
                        const newNote = {
                            id: id,
                            name: 'Untitled Note',
                            content: '',
                        };
                        const updated = [...$notes, newNote];
                        notes.set(updated);

                        notesDiv.scrollIntoView();
                    }}
                >
                    <FontAwesomeIcon icon={faPlus} size="lg" class=" mx-2" />
                </button>
            </div>
            <div
                class="h-full overflow-auto overflow-x-hidden px-5 pb-4"
                bind:this={notesDiv}
            >
                {#if $notes && $notes.length !== 0}
                    {#each $notes as note (note.id)}
                        <div
                            class={`my-4 flex items-center rounded-xl border-2 p-1 pl-4
							${
                                $currentNote === note.id
                                    ? ' border-blue-400 bg-blue-200 dark:border-blue-700 dark:bg-blue-950 dark:brightness-110'
                                    : ' border-gray-300 bg-gray-200 hover:border-blue-400 hover:bg-blue-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-blue-800 dark:hover:bg-blue-950 '
                            }`}
                            data-testid="note"
                            id={($currentNote === note.id && 'current-note') ||
                                ''}
                            in:slide
                            out:slide
                            on:click={() => {
                                currentNote.set(note.id);
                            }}
                            on:keydown={(e) => {
                                if (e.key === 'Enter') {
                                    currentNote.set(note.id);
                                }
                            }}
                            role="button"
                            tabindex="0"
                        >
                            <div class="mr-1 max-w-[70%]">
                                <span
                                    class="break-words font-semibold outline-none"
                                >
                                    {note.name}
                                </span>
                            </div>
                            <div class="ml-auto flex">
                                <button
                                    class="flex min-w-[32px] items-center p-2 hover:text-yellow-700"
                                    data-testid="rename"
                                    title="Rename"
                                    on:click|stopPropagation={async () => {
                                        renameNoteTargetIndex = findNoteIndex(
                                            note.id,
                                        );
                                        await tick();
                                        renameNote.show();
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPencil} />
                                </button>
                                <button
                                    class="flex min-w-[32px] items-center p-2 hover:text-red-500"
                                    data-testid="delete"
                                    title="Delete"
                                    on:click|stopPropagation={() => {
                                        confirmDeleteTargetName = note.name;
                                        confirmDeleteTargetIndex =
                                            findNoteIndex(note.id);
                                        confirmDeletion.show();
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTrashCan} />
                                </button>
                            </div>
                        </div>
                    {/each}
                {:else}
                    <p class="mt-4" data-testid="no-notes">
                        You don't have any notes.
                    </p>
                {/if}
            </div>
            <div
                class="mx-4 mb-2 flex border-t-2 border-gray-400 py-4 dark:border-gray-500"
            >
                <button
                    data-testid="settings-button"
                    class="flex cursor-pointer items-center rounded-xl px-2 hover:bg-gray-300 dark:hover:bg-gray-800"
                    title="Settings"
                    on:click={() => {
                        settings.show();
                    }}
                >
                    <FontAwesomeIcon icon={faGear} />
                </button>
                <div
                    class="mx-2 ml-auto flex rounded-full border-2 border-indigo-600 bg-indigo-50 p-1 shadow dark:bg-indigo-950"
                >
                    <Logo />
                    <span class="mx-1 align-middle font-medium"
                        >Glass Cursor</span
                    >
                </div>
            </div>
        </aside>
    {/if}
    <div class="flex items-center">
        <button
            data-testid="toggle-panel"
            class="group -mr-1 cursor-pointer p-2"
            title={$sidebarActive ? 'Hide' : 'Show'}
            on:click={() => {
                sidebarActive.set(!$sidebarActive);
            }}
            on:keydown={(e) => {
                if (e.key === 'f') {
                    sidebarActive.set(!$sidebarActive);
                }
            }}
        >
            <div
                class={`-mb-1 h-6 w-1 rounded-2xl bg-gray-400 transition-all group-hover:bg-gray-500 dark:bg-gray-500 dark:group-hover:bg-gray-400 ${
                    $sidebarActive
                        ? 'group-hover:rotate-12'
                        : 'group-hover:-rotate-12'
                }`}
            ></div>
            <div
                class={`-mb-1 h-6 w-1 rounded-2xl bg-gray-400 transition-all group-hover:bg-gray-500 dark:bg-gray-500 dark:group-hover:bg-gray-400 ${
                    $sidebarActive
                        ? 'group-hover:-rotate-12'
                        : 'group-hover:rotate-12'
                }`}
            ></div>
        </button>
    </div>
</div>

<Settings bind:this={settings} />
<ConfirmDeletion
    bind:this={confirmDeletion}
    {confirmDeleteTargetName}
    {confirmDeleteTargetIndex}
/>
<RenameNote bind:this={renameNote} {renameNoteTargetIndex} />

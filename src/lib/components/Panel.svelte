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

<div class="flex z-10" data-testid="panel">
    {#if browser}
        <aside
            data-testid="panel-aside"
            class={`bg-neutral-100 dark:bg-neutral-900 w-[95dvw] sm:w-80 px-2 flex flex-col transition-all duration-300${
                !$sidebarActive ? ' -ml-[95dvw] md:-ml-80' : ''
            }`}
        >
            <div
                class="py-4 mx-4 border-gray-400 dark:border-gray-500 border-b-2 flex mt-2"
            >
                <div class="basis-full">
                    <h1 class="font-bold text-2xl">Your Notes</h1>
                </div>
                <button
                    class="flex items-center hover:bg-gray-300 dark:hover:bg-gray-800 rounded-xl cursor-pointer"
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
                class="px-5 pb-4 overflow-auto overflow-x-hidden h-full"
                bind:this={notesDiv}
            >
                {#if $notes && $notes.length !== 0}
                    {#each $notes as note (note.id)}
                        <div
                            class={`rounded-xl my-4 p-1 pl-4 border-2 flex items-center
							${
                                $currentNote === note.id
                                    ? ' bg-blue-200 border-blue-400 dark:bg-blue-950 dark:border-blue-700 dark:brightness-110'
                                    : ' bg-gray-200 border-gray-300 dark:bg-neutral-800 dark:border-neutral-700 hover:bg-blue-100 hover:border-blue-400 dark:hover:bg-blue-950 dark:hover:border-blue-800 '
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
                                    class="p-2 flex items-center hover:text-yellow-700 min-w-[32px]"
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
                                    class="p-2 flex items-center hover:text-red-500 min-w-[32px]"
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
                class="py-4 mx-4 border-gray-400 dark:border-gray-500 border-t-2 mb-2 flex"
            >
                <button
                    data-testid="settings-button"
                    class="flex items-center px-2 hover:bg-gray-300 dark:hover:bg-gray-800 rounded-xl cursor-pointer"
                    title="Settings"
                    on:click={() => {
                        settings.show();
                    }}
                >
                    <FontAwesomeIcon icon={faGear} />
                </button>
                <div
                    class="flex mx-2 border-2 border-indigo-600 rounded-full shadow p-1 bg-indigo-50 ml-auto dark:bg-indigo-950"
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
            class="-mr-1 p-2 group cursor-pointer"
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
                class={`w-1 h-6 rounded-2xl bg-gray-400 dark:bg-gray-500 -mb-1 group-hover:bg-gray-500 dark:group-hover:bg-gray-400 transition-all ${
                    $sidebarActive
                        ? 'group-hover:rotate-12'
                        : 'group-hover:-rotate-12'
                }`}
            ></div>
            <div
                class={`w-1 h-6 rounded-2xl bg-gray-400 dark:bg-gray-500 -mb-1 group-hover:bg-gray-500 dark:group-hover:bg-gray-400 transition-all ${
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

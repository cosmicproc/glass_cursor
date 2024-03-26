<script lang="ts">
    import Popup from '$lib/components/Popup.svelte';
    import { notes } from '$lib/stores';

    export let renameNoteTargetIndex: number;
    let renameNote: Popup;

    let name: string = '';

    function handleInput() {
        $notes[renameNoteTargetIndex].name = name;
    }

    export function show() {
        name = $notes[renameNoteTargetIndex]?.name;
        renameNote.show();
    }
</script>

<Popup bind:this={renameNote}>
    <h1 class="mb-6 text-2xl font-bold">Rename the Note</h1>
    <label class="flex items-center">
        <b>Note Name</b>
        <input
            type="text"
            class="input ml-4"
            placeholder="Enter a new name"
            bind:value={name}
            on:input={handleInput}
            on:keydown={(e) => {
                if (e.key === 'Enter') {
                    renameNote.hide();
                }
            }}
        />
    </label>
    <div class="mt-6 flex justify-center">
        <button
            class="btn"
            on:click={() => {
                renameNote.hide();
            }}
            >Close
        </button>
    </div>
</Popup>

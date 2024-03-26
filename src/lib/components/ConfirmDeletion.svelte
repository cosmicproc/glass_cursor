<script lang="ts">
    import Popup from '$lib/components/Popup.svelte';
    import { currentNote, notes } from '$lib/stores';

    export let confirmDeleteTargetName: string;
    export let confirmDeleteTargetIndex: number;
    let confirmDeletion: Popup;

    export function show() {
        confirmDeletion.show();
    }
</script>

<Popup bind:this={confirmDeletion}>
    <h1 class="mb-6 text-2xl font-bold">Delete the Note?</h1>
    <p>
        You are about the delete the note named "<strong
            >{confirmDeleteTargetName}</strong
        >". Are you sure? This action cannot be reverted.
    </p>
    <div class="mt-6 flex justify-center">
        <button
            data-testid="delete-confirm"
            class="btn btn-red"
            on:click={() => {
                let updated = $notes;
                if (updated[confirmDeleteTargetIndex].id === $currentNote) {
                    currentNote.set(-1);
                }
                updated.splice(confirmDeleteTargetIndex, 1);
                notes.set(updated);
                confirmDeletion.hide();
            }}
            >Delete
        </button>
        <button
            class="btn"
            on:click={() => {
                confirmDeletion.hide();
            }}
            >Close
        </button>
    </div>
</Popup>

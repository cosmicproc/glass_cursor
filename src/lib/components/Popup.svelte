<script lang="ts">
    import { trapFocus } from '$lib/utils';

    let status = false;
    let popup: HTMLElement;

    export function show() {
        status = true;
    }

    export function hide() {
        status = false;
    }

    function handleMousedown(event: MouseEvent) {
        if (status && !popup.contains(event.target as Node)) {
            hide();
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            hide();
        }
    }
</script>

<div
    class="absolute w-full h-full flex justify-center items-center z-20 backdrop-blur"
    class:hidden={!status}
    use:trapFocus
>
    <div
        class="max-w-[90dvw] w-[30em] m-8 bg-neutral-100 dark:bg-neutral-900 border-2 dark:border-neutral-700 border-gray-300 shadow-lg rounded-2xl py-8 px-4 sm:px-8 text-center"
        bind:this={popup}
    >
        <slot />
    </div>
</div>

<svelte:body on:keydown={handleKeydown} on:mousedown={handleMousedown} />

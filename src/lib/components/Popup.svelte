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
    class="absolute z-20 flex h-full w-full items-center justify-center backdrop-blur"
    class:hidden={!status}
    use:trapFocus
>
    <div
        class="m-8 w-[30em] max-w-[90dvw] rounded-2xl border-2 border-gray-300 bg-neutral-100 px-4 py-8 text-center shadow-lg sm:px-8 dark:border-neutral-700 dark:bg-neutral-900"
        bind:this={popup}
    >
        <slot />
    </div>
</div>

<svelte:body on:keydown={handleKeydown} on:mousedown={handleMousedown} />

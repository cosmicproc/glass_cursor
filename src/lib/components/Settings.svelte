<script lang="ts">
    import { browser } from '$app/environment';
    import Popup from '$lib/components/Popup.svelte';

    let settings: Popup;

    export function show() {
        return settings.show();
    }

    function handleChange(event: Event) {
        let value = (event.target as HTMLSelectElement).value;
        if (value === 'auto') {
            localStorage.removeItem('theme');
        } else if (value === 'light' || value === 'dark') {
            localStorage.theme = value;
        }
        if (
            localStorage.theme === 'dark' ||
            (!('theme' in localStorage) &&
                window.matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
</script>

<Popup bind:this={settings}>
    <h1 class="mb-6 text-2xl font-bold">Settings</h1>
    <div
        class="my-2 rounded-3xl border-2 border-neutral-400 bg-neutral-200 p-2 px-6 shadow dark:border-neutral-700 dark:bg-neutral-800"
    >
        <label class="flex min-h-10 items-center">
            <span class="mr-4 text-lg font-medium">Theme</span>
            <select
                data-testid="theme-select"
                class="min-w-40x ml-auto rounded-2xl border-2 border-neutral-500 p-2"
                name="theme"
                on:change={handleChange}
            >
                <option
                    value="auto"
                    selected={browser && !('theme' in localStorage)}
                    >Auto (System Theme)
                </option>
                <option
                    value="light"
                    selected={browser && localStorage.theme === 'light'}
                    >Light</option
                >
                <option
                    value="dark"
                    selected={browser && localStorage.theme === 'dark'}
                    >Dark</option
                >
            </select>
        </label>
    </div>

    <button
        class="btn btn-blue mt-4"
        on:click={() => {
            settings.hide();
        }}
        >Close
    </button>
</Popup>

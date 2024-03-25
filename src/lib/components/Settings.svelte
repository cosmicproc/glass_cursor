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
    <h1 class="text-2xl font-bold mb-6">Settings</h1>
    <div
        class="my-2 bg-neutral-200 dark:bg-neutral-800 border-neutral-400 dark:border-neutral-700 border-2 p-2 px-6 rounded-3xl shadow"
    >
        <label class="flex items-center min-h-10">
            <span class="font-medium text-lg mr-4">Theme</span>
            <select
                data-testid="theme-select"
                class="ml-auto border-2 border-neutral-500 rounded-2xl p-2 min-w-40x"
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

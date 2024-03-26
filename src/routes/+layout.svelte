<script>
    import '$lib/app.css';
</script>

<svelte:head>
    <title>Glass Cursor</title>
    <script>
        function updateTheme() {
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

        updateTheme();
        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', updateTheme);
        window
            .matchMedia('(prefers-color-scheme: light)')
            .addEventListener('change', updateTheme);
    </script>
</svelte:head>

<div class="flex min-h-screen flex-col">
    <slot />
</div>

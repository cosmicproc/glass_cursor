<script>
	import '$lib/app.css';
</script>

<svelte:head>
	<title>Glass Cursor</title>

	<script>
		function updateTheme() {
			if (
				localStorage.theme === 'dark' ||
				(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
			) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}

		updateTheme();
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);
		window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', updateTheme);
	</script>
</svelte:head>

<div
	class="dark:bg-black dark:[&>*]:text-white h-[100dvh] overflow-hidden flex flex-col dark:scheme-dark"
>
	<slot />
</div>

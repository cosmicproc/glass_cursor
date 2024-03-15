<script lang="ts">
	import { fly } from 'svelte/transition';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { browser } from '$app/environment';
	import { default as Popup } from '$lib/components/popup.svelte';
	import { currentNote } from '$lib/stores';
	import { onMount } from 'svelte';

	let sidebarActive: boolean | null = null;

	onMount(() => {
		sidebarActive = localStorage.sidebarActive !== '0';
	});

	$: if (browser && sidebarActive !== null) {
		localStorage.setItem('sidebarActive', sidebarActive ? '1' : '0');
	}

	let settings: Popup;
	let confirmDeleteTargetName: string;
	let confirmDeleteTargetIndex: number;
	let confirmDeletePopup: Popup;

	let currentNameHeaders: HTMLElement[] = [];

	let notes = browser && localStorage.notes && JSON.parse(localStorage.notes);
	let notesDiv: HTMLDivElement;
</script>

<div class="flex z-10" data-testid="panel">
	{#if browser || sidebarActive}
		<aside
			data-testid="panel-aside"
			class="bg-neutral-100 dark:bg-neutral-900 w-[95dvw] sm:w-80 px-2 flex flex-col transition-all duration-300${!sidebarActive
				? ' -ml-[95dvw] md:-ml-80'
				: ''}"
		>
			<div class="py-4 mx-4 border-gray-400 dark:border-gray-500 border-b-2 flex mt-2">
				<div class="basis-full">
					<h1 class="font-bold text-2xl">Your Notes</h1>
				</div>
				<button
					class="flex items-center hover:bg-gray-300 dark:hover:bg-gray-800 rounded-xl cursor-pointer"
					title="New Note"
					data-testid="new-note"
					on:click={() => {
						notesDiv.scrollTop = notesDiv.scrollHeight;
						const id = localStorage.notes
							? Math.max(...JSON.parse(localStorage.notes).map((o) => o.id)) + 1
							: 0;
						const newNote = { id: id, name: 'Untitled Note', content: '' };
						const updated = localStorage.notes
							? [...JSON.parse(localStorage.notes), newNote]
							: [newNote];
						localStorage.setItem('notes', JSON.stringify(updated));
						notes = updated;

						notesDiv.scrollIntoView();
					}}
				>
					<i class="fa-solid fa-plus p-2 fa-lg"></i>
				</button>
			</div>
			<div class="px-6 pb-4 overflow-auto h-full" bind:this={notesDiv}>
				{#if notes && notes.length !== 0}
					{#each notes as note (note.id)}
						<div
							class="shadow w-full rounded-2xl my-4 p-2 pl-4 border-2 hover:bg-blue-100 hover:border-blue-400 dark:hover:bg-blue-950 dark:hover:border-blue-800 flex items-center
							{$currentNote === note.id
								? ' bg-blue-200 border-blue-400 dark:bg-blue-950 dark:border-blue-700 dark:brightness-110'
								: ' bg-gray-200 border-gray-300 dark:bg-neutral-800 dark:border-neutral-700'}"
							data-testid="note"
							id={($currentNote === note.id && 'current-note') || ''}
							in:fly
							out:fly
							on:click={(e) => {
								if (e.target?.tagName !== 'I') {
									currentNote.set(note.id);
								}
							}}
							on:keydown={(e) => {
								if (e.key === 'Enter' && e.target?.tagName !== 'I') {
									currentNote.set(note.id);
								}
							}}
							role="button"
							tabindex="0"
						>
							<div class="overflow-auto mr-1">
								<h1
									class="font-semibold outline-none"
									bind:this={currentNameHeaders[note.id]}
									on:input={(e) => {
										let updated = JSON.parse(localStorage.notes);
										const index = updated.findIndex((o) => o.id === note.id);
										updated[index].name = e.target?.textContent;
										localStorage.setItem('notes', JSON.stringify(updated));
										notes = updated;
									}}
									on:focusout={() => {
										currentNameHeaders[note.id].contentEditable = 'false';
									}}
								>
									{note.name}
								</h1>
							</div>
							<div class="ml-auto flex">
								<button
									class="p-2 flex items-center hover:text-yellow-700 min-w-[32px]"
									data-testid="rename"
									title="Rename"
									on:click={() => {
										currentNameHeaders[note.id].contentEditable = 'true';
										currentNameHeaders[note.id].focus();
									}}
								>
									<i class="fa-solid fa-pencil"></i>
								</button>
								<button
									class="p-2 flex items-center hover:text-red-500 min-w-[32px]"
									data-testid="delete"
									title="Delete"
									on:click={() => {
										confirmDeleteTargetName = note.name;
										confirmDeleteTargetIndex = JSON.parse(localStorage.notes).findIndex(
											(o) => o.id === note.id
										);
										confirmDeletePopup.show();
									}}
								>
									<i class="fa-solid fa-trash-can"></i>
								</button>
							</div>
						</div>
					{/each}
				{:else}
					<p class="mt-4" data-testid="no-notes">You don't have any notes.</p>
				{/if}
			</div>
			<div class="py-4 mx-4 border-gray-400 dark:border-gray-500 border-t-2 mb-2 flex">
				<button
					data-testid="settings-button"
					class="flex items-center px-2 hover:bg-gray-300 dark:hover:bg-gray-800 rounded-xl cursor-pointer"
					title="Settings"
					on:click={() => {
						settings.show();
					}}
				>
					<i class="fa-solid fa-gear"></i>
				</button>
				<div
					class="flex mx-2 border-2 border-indigo-600 rounded-full shadow p-1 bg-indigo-50 ml-auto dark:bg-indigo-950"
				>
					<img src="./images/glass_cursor.svg" width="24" alt="logo" class="inline" />
					<span class="mx-1 align-middle font-medium">Glass Cursor</span>
				</div>
			</div>
		</aside>
	{/if}
	<div class="flex items-center">
		<button
			data-testid="toggle-panel"
			class="-mr-1 p-2 group cursor-pointer"
			title={sidebarActive ? 'Hide' : 'Show'}
			on:click={() => {
				sidebarActive = !sidebarActive;
			}}
			on:keydown={(e) => {
				if (e.key === 'f') {
					sidebarActive = !sidebarActive;
				}
			}}
		>
			<div
				class="w-1 h-6 rounded-2xl bg-gray-400 dark:bg-gray-500 -mb-1 group-hover:bg-gray-500 dark:group-hover:bg-gray-400 transition-all {sidebarActive
					? 'group-hover:rotate-12'
					: 'group-hover:-rotate-12'}"
			></div>
			<div
				class="w-1 h-6 rounded-2xl bg-gray-400 dark:bg-gray-500 -mb-1 group-hover:bg-gray-500 dark:group-hover:bg-gray-400 transition-all {sidebarActive
					? 'group-hover:-rotate-12'
					: 'group-hover:rotate-12'}"
				f
			></div>
		</button>
	</div>
</div>

<Popup bind:this={settings}>
	<h1 class="text-2xl font-bold mb-6">Settings</h1>
	<div
		class="my-2 bg-neutral-200 dark:bg-neutral-800 border-neutral-400 dark:border-neutral-700 border-2 p-2 px-6 rounded-3xl shadow"
	>
		<label class="flex items-center min-h-10">
			<span class="font-medium text-lg mr-4">Theme</span>
			<select
				data-testid="theme-select"
				class="ml-auto bg-gray-200 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 rounded-2xl p-2 min-w-40x"
				name="theme"
				on:change={(e) => {
					let value = e.target?.value;
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
				}}
			>
				<option value="auto" selected={browser && !('theme' in localStorage)}
					>Auto (System Theme)
				</option>
				<option value="light" selected={browser && localStorage.theme === 'light'}>Light</option>
				<option value="dark" selected={browser && localStorage.theme === 'dark'}>Dark</option>
			</select>
		</label>
	</div>

	<button
		class="btn btn-primary mt-4"
		on:click={() => {
			settings.hide();
		}}
		>Close
	</button>
</Popup>

<Popup bind:this={confirmDeletePopup}>
	<h1 class="text-2xl font-bold mb-6">Delete the note?</h1>
	<p>
		You are about the delete the note named "{confirmDeleteTargetName}". Are you sure? This action
		cannot be reverted.
	</p>
	<div class="flex mt-6 justify-center">
		<button
			data-testid="delete-confirm"
			class="btn"
			on:click={() => {
				let updated = JSON.parse(localStorage.notes);
				if (updated[confirmDeleteTargetIndex].id === $currentNote) {
					currentNote.set(-1);
				}
				updated.splice(confirmDeleteTargetIndex, 1);
				localStorage.setItem('notes', JSON.stringify(updated));
				notes = updated;
				confirmDeletePopup.hide();
			}}
			>Delete
		</button>
		<button
			class="btn btn-primary"
			on:click={() => {
				confirmDeletePopup.hide();
			}}
			>Close
		</button>
	</div>
</Popup>

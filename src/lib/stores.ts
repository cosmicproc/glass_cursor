import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const currentNote = writable(
	browser && localStorage.currentNote !== undefined ? JSON.parse(localStorage.currentNote) : -1
);
currentNote.subscribe((value: number) => {
	if (browser) {
		localStorage.setItem('currentNote', JSON.stringify(value));
	}
});

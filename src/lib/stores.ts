import { browser } from '$app/environment';
import { writable } from 'svelte/store';

function fetchLocalStorage(key: string, fallback: unknown) {
    try {
        return JSON.parse(localStorage[key]);
    } catch {
        return fallback;
    }
}

function localStorageUpdater(key: string) {
    return (value: unknown) => {
        if (browser) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    };
}

export const currentNote = writable(fetchLocalStorage('currentNote', -1));
currentNote.subscribe(localStorageUpdater('currentNote'));

export const notes = writable(fetchLocalStorage('notes', []));
notes.subscribe(localStorageUpdater('notes'));

export const sourceExtended = writable(
    fetchLocalStorage('sourceExtended', false),
);
sourceExtended.subscribe(localStorageUpdater('sourceExtended'));

export const previewExtended = writable(
    fetchLocalStorage('previewExtended', false),
);
previewExtended.subscribe(localStorageUpdater('previewExtended'));

export const sidebarActive = writable(fetchLocalStorage('sidebarActive', true));
sidebarActive.subscribe(localStorageUpdater('sidebarActive'));

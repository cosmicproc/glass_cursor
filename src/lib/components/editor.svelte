<script lang="ts">
	import markdownit from 'markdown-it';
	import hljs from 'highlight.js';
	import 'highlight.js/styles/monokai.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { browser } from '$app/environment';
	import { currentNote } from '$lib/stores';

	const md = markdownit({
		linkify: true,
		typographer: true,
		breaks: true,
		highlight: function (str: string, lang: string) {
			if (lang && hljs.getLanguage(lang)) {
				try {
					return hljs.highlight(str, { language: lang }).value;
				} catch (__) {
					/* empty */
				}
			}

			try {
				return hljs.highlightAuto(str).value;
			} catch (err) {
				/* empty */
			}

			return '';
		}
	});

	let source: HTMLElement;
	let preview: HTMLElement;
	let sourceContent: string | undefined;
	let previewContent: string = '';

	let sourceExtended = false;
	let previewExtended = false;

	$: if (browser) {
		sourceExtended = localStorage.sourceExtended && localStorage.sourceExtended !== '0';
	}
	$: if (browser) {
		localStorage.setItem('sourceExtended', sourceExtended ? '1' : '0');
	}

	$: if (browser) {
		previewExtended = localStorage.previewExtended && localStorage.previewExtended !== '0';
	}
	$: if (browser) {
		localStorage.setItem('previewExtended', previewExtended ? '1' : '0');
	}

	$: if (sourceContent !== undefined) {
		previewContent = md.render(sourceContent);
	}

	$: if (browser && localStorage.notes) {
		if ($currentNote !== -1) {
			const notes = JSON.parse(localStorage.notes);
			const index = notes.findIndex((o: { id: number }) => o.id === $currentNote);
			sourceContent = JSON.parse(localStorage.notes)[index].content;
		} else {
			sourceContent = '';
		}
	}

	$: if (browser && localStorage.notes && $currentNote !== -1) {
		const notes = JSON.parse(localStorage.notes);
		const index = notes.findIndex((o: { id: number }) => o.id === $currentNote);
		const updated = JSON.parse(localStorage.notes);
		updated[index].content = sourceContent;
		localStorage.setItem('notes', JSON.stringify(updated));
	}

	let autoSynced = false;
	function syncScroll(this: HTMLElement) {
		let first = preview;
		let second = source;
		if (this === source) {
			first = source;
			second = preview;
		} else if (this !== preview) {
			return;
		}
		const firstHeight = first.scrollHeight - first.clientHeight;
		const secondHeight = second.scrollHeight - second.clientHeight;
		if (!autoSynced) {
			autoSynced = true;
			second.scrollTop = (first.scrollTop / firstHeight) * secondHeight;
		} else {
			autoSynced = false;
		}
	}

	function randomPlaceholder() {
		const placeholders = [
			'Dump your mind here',
			'Type what you think',
			'This is your canvas',
			'Start here when you are ready'
		];
		return placeholders[Math.round(Math.random() * (placeholders.length - 1))];
	}

	function handleKeydown(this: HTMLTextAreaElement, e: KeyboardEvent) {
		if (e.key === 'Tab') {
			e.preventDefault();
			const selStart = this?.selectionStart;
			const selEnd = this?.selectionEnd;
			this.value = this.value.substring(0, selStart) + '\t' + this.value.substring(selEnd);
		}
	}
</script>

<div class="flex flex-grow basis-0 p-10 overflow-hidden flex-col lg:flex-row">
	<div
		class="border-2 border-neutral-300 dark:border-neutral-500 rounded-3xl overflow-hidden lg:w-1/2 h-1/2 lg:h-full flex flex-col flex-grow shadow-lg transition-all duration-300 mb-4 lg:mb-0 {previewExtended &&
		!sourceExtended
			? 'lg:-ml-[110%] lg:mr-24'
			: 'lg:mr-2'}"
	>
		<div
			class="w-full p-4 text-center backdrop-blur bg-neutral-200 dark:bg-neutral-800 bg-opacity-70 dark:bg-opacity-70 flex"
		>
			<a
				href="https://commonmark.org/help/"
				title="Help"
				class="hover:bg-gray-300 dark:hover:bg-gray-700 rounded-xl px-2 flex items-center"
			>
				<i class="fa-solid fa-question"></i>
			</a>
			<strong class="mx-auto">
				<i class="fa-brands fa-markdown align-middle min-w-[16px]"></i>
				<span class="align-middle ml-1">Markdown Editor</span>
			</strong>
			<button
				title={sourceExtended ? 'Shrink' : 'Extend'}
				data-testid="resize-editor"
				class="hover:bg-gray-300 dark:hover:bg-gray-700 rounded-xl px-2 cursor-pointer invisible lg:visible"
				on:click={() => {
					sourceExtended = !sourceExtended;
				}}
			>
				{#if sourceExtended}
					<i class="fa-solid fa-arrow-left"></i>
				{:else}
					<i class="fa-solid fa-arrow-right"></i>
				{/if}
			</button>
		</div>
		<div class="overflow-auto -mt-16 h-full w-full flex flex-grow">
			<textarea
				data-testid="editor"
				class="outline-none bg-transparent resize-none p-6 font-mono w-full pt-[5.5em] pb-8"
				placeholder={$currentNote === -1
					? 'Choose a note from the left-hand side panel to edit.'
					: randomPlaceholder()}
				disabled={$currentNote === -1}
				bind:this={source}
				on:scroll={syncScroll}
				bind:value={sourceContent}
				on:keydown={handleKeydown}
				name="editor"
			></textarea>
		</div>
	</div>
	<div
		class="border-2 border-neutral-300 dark:border-neutral-500 rounded-3xl overflow-hidden lg:w-1/2 h-1/2 lg:h-full flex flex-col flex-grow shadow-lg transition-all duration-300 mt-4 lg:mt-0 {sourceExtended &&
		!previewExtended
			? 'lg:-mr-[110%] lg:ml-24'
			: 'lg:ml-2'}"
	>
		<div
			class="w-full p-4 text-center backdrop-blur bg-neutral-200 dark:bg-neutral-800 bg-opacity-70 dark:bg-opacity-70 flex"
		>
			<button
				title={previewExtended ? 'Shrink' : 'Extend'}
				data-testid="resize-result-text"
				class="hover:bg-gray-300 dark:hover:bg-gray-700 rounded-xl px-2 cursor-pointer invisible lg:visible"
				on:click={() => {
					previewExtended = !previewExtended;
				}}
			>
				{#if previewExtended}
					<i class="fa-solid fa-arrow-right"></i>
				{:else}
					<i class="fa-solid fa-arrow-left"></i>
				{/if}
			</button>
			<strong class="mx-auto">
				<i class="fa-solid fa-align-left align-middle min-w-[16px]"></i>
				<span class="align-middle ml-1">Formatted Text</span>
			</strong>
			<div class="w-[30px]"></div>
		</div>
		<div class="overflow-auto -mt-16 pt-[5.5em] px-6" bind:this={preview} on:scroll={syncScroll}>
			<article
				data-testid="result-text"
				class="prose dark:prose-invert dark:prose-pre:bg-gray-900 break-word pb-8 mx-auto"
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html previewContent}
			</article>
		</div>
	</div>
</div>

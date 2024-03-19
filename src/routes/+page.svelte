<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';

	let cursor: HTMLElement | null;
	let sentence: HTMLElement | null;

	let cursorToggle = 0;

	function toggleCursor() {
		if (cursor) {
			cursor.style.visibility = cursor.style.visibility === 'visible' ? 'hidden' : 'visible';
		}
	}

	async function shortTypingBreak() {
		if (cursor) {
			cursorToggle = setInterval(toggleCursor, 400);
			await sleep(randRange(800, 2000));
			clearInterval(cursorToggle);
			cursor.style.visibility = 'visible';
		}
	}

	let sentenceCursor = 0;
	const sentences = [
		[
			['Zero', 'text-blue-600'],
			['-distraction. Only ', null],
			['you', 'text-red-600'],
			[' and your ', null],
			['text', 'text-gray-500'],
			['.', null]
		],
		[
			['Free', 'text-green-600'],
			[' and ', null],
			['open source', 'text-blue-600']
		],
		[
			['Works ', null],
			['everywhere', 'text-blue-600'],
			[', thanks to web', null]
		],
		[
			['Runs ', null],
			['entirely', 'text-purple-600'],
			[' on your browser', null]
		],
		[
			['Markdown', 'text-orange-600'],
			['-powered', null]
		],
		[
			['Capture your ', null],
			['mind', 'text-yellow-600'],
			[' without ever losing ', null],
			['focus', 'text-red-600']
		]
	];

	function sleep(ms = 0) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	function randRange(minNum: number, maxNum: number) {
		return Math.random() * (maxNum - minNum) + minNum;
	}

	let frame: number;
	onMount(async () => {
		async function changeSentence() {
			await sleep(randRange(5000, 8000));
			if (cursor && sentence) {
				cursor.style.display = 'inline';
				await shortTypingBreak();
				while (sentence.childNodes.length > 0) {
					const lastChild = sentence.lastChild;
					if (lastChild) {
						while (lastChild.textContent!.length != 0) {
							const index = lastChild.textContent!.length;
							// Check if double byte char.
							// eslint-disable-next-line no-control-regex
							if (new RegExp('[^\u0000-\u00ff]').test(lastChild.textContent!.charAt(index - 1))) {
								lastChild.textContent = lastChild.textContent!.substring(0, index - 2);
							} else {
								lastChild.textContent = lastChild.textContent!.substring(0, index - 1);
							}
							await sleep(50);
						}
						lastChild.remove();
					}
				}
				await shortTypingBreak();
				if (sentenceCursor > sentences.length - 1) {
					sentenceCursor = 0;
				}
				const nextSentence = sentences[sentenceCursor++];
				let nextSentenceCursor = 0;
				while (nextSentenceCursor < nextSentence.length) {
					const newChild = document.createElement('span');
					newChild.className = nextSentence[nextSentenceCursor][1]!;
					const newText = nextSentence[nextSentenceCursor][0]!;
					sentence.appendChild(newChild);
					while (newChild.textContent!.length < newText.length) {
						const index = newChild.textContent!.length + 1;
						// Check if double byte char.
						// eslint-disable-next-line no-control-regex
						if (new RegExp('[^\u0000-\u00ff]').test(newText.charAt(index))) {
							newChild.textContent = newText.substring(0, index + 2);
						} else {
							newChild.textContent = newText.substring(0, index + 1);
						}
						await sleep(randRange(50, 80));
					}
					nextSentenceCursor++;
				}
				cursor.style.display = '';
			} else {
				throw new Error();
			}
			frame = requestAnimationFrame(changeSentence);
		}

		changeSentence();
	});

	onDestroy(() => browser && cancelAnimationFrame(frame));
</script>

<div class="flex flex-col items-center justify-center m-auto p-10 mx-8">
	<div
		class="p-4 border-4 border-indigo-600 rounded-full shadow-xl bg-indigo-50 dark:bg-indigo-950 text-pretty"
	>
		<img src="images/glass_cursor.svg" width="64" alt="logo" class="inline" />
		<span class="align-middle m-4 text-2xl font-bold">Glass Cursor</span>
	</div>
	<div class="sm:h-36 h-52 flex items-center">
		<h1 class="lg:text-5xl text-4xl font-bold text-center leading-tight">
			<span bind:this={sentence}>
				Capture your <span class="text-yellow-600">mind</span> without ever losing
				<span class="text-red-600">focus</span>
			</span>
			<span class="font-light hidden" bind:this={cursor}>|</span>
		</h1>
	</div>
	<p class="lg:text-xl max-w-4xl text-center">
		Glass Cursor is a free and open source web-based simple markdown note-taking app. It can be used
		for writing text for any reason with markdown. It's designed to be simple but yet useful. With
		its elegant user interface, you can focus on your notes without any friction. For more
		information, see the
		<a href="./faq" class="link">FAQ</a>.
	</p>
	<div class="flex items-center justify-center mt-10">
		<a href="./app" class="btn btn-primary">Open app</a>
	</div>
</div>

<script lang="ts">
    import * as Sentences from '$lib/components/homepageSentences/index';
    import BlurryCloud from '$lib/components/svg/BlurryCloud.svelte';
    import Logo from '$lib/components/svg/Logo.svelte';
    import { typewriter } from '$lib/transitions';
    import { onMount } from 'svelte';

    let cursor: HTMLElement;

    let sentenceCursor = 0;
    const sentences = [
        Sentences._1,
        Sentences._2,
        Sentences._3,
        Sentences._4,
        Sentences._5,
    ];

    const sentenceIntervalTime = 10000;
    onMount(() => {
        const sentenceInterval = setInterval(() => {
            if (sentenceCursor >= sentences.length - 1) {
                sentenceCursor = 0;
            } else {
                sentenceCursor++;
            }
        }, sentenceIntervalTime);

        return () => {
            clearInterval(sentenceInterval);
        };
    });

    const maxDuration = sentenceIntervalTime / 4;
</script>

<div class="flex flex-col items-center justify-center m-auto p-10 mx-8">
    <div
        class="p-2 sm:p-4 border-4 border-indigo-600 rounded-full shadow-lg bg-indigo-50 dark:bg-indigo-950 text-nowrap"
    >
        <Logo classList="inline w-10 md:w-12" />
        <span
            class="align-middle m-2 text-lg sm:text-xl lg:text-2xl font-semibold"
            >Glass Cursor</span
        >
    </div>
    <div
        class="flex items-center my-2 sm:my-8 min-h-40 sm:min-h-32 md:min-h-24"
    >
        <h1
            class="text-3xl sm:text-4xl lg:text-5xl font-bold text-center leading-tight"
        >
            {#key sentenceCursor}
                <span
                    in:typewriter={{
                        delay: maxDuration,
                        maxDuration,
                        cursor,
                    }}
                    out:typewriter={{ maxDuration, cursor }}
                >
                    <svelte:component this={sentences[sentenceCursor]} />
                </span>
            {/key}
            <span class="font-light hidden" bind:this={cursor}>|</span>
        </h1>
    </div>
    <p class="lg:text-xl max-w-5xl text-center text-pretty">
        Glass Cursor is a free and open source simple web-based markdown
        note-taking app. It can be used for writing text for any purpose with
        markdown. It's designed to be simple but yet useful. With its elegant
        user interface, you can focus on your notes without any friction. For
        more information, see the
        <a href="./faq" class="link">FAQ</a>.
    </p>
    <a href="./app" class="btn btn-blue mt-6">Open app</a>
</div>
<div
    class="h-screen w-screen overflow-hidden absolute inset-0 m-auto -z-10 hidden dark:md:flex"
>
    <BlurryCloud classList="m-auto" />
</div>

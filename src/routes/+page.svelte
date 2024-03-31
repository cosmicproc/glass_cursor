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

<div class="m-auto mx-8 flex flex-col items-center justify-center p-10">
    <div
        class="text-nowrap rounded-full border-4 border-indigo-600 bg-indigo-50 p-2 shadow-lg sm:p-4 dark:bg-indigo-950"
    >
        <Logo classList="inline w-10 md:w-12" />
        <span
            class="m-2 align-middle text-lg font-semibold sm:text-xl lg:text-2xl"
            >Glass Cursor</span
        >
    </div>
    <div
        class="my-2 flex min-h-40 items-center sm:my-8 sm:min-h-32 md:min-h-24"
    >
        <h1
            class="text-center text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl"
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
            <span class="hidden font-light" bind:this={cursor}>|</span>
        </h1>
    </div>
    <p class="max-w-5xl text-pretty text-center lg:text-xl">
        Glass Cursor is a free and open source simple web-based note-taking app.
        It can be used for writing text for any purpose. It's designed to be
        simple but yet useful. With its elegant user interface, you can focus on
        your notes without any friction. For more information, see the
        <a href="./faq" class="link">FAQ</a>.
    </p>
    <a href="./app" class="btn btn-blue mt-6">Open app</a>
</div>
<div
    class="absolute inset-0 -z-10 m-auto hidden h-screen w-screen overflow-hidden dark:md:flex"
>
    <BlurryCloud classList="m-auto" />
</div>

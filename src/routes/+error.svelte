<script>
    import { page } from '$app/stores';
</script>

<div class="mx-auto flex max-w-xl sm:my-auto">
    <div
        class="sm:action-box m-10 flex flex-grow flex-col items-center rounded-3xl border-2 p-8 pt-12 text-center"
    >
        <h1 class="text-3xl font-bold">
            {$page.status}: {$page.error?.message}
        </h1>
        <div class="my-4 text-lg">
            {#if $page.status === 404}
                <p>Sorry. We couldn't find what you are looking for.</p>
            {:else}
                <p>An error has occured.</p>
            {/if}
        </div>
        <a class="btn btn-blue" href="./">Go Home</a>
    </div>
</div>

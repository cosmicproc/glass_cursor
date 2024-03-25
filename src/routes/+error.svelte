<script>
    import { page } from '$app/stores';
</script>

<div class="sm:my-auto max-w-xl mx-auto flex">
    <div
        class="sm:action-box flex flex-col flex-grow items-center m-10 text-center border-2 p-8 pt-12 rounded-3xl"
    >
        <h1 class="text-3xl font-bold">
            {$page.status}: {$page.error?.message}
        </h1>
        <div class="text-lg my-4">
            {#if $page.status === 404}
                <p>Sorry. We couldn't find what you are looking for.</p>
            {:else}
                <p>An error has occured.</p>
            {/if}
        </div>
        <a class="btn btn-blue" href="./">Go Home</a>
    </div>
</div>

<script lang="ts">
    import initEditor from '$lib/editor/initEditor';
    import { twMerge } from 'tailwind-merge';

    let editorEle: HTMLDivElement;

    const [editorAction, { toolbarStore, debugStore, stateStore }] =
        initEditor();
</script>

<div>
    <div class="flex gap-2 overflow-clip px-6">
        {#each $toolbarStore as { label, active, handler, icon, ariaLabel }}
            <button
                on:click|preventDefault={handler}
                title={label}
                aria-label={ariaLabel}
                class={twMerge(
                    'flex flex-col items-center justify-center rounded-t border border-white px-3 py-2 shadow-lg hover:border-gray-lighter hover:border-b-white hover:shadow-gray-lightish',
                    active && 'border-black',
                )}
            >
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html icon}
            </button>
        {/each}
    </div>

    <div>
        <div
            contenteditable="true"
            bind:this={editorEle}
            use:editorAction
            class="ucla-prose rounded-md border border-gray-lightest bg-white px-4 py-5 shadow-lg"
        >
            <!-- todo: Use a headless editor to SSR what should normally be here -->
            Loading editor...
        </div>

        <div class="px-4">
            <div
                class="whitespace-pre rounded-b-md border-x border-b border-gray-lightest bg-gray-lightest-morest font-mono text-xs shadow-lg"
            >
                <div
                    class="grid grid-cols-1 divide-x divide-gray md:grid-cols-2"
                >
                    <div class="overflow-x-auto p-2">{$debugStore}</div>
                    <div class="overflow-x-auto p-2">{$stateStore}</div>
                </div>
            </div>
        </div>
    </div>
</div>

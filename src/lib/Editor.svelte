<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { initEditor } from './editorInit';
    import './editorStyles.css';

    let editorEle: HTMLDivElement;

    const debugStore = writable('');
    const toolbarStore = writable<
        {
            label: string;
            action: () => void;
            icon: string;
        }[]
    >([]);

    onMount(() => {
        const destroyEditor = initEditor(editorEle, {
            debugStore,
            toolbarStore,
        });
        return destroyEditor;
    });
</script>

<div class="toolbar">
    {#each $toolbarStore as { label, action, icon }}
        <button on:click|preventDefault={action} aria-label={label}>
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html icon}
        </button>
    {/each}
</div>

<div contenteditable="true" bind:this={editorEle} class="editor">
    Loading editor...
</div>

<div class="debug">
    <pre>{$debugStore}</pre>
</div>

<style>
    :global(body) {
        background: #efefef;
    }
    .toolbar {
        display: flex;
        gap: 0.5rem;
        overflow: clip;
        padding-left: 1.5rem;
        padding-right: 1.5rem;
    }
    .toolbar button {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 0.375rem 0.375rem 0 0;
        border-width: 1px;
        border-color: white;
        padding-left: 0.75rem;
        padding-right: 0.75rem;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.05);
        background: #fefefe;
        border: none;
    }
    .toolbar button:hover {
        background: #f3f4f6;
    }
    .editor {
        border-radius: 0.375rem;
        border-width: 1px;
        border-color: #f3f4f6;
        padding-left: 1rem;
        padding-right: 1rem;
        border: 1px solid #f3f4f6;
        box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.05);
        background: #fefefe;
    }
    .debug {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
        overflow-x: auto;
        background: #f8f8f8;
        margin-top: 0.5rem;
        border-radius: 0.375rem;
    }
</style>

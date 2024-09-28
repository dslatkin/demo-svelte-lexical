import {
    generateContent,
    registerLexicalCommandLogger,
    type LexicalCommandLog,
} from '@lexical/devtools-core';
import { registerDragonSupport } from '@lexical/dragon';
import { createEmptyHistoryState, registerHistory } from '@lexical/history';
import {
    $createQuoteNode,
    HeadingNode,
    QuoteNode,
    registerRichText,
} from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import { $getSelection, createEditor } from 'lexical';
import { get, writable, type Writable } from 'svelte/store';
import prepopulatedRichText from './editorPrepopulatedRichText';

export const initEditor = (
    editorEle: HTMLDivElement,
    {
        debugStore,
        toolbarStore,
    }: {
        debugStore: Writable<string>;
        toolbarStore: Writable<
            {
                label: string;
                action: () => void;
                icon: string;
            }[]
        >;
    },
) => {
    const editor = createEditor({
        namespace: 'JS Demo',
        nodes: [HeadingNode, QuoteNode],
        onError: (error: Error) => {
            throw error;
        },
        theme: {
            quote: 'PlaygroundEditorTheme__quote',
        },
    });

    editor.setRootElement(editorEle);
    mergeRegister(
        registerRichText(editor),
        registerDragonSupport(editor),
        registerHistory(editor, createEmptyHistoryState(), 300),
    );

    // Prepopulate the editor with some rich text
    //
    // The `history-merge` tag is used to prevent the prepopulated content from
    // being added to the history (instead merging it to the top of the history
    // stack).
    editor.update(prepopulatedRichText, { tag: 'history-merge' });

    // Wire up debug store
    const commands = writable<LexicalCommandLog>([]);
    const unregisterCommandLogger = registerLexicalCommandLogger(
        editor,
        commands.update,
    );
    const exportDom = false; // todo: Make this a store to toggle exportDom
    editor.registerUpdateListener(() => {
        debugStore.set(generateContent(editor, get(commands), exportDom));
    });

    // Wire up toolbar store
    toolbarStore.set([
        {
            label: 'H1',
            action: () => {
                console.log('H1');
            },
            icon: `<svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-type-h1"
            >
                <path
                    d="M8.637 13V3.669H7.379V7.62H2.758V3.67H1.5V13h1.258V8.728h4.62V13h1.259zm5.329 0V3.669h-1.244L10.5 5.316v1.265l2.16-1.565h.062V13h1.244z"
                />
            </svg>`,
        },
        {
            label: 'H2',
            action: () => {
                console.log('H2');
            },
            icon: `<svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-type-h2"
            >
                <path
                    d="M7.638 13V3.669H6.38V7.62H1.759V3.67H.5V13h1.258V8.728h4.62V13h1.259zm3.022-6.733v-.048c0-.889.63-1.668 1.716-1.668.957 0 1.675.608 1.675 1.572 0 .855-.554 1.504-1.067 2.085l-3.513 3.999V13H15.5v-1.094h-4.245v-.075l2.481-2.844c.875-.998 1.586-1.784 1.586-2.953 0-1.463-1.155-2.556-2.919-2.556-1.941 0-2.966 1.326-2.966 2.74v.049h1.223z"
                />
            </svg>`,
        },
        {
            label: 'H3',
            action: () => {
                console.log('H3');
            },
            icon: `<svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-type-h3"
            >
                <path
                    d="M7.637 13V3.669H6.379V7.62H1.758V3.67H.5V13h1.258V8.728h4.62V13h1.259zm3.625-4.272h1.018c1.142 0 1.935.67 1.949 1.674.013 1.005-.78 1.737-2.01 1.73-1.08-.007-1.853-.588-1.935-1.32H9.108c.069 1.327 1.224 2.386 3.083 2.386 1.935 0 3.343-1.155 3.309-2.789-.027-1.51-1.251-2.16-2.037-2.249v-.068c.704-.123 1.764-.91 1.723-2.229-.035-1.353-1.176-2.4-2.954-2.385-1.873.006-2.857 1.162-2.898 2.358h1.196c.062-.69.711-1.299 1.696-1.299.998 0 1.695.622 1.695 1.525.007.922-.718 1.592-1.695 1.592h-.964v1.074z"
                />
            </svg>`,
        },
        {
            label: 'Quote',
            action: () => {
                editor.update(() => {
                    console.log('Start: Apply quote');
                    const selection = $getSelection();
                    console.log(selection);
                    // ! Figure out why the next line is not working and giving a linting error
                    $setBlocksType(selection, () => $createQuoteNode());
                    console.log('End: Apply quote');
                });
            },
            icon: `<svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-chat-square-quote"
            >
                <path
                    d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
                />
                <path
                    d="M7.066 4.76A1.665 1.665 0 0 0 4 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z"
                />
            </svg>`,
        },
    ]);

    return [
        unregisterCommandLogger,
        {
            debugStore,
        },
    ] as const;
};

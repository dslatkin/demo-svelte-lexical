import {
    generateContent,
    registerLexicalCommandLogger,
    type LexicalCommandLog,
} from '@lexical/devtools-core';
import { registerDragonSupport } from '@lexical/dragon';
import { createEmptyHistoryState, registerHistory } from '@lexical/history';
import { HeadingNode, QuoteNode, registerRichText } from '@lexical/rich-text';
import { mergeRegister } from '@lexical/utils';
import {
    COMMAND_PRIORITY_CRITICAL,
    createEditor,
    SELECTION_CHANGE_COMMAND,
    TextNode,
} from 'lexical';
import type { Action } from 'svelte/action';
import { get, writable } from 'svelte/store';
import createToolbarStore from './createToolbarStore';
import { $populateRichText } from './defaultState';
import { UclaTextNode } from './nodes/UclaTextNode';
import './styles.css';

export default () => {
    const debugStore = writable<string>('');
    const stateStore = writable<string>('');
    const toolbarStore = createToolbarStore();

    const editorAction: Action<HTMLDivElement> = (editorEle) => {
        const editor = createEditor({
            namespace: 'Vanilla JS Demo',
            nodes: [
                UclaTextNode,
                {
                    replace: TextNode,
                    with: (node: TextNode) => new UclaTextNode(node.__text),
                    withKlass: UclaTextNode,
                },
                HeadingNode,
                QuoteNode,
            ],
            onError: (error: Error) => {
                throw error;
            },
            theme: {
                quote: 'PlaygroundEditorTheme__quote',
            },
        });

        editor.setRootElement(editorEle);

        toolbarStore.init(editor);

        const commands = writable<LexicalCommandLog>([]);

        const exportDom = false; // todo: Make this a store to toggle exportDom

        const cleanupListeners = mergeRegister(
            registerRichText(editor),
            registerDragonSupport(editor),
            registerHistory(editor, createEmptyHistoryState(), 300),
            registerLexicalCommandLogger(editor, commands.update),
            editor.registerUpdateListener(({ editorState }) => {
                debugStore.set(
                    generateContent(editor, get(commands), exportDom),
                );
                stateStore.set(
                    JSON.stringify(editor.getEditorState().toJSON(), null, 2),
                );
                editorState.read(() => {
                    toolbarStore.$update();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (payload, editor) => {
                    editor.read(() => {
                        toolbarStore.$update();
                    });
                    return false; // allows the command to propagate
                },
                COMMAND_PRIORITY_CRITICAL,
            ),
        );

        // The `history-merge` tag is used to prevent the prepopulated content from
        // being added to the history (instead merging it to the top of the history
        // stack).
        editor.update($populateRichText, { tag: 'history-merge' });

        return {
            destroy: cleanupListeners,
        };
    };

    return [
        editorAction,
        {
            toolbarStore,
            debugStore,
            stateStore,
        },
    ] as const;
};

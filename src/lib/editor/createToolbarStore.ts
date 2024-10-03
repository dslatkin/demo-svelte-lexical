import {
    $createHeadingNode,
    $createQuoteNode,
    $isHeadingNode,
} from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $findMatchingParent, IS_APPLE } from '@lexical/utils';
import {
    $createParagraphNode,
    $getSelection,
    $isRangeSelection,
    $isRootOrShadowRoot,
    FORMAT_TEXT_COMMAND,
    type LexicalEditor,
} from 'lexical';
import { derived, writable } from 'svelte/store';
import boldIcon from './icons/bold.svg?raw';
// import heading1Icon from './icons/heading1.svg?raw';
import heading2Icon from './icons/heading2.svg?raw';
import heading3Icon from './icons/heading3.svg?raw';
// import heading4Icon from './icons/heading4.svg?raw';
// import heading5Icon from './icons/heading5.svg?raw';
// import heading6Icon from './icons/heading6.svg?raw';
import italicIcon from './icons/italic.svg?raw';
import plainTextIcon from './icons/plainText.svg?raw';
import quoteIcon from './icons/quote.svg?raw';
import './styles.css';

const blockTypes = [
    'paragraph',
    // 'h1',
    'h2',
    'h3',
    // 'h4',
    // 'h5',
    // 'h6',
    'quote',
] as const;

type BlockType = (typeof blockTypes)[number];

export default () => {
    let editor: LexicalEditor | null = null;

    const state = writable<{
        blockType: BlockType;
        bold: boolean;
        italic: boolean;
    }>({
        blockType: 'paragraph',
        bold: false,
        italic: false,
    });

    const _toolbar = derived<
        typeof state,
        {
            label: string;
            ariaLabel?: string;
            handler: () => void;
            icon: string;
            active: boolean;
        }[]
    >(state, ($state) => {
        if (!editor) {
            return [];
        }

        const { blockType, bold, italic } = $state;
        return [
            {
                label: 'Plain Text',
                ariaLabel: 'Remove formatting',
                handler: () => {
                    editor?.update(() => {
                        const selection = $getSelection();
                        if ($isRangeSelection(selection)) {
                            $setBlocksType(selection, () =>
                                $createParagraphNode(),
                            );
                        }
                    });
                },
                icon: plainTextIcon,
                active: blockType == 'paragraph',
            },
            // {
            //     label: 'Heading Level 1',
            //     ariaLabel: 'Convert block to heading level 1',
            //     handler: () => {
            //         if (blockType != 'h1') {
            //             editor?.update(() => {
            //                 const selection = $getSelection();
            //                 $setBlocksType(selection, () =>
            //                     $createHeadingNode('h1'),
            //                 );
            //             });
            //         }
            //     },
            //     icon: heading1Icon,
            //     active: blockType == 'h1',
            // },
            {
                label: 'Heading Level 2',
                ariaLabel: 'Convert block to heading level 2',
                handler: () => {
                    if (blockType != 'h2') {
                        editor?.update(() => {
                            const selection = $getSelection();
                            $setBlocksType(selection, () =>
                                $createHeadingNode('h2'),
                            );
                        });
                    }
                },
                icon: heading2Icon,
                active: blockType == 'h2',
            },
            {
                label: 'Heading Level 3',
                ariaLabel: 'Convert block to heading level 3',
                handler: () => {
                    if (blockType != 'h3') {
                        editor?.update(() => {
                            const selection = $getSelection();
                            $setBlocksType(selection, () =>
                                $createHeadingNode('h3'),
                            );
                        });
                    }
                },
                icon: heading3Icon,
                active: blockType == 'h3',
            },
            // {
            //     label: 'Heading Level 4',
            //     ariaLabel: 'Convert block to heading level 4',
            //     handler: () => {
            //         if (blockType != 'h4') {
            //             editor?.update(() => {
            //                 const selection = $getSelection();
            //                 $setBlocksType(selection, () =>
            //                     $createHeadingNode('h4'),
            //                 );
            //             });
            //         }
            //     },
            //     icon: heading4Icon,
            //     active: blockType == 'h4',
            // },
            // {
            //     label: 'Heading Level 5',
            //     ariaLabel: 'Convert block to heading level 5',
            //     handler: () => {
            //         if (blockType != 'h5') {
            //             editor?.update(() => {
            //                 const selection = $getSelection();
            //                 $setBlocksType(selection, () =>
            //                     $createHeadingNode('h5'),
            //                 );
            //             });
            //         }
            //     },
            //     icon: heading5Icon,
            //     active: blockType == 'h5',
            // },
            // {
            //     label: 'Heading Level 6',
            //     ariaLabel: 'Convert block to heading level 6',
            //     handler: () => {
            //         if (blockType != 'h6') {
            //             editor?.update(() => {
            //                 const selection = $getSelection();
            //                 $setBlocksType(selection, () =>
            //                     $createHeadingNode('h6'),
            //                 );
            //             });
            //         }
            //     },
            //     icon: heading6Icon,
            //     active: blockType == 'h6',
            // },
            {
                label: 'Quote',
                ariaLabel: 'Convert block to quote',
                handler: () => {
                    editor?.update(() => {
                        const selection = $getSelection();
                        $setBlocksType(selection, () => $createQuoteNode());
                    });
                },
                icon: quoteIcon,
                active: blockType == 'quote',
            },
            {
                label: IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)',
                ariaLabel: `Format text as bold. Shortcut: ${
                    IS_APPLE ? '⌘B' : 'Ctrl+B'
                }`,
                handler: () => {
                    editor?.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                },
                icon: boldIcon,
                active: bold,
            },
            {
                label: IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)',
                ariaLabel: `Format text as italics. Shortcut: ${
                    IS_APPLE ? '⌘I' : 'Ctrl+I'
                }`,
                handler: () => {
                    editor?.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                },
                icon: italicIcon,
                active: italic,
            },
        ];
    });

    return {
        subscribe: _toolbar.subscribe,
        init: (e: LexicalEditor) => {
            editor = e;
            state.update((s) => s);
        },
        $update: () => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const anchorNode = selection.anchor.getNode();
                let element =
                    anchorNode.getKey() == 'root'
                        ? anchorNode
                        : $findMatchingParent(anchorNode, (e) => {
                              const parent = e.getParent();
                              return (
                                  parent !== null && $isRootOrShadowRoot(parent)
                              );
                          });

                if (element === null) {
                    element = anchorNode.getTopLevelElementOrThrow();
                }

                const elementKey = element.getKey();
                const elementDOM = editor?.getElementByKey(elementKey);

                // todo - Handle links
                // const node = getSelectedNode(selection);
                // const parent = node.getParent();
                // if ($isLinkNode(parent) || $isLinkNode(node)) {
                //     setIsLink(true);
                // } else {
                //     setIsLink(false);
                // }

                if (elementDOM !== null) {
                    // todo - Handle list nodes
                    // if ($isListNode(element)) {
                    //     const parentList = $getNearestNodeOfType<ListNode>(
                    //         anchorNode,
                    //         ListNode,
                    //     );
                    //     const type = parentList
                    //         ? parentList.getListType()
                    //         : element.getListType();
                    //     blockType.set(type);
                    // } else {
                    const type = $isHeadingNode(element)
                        ? element.getTag()
                        : element.getType();
                    if (blockTypes.includes(type as BlockType)) {
                        state.update((s) => ({
                            ...s,
                            blockType: type as BlockType,
                        }));
                    }
                    // }
                }

                // todo - Handle buttons (for links)
                // let matchingParent;
                // if ($isLinkNode(parent)) {
                //     // If node is a link, we need to fetch the parent paragraph node to set format
                //     matchingParent = $findMatchingParent(
                //         node,
                //         (parentNode) =>
                //             $isElementNode(parentNode) && !parentNode.isInline(),
                //     );
                // }
            }

            if ($isRangeSelection(selection)) {
                state.update((s) => ({
                    ...s,
                    bold: selection.hasFormat('bold'),
                }));
                state.update((s) => ({
                    ...s,
                    italic: selection.hasFormat('italic'),
                }));
            }
        },
    };
};

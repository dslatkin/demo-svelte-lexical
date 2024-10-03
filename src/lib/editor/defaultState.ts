import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical';

// todo - Get this working
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const serializedRichText: any = {
    root: {
        children: [
            {
                children: [
                    {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Welcome to the Vanilla JS Lexical Demo!',
                        type: 'ucla-text',
                        version: 1,
                    },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'heading',
                version: 1,
                tag: 'h2',
            },
            {
                children: [
                    {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: "In case you were wondering what the text area at the bottom is – it's the debug view, showing the current state of the editor. ",
                        type: 'ucla-text',
                        version: 1,
                    },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'quote',
                version: 1,
            },
            {
                children: [
                    {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'This is a demo environment built with ',
                        type: 'ucla-text',
                        version: 1,
                    },
                    {
                        detail: 0,
                        format: 16,
                        mode: 'normal',
                        style: '',
                        text: 'lexical',
                        type: 'ucla-text',
                        version: 1,
                    },
                    {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: '. Try typing in ',
                        type: 'ucla-text',
                        version: 1,
                    },
                    {
                        detail: 0,
                        format: 1,
                        mode: 'normal',
                        style: '',
                        text: 'some text',
                        type: 'ucla-text',
                        version: 1,
                    },
                    {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: ' with ',
                        type: 'ucla-text',
                        version: 1,
                    },
                    {
                        detail: 0,
                        format: 2,
                        mode: 'normal',
                        style: '',
                        text: 'different',
                        type: 'ucla-text',
                        version: 1,
                    },
                    {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: ' formats.',
                        type: 'ucla-text',
                        version: 1,
                    },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'paragraph',
                version: 1,
                textFormat: 0,
                textStyle: '',
            },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
    },
};

export const $populateRichText = () => {
    const root = $getRoot();
    if (root.getFirstChild() !== null) {
        return;
    }

    const heading = $createHeadingNode('h2');
    heading.append($createTextNode('Welcome to the Vanilla JS Lexical Demo!'));
    root.append(heading);
    const quote = $createQuoteNode();
    quote.append(
        $createTextNode(
            `In case you were wondering what the text area at the bottom is – it's the debug view, showing the current state of the editor. `,
        ),
    );
    root.append(quote);
    const paragraph = $createParagraphNode();
    paragraph.append(
        $createTextNode('This is a demo environment built with '),
        $createTextNode('lexical').toggleFormat('code'),
        $createTextNode('.'),
        $createTextNode(' Try typing in '),
        $createTextNode('some text').toggleFormat('bold'),
        $createTextNode(' with '),
        $createTextNode('different').toggleFormat('italic'),
        $createTextNode(' formats.'),
    );
    root.append(paragraph);
};

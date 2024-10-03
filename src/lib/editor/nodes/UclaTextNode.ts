import {
    $applyNodeReplacement,
    TextNode,
    type DOMConversionMap,
    type DOMExportOutput,
    type LexicalEditor,
    type LexicalNode,
    type NodeKey,
    type SerializedTextNode,
} from 'lexical';

// todo
// use a symbol to ensure uniqueness of validate function
// const uclaValidate = Symbol('uclaValidate');
// interface UclaNode {
//     [uclaValidate]: boolean;
// }

export class UclaTextNode extends TextNode /* todo implements UclaNode */ {
    constructor(text: string, key?: NodeKey) {
        super(text, key);
    }

    static getType(): string {
        return 'ucla-text';
    }

    isSimpleText() {
        return this.__type === 'ucla-text' && this.__mode === 0;
    }

    static clone(node: UclaTextNode): UclaTextNode {
        return new UclaTextNode(node.__text, node.__key);
    }

    static importDOM(): DOMConversionMap | null {
        return TextNode.importDOM();
    }

    exportDOM(editor: LexicalEditor): DOMExportOutput {
        return this.exportDOM(editor);
    }

    static importJSON(serializedNode: SerializedTextNode): TextNode {
        return TextNode.importJSON(serializedNode);
    }

    exportJSON(): SerializedTextNode {
        return {
            ...super.exportJSON(),
            type: 'ucla-text',
            version: 1,
        };
    }

    uclaValidate(): boolean {
        return true;
    }
}

export function $createUclaTextNode(text: string): UclaTextNode {
    return $applyNodeReplacement(new UclaTextNode(text));
}

export function $isUclaTextNode(
    node: LexicalNode | null | undefined,
): node is UclaTextNode {
    return node instanceof UclaTextNode;
}

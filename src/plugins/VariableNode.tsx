import {
  TextNode,
  SerializedTextNode,
  Spread,
  EditorConfig,
  LexicalNode,
  DOMExportOutput,
  LexicalEditor,
} from 'lexical';

// --- 类型定义 ---
export type SerializedVariableNode = Spread<
  {
    type: 'variable';
    version: 1;
  },
  SerializedTextNode
>;

// --- Custom Variable Node Class (继承自 TextNode) ---
export class VariableNode extends TextNode {
  static getType(): string {
    return 'variable';
  }

  static clone(node: VariableNode): VariableNode {
    return new VariableNode(node.__text, node.__key);
  }

  static importJSON(serializedNode: SerializedVariableNode): VariableNode {
    const node = $createVariableNode(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  exportJSON(): SerializedVariableNode {
    return {
      ...super.exportJSON(),
      type: 'variable',
      version: 1,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.style.color = '#0070F3';
    dom.style.backgroundColor = '#E0F2FE';
    dom.style.padding = '2px 6px';
    dom.style.borderRadius = '4px';
    dom.style.fontWeight = 'bold';
    dom.className = 'variable-node';
    return dom;
  }

  updateDOM(
    prevNode: TextNode,
    dom: HTMLElement,
    config: EditorConfig,
  ): boolean {
    return super.updateDOM(prevNode as this, dom, config);
  }

  exportDOM(_editor: LexicalEditor): DOMExportOutput {
    const element = document.createElement('span');
    element.textContent = this.getTextContent();
    element.style.color = '#0070F3';
    element.style.backgroundColor = '#E0F2FE';
    element.style.padding = '2px 6px';
    element.style.borderRadius = '4px';
    element.style.fontWeight = 'bold';
    return { element };
  }

  // 让节点作为一个整体被选中和删除
  isToken(): boolean {
    return true;
  }
}

// --- 辅助函数 ---
export function $createVariableNode(text: string): VariableNode {
  return new VariableNode(text).setMode('token');
}

export function $isVariableNode(node: LexicalNode | null | undefined): node is VariableNode {
  return node instanceof VariableNode;
}
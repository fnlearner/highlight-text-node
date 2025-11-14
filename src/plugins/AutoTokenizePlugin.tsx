import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalEditor,
  TextNode,
} from 'lexical'; 
import { useEffect } from 'react';
import { $createVariableNode, $isVariableNode, VariableNode } from './VariableNode';

// 变量匹配正则: 匹配 [xxx]
const VARIABLE_REGEX = /\[([^\]]+)\]/;

/**
 * 使用 Node Transform 监听所有 TextNode 的变化，并自动转换为 VariableNode
 */
function useAutoTokenizeTransform(editor: LexicalEditor): void {
  useEffect(() => {
    // 运行时检查，确保自定义节点已注册
    if (!editor.hasNodes([VariableNode])) {
      console.error('AutoTokenizePlugin: VariableNode not registered.');
      return;
    }

    // 注册 Node Transform: 当任何 TextNode 被创建、更新时触发
    return editor.registerNodeTransform(TextNode, (textNode: TextNode) => {
      // 跳过 VariableNode (因为它继承自 TextNode)
      if ($isVariableNode(textNode)) {
        return;
      }
      
      // 1. 节点有效性检查
      if (!textNode.isSimpleText()) {
        return;
      }
      
      const text = textNode.getTextContent();
      
      // 2. 检查是否包含 [xxx] 模式
      const match = text.match(VARIABLE_REGEX);
      
      if (!match || match.index === undefined) {
        return;
      }

      const fullMatch = match[0]; // 如 "[abc]"
      const startIndex = match.index; // 匹配的起始位置

      let targetNode = textNode;
      
      // 3. 如果匹配不在开头，先分割出前面的部分
      if (startIndex > 0) {
        [, targetNode] = textNode.splitText(startIndex);
      }
      
      // 4. 如果匹配后面还有文字，分割出匹配的部分
      const matchLength = fullMatch.length;
      if (targetNode.getTextContent().length > matchLength) {
        [targetNode] = targetNode.splitText(matchLength);
      }
      
      // 5. 将包含 [xxx] 的节点替换为 VariableNode
      const variableNode = $createVariableNode(fullMatch);
      targetNode.replace(variableNode);
    });
  }, [editor]);
}

export function AutoTokenizePlugin(): null {
  const [editor] = useLexicalComposerContext();
  useAutoTokenizeTransform(editor);
  return null;
}
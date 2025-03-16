import { Node } from '@xyflow/react';
import MermaidNode from '../components/nodes/MermaidNode';
import { MermaidNodeData } from '../components/nodes/types';

// Register custom node types
export const nodeTypes = {
  mermaid: MermaidNode,
};

// Create initial nodes for testing
export const initialNodes: Node<MermaidNodeData>[] = [
  {
    id: '1',
    type: 'mermaid',
    position: { x: 250, y: 100 },
    data: {
      label: 'Test Node',
      description: 'This is a test node',
      shape: 'rectangle',
      style: {
        fill: '#f0f9ff',
        stroke: '#0ea5e9',
        strokeWidth: 2,
      },
    },
  },
  {
    id: '2',
    type: 'mermaid',
    position: { x: 250, y: 250 },
    data: {
      label: 'Circle Node',
      description: 'This is a circular node',
      shape: 'circle',
      style: {
        fill: '#fef3c7',
        stroke: '#d97706',
        strokeWidth: 2,
      },
    },
  },
];

// Create empty edges array
export const initialEdges = [];

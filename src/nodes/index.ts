import { Node } from '@xyflow/react';
import MermaidNode from '../components/nodes/MermaidNode';
import FlowchartNode from '../components/nodes/FlowchartNode';
import SequenceNode from '../components/nodes/SequenceNode';
import ClassNode from '../components/nodes/ClassNode';
import StateNode from '../components/nodes/StateNode';
import { MermaidNodeData } from '../components/nodes/types';

// Register custom node types
export const nodeTypes = {
  mermaid: MermaidNode,
  flowchart: FlowchartNode,
  sequence: SequenceNode,
  class: ClassNode,
  state: StateNode,
};

// Create initial nodes for testing
export const initialNodes: Node<MermaidNodeData>[] = [
  // State Machine Nodes
  {
    id: 'state1',
    type: 'state',
    position: { x: 100, y: 50 },
    data: {
      type: 'state',
      label: 'Initial',
      shape: 'circle',
      style: {
        fill: '#000000',
        stroke: '#000000',
        strokeWidth: 2,
      },
    },
  },
  {
    id: 'state2',
    type: 'state',
    position: { x: 250, y: 50 },
    data: {
      type: 'state',
      label: 'Login Form',
      shape: 'rectangle',
      description: 'User enters credentials',
      entryAction: 'clearForm()',
      exitAction: 'validateInput()',
      style: {
        fill: '#f0fdf4',
        stroke: '#16a34a',
        strokeWidth: 2,
      },
    },
  },
  {
    id: 'state3',
    type: 'state',
    position: { x: 450, y: 50 },
    data: {
      type: 'state',
      label: 'Validating',
      shape: 'rectangle',
      description: 'Checking credentials',
      entryAction: 'showSpinner()',
      exitAction: 'hideSpinner()',
      style: {
        fill: '#fef3c7',
        stroke: '#d97706',
        strokeWidth: 2,
      },
    },
  },
  {
    id: 'state4',
    type: 'state',
    position: { x: 450, y: 200 },
    data: {
      type: 'state',
      label: 'Error',
      shape: 'rectangle',
      description: 'Invalid credentials',
      entryAction: 'showError()',
      style: {
        fill: '#fee2e2',
        stroke: '#dc2626',
        strokeWidth: 2,
      },
    },
  },
  {
    id: 'state5',
    type: 'state',
    position: { x: 650, y: 50 },
    data: {
      type: 'state',
      label: 'Authenticated',
      shape: 'rectangle',
      description: 'User logged in',
      entryAction: 'redirectToDashboard()',
      style: {
        fill: '#f0f9ff',
        stroke: '#0ea5e9',
        strokeWidth: 2,
      },
    },
  },

  // Previous nodes remain unchanged...
  {
    id: 'class1',
    type: 'class',
    position: { x: 100, y: 350 },
    data: {
      type: 'class',
      label: 'Animal',
      description: 'Base class for animals',
      stereotype: 'abstract',
      shape: 'rectangle',
      properties: [
        '- name: string',
        '# age: number',
      ],
      methods: [
        '+ getName(): string',
        '+ setName(name: string): void',
        '# makeSound(): void',
      ],
      style: {
        fill: '#f0fdf4',
        stroke: '#16a34a',
        strokeWidth: 2,
      },
    },
  },
];

// Create initial edges
export const initialEdges = [
  // State machine transitions
  {
    id: 'state1-2',
    source: 'state1',
    target: 'state2',
    animated: true,
    label: 'start',
  },
  {
    id: 'state2-3',
    source: 'state2',
    target: 'state3',
    animated: true,
    label: 'submit',
  },
  {
    id: 'state3-4',
    source: 'state3',
    target: 'state4',
    animated: true,
    label: '[invalid]',
  },
  {
    id: 'state3-5',
    source: 'state3',
    target: 'state5',
    animated: true,
    label: '[valid]',
  },
  {
    id: 'state4-2',
    source: 'state4',
    target: 'state2',
    animated: true,
    label: 'retry',
    type: 'smoothstep',
  },

  // Previous edges remain unchanged...
  {
    id: 'e-inheritance',
    source: 'class2',
    target: 'class1',
    animated: false,
    style: { strokeWidth: 2 },
    type: 'smoothstep',
    markerEnd: {
      type: 'arrowclosed',
      color: '#000000',
    },
  },
];

import { Node } from '@xyflow/react';
import MermaidNode from '../components/nodes/MermaidNode';
import FlowchartNode from '../components/nodes/FlowchartNode';
import SequenceNode from '../components/nodes/SequenceNode';
import ClassNode from '../components/nodes/ClassNode';
import { MermaidNodeData } from '../components/nodes/types';

// Register custom node types
export const nodeTypes = {
  mermaid: MermaidNode,
  flowchart: FlowchartNode,
  sequence: SequenceNode,
  class: ClassNode,
};

// Create initial nodes for testing
export const initialNodes: Node<MermaidNodeData>[] = [
  // Class Diagram Nodes
  {
    id: 'class1',
    type: 'class',
    position: { x: 100, y: 50 },
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
  {
    id: 'class2',
    type: 'class',
    position: { x: 50, y: 250 },
    data: {
      type: 'class',
      label: 'Dog',
      shape: 'rectangle',
      properties: [
        '- breed: string',
      ],
      methods: [
        '+ getBreed(): string',
        '# makeSound(): void',
      ],
      style: {
        fill: '#fef3c7',
        stroke: '#d97706',
        strokeWidth: 2,
      },
    },
  },
  {
    id: 'class3',
    type: 'class',
    position: { x: 300, y: 250 },
    data: {
      type: 'class',
      label: 'Owner',
      shape: 'rectangle',
      properties: [
        '- pets: Animal[]',
        '- address: string',
      ],
      methods: [
        '+ addPet(pet: Animal): void',
        '+ removePet(pet: Animal): void',
      ],
      style: {
        fill: '#f0f9ff',
        stroke: '#0ea5e9',
        strokeWidth: 2,
      },
    },
  },

  // Previous nodes remain unchanged...
  {
    id: 'seq1',
    type: 'sequence',
    position: { x: 100, y: 450 },
    data: {
      type: 'sequence',
      label: 'User',
      description: 'Client',
      actor: true,
      style: {
        fill: '#f0fdf4',
        stroke: '#16a34a',
        strokeWidth: 2,
      },
    },
  },
  {
    id: 'seq2',
    type: 'sequence',
    position: { x: 300, y: 450 },
    data: {
      type: 'sequence',
      label: 'API',
      description: 'REST Endpoint',
      style: {
        fill: '#f0f9ff',
        stroke: '#0ea5e9',
        strokeWidth: 2,
      },
    },
  },
];

// Create initial edges
export const initialEdges = [
  // Class diagram relationships
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
  {
    id: 'e-composition',
    source: 'class3',
    target: 'class1',
    animated: false,
    style: { strokeWidth: 2 },
    type: 'smoothstep',
    markerEnd: {
      type: 'diamond',
      color: '#000000',
    },
  },

  // Previous edges remain unchanged...
  {
    id: 'seq1-2',
    source: 'seq1',
    target: 'seq2',
    label: 'GET /api/data',
    animated: true,
    style: { stroke: '#16a34a' },
  },
];

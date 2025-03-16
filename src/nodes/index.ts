import { Node } from '@xyflow/react';
import MermaidNode from '../components/nodes/MermaidNode';
import FlowchartNode from '../components/nodes/FlowchartNode';
import SequenceNode from '../components/nodes/SequenceNode';
import { MermaidNodeData } from '../components/nodes/types';

// Register custom node types
export const nodeTypes = {
  mermaid: MermaidNode,
  flowchart: FlowchartNode,
  sequence: SequenceNode,
};

// Create initial nodes for testing
export const initialNodes: Node<MermaidNodeData>[] = [
  // Sequence Diagram Nodes
  {
    id: 'seq1',
    type: 'sequence',
    position: { x: 100, y: 50 },
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
    position: { x: 300, y: 50 },
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
  {
    id: 'seq3',
    type: 'sequence',
    position: { x: 500, y: 50 },
    data: {
      type: 'sequence',
      label: 'Database',
      description: 'PostgreSQL',
      style: {
        fill: '#faf5ff',
        stroke: '#a855f7',
        strokeWidth: 2,
      },
    },
  },

  // Previous nodes remain unchanged...
  {
    id: '1',
    type: 'mermaid',
    position: { x: 250, y: 300 },
    data: {
      type: 'architecture',
      label: 'API Gateway',
      description: 'Main entry point',
      shape: 'hexagon',
      technology: 'Kong',
      protocol: 'HTTP/HTTPS',
      scalability: 'cluster',
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
    position: { x: 250, y: 450 },
    data: {
      type: 'architecture',
      label: 'Auth Service',
      description: 'Authentication & Authorization',
      shape: 'microservice',
      technology: 'Node.js',
      protocol: 'gRPC',
      scalability: 'distributed',
      style: {
        fill: '#fef3c7',
        stroke: '#d97706',
        strokeWidth: 2,
        dashArray: '5,5',
      },
    },
  },
];

// Create initial edges
export const initialEdges = [
  // Sequence diagram messages
  {
    id: 'seq1-2',
    source: 'seq1',
    target: 'seq2',
    label: 'GET /api/data',
    animated: true,
    style: { stroke: '#16a34a' },
  },
  {
    id: 'seq2-3',
    source: 'seq2',
    target: 'seq3',
    label: 'SELECT * FROM data',
    animated: true,
    style: { stroke: '#0ea5e9' },
  },
  {
    id: 'seq3-2',
    source: 'seq3',
    target: 'seq2',
    label: 'Result Set',
    animated: true,
    style: { stroke: '#a855f7' },
  },
  {
    id: 'seq2-1',
    source: 'seq2',
    target: 'seq1',
    label: 'JSON Response',
    animated: true,
    style: { stroke: '#0ea5e9' },
  },

  // Previous edges remain unchanged...
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
  },
];

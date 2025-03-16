import { Node } from '@xyflow/react';
import MermaidNode from '../components/nodes/MermaidNode';
import FlowchartNode from '../components/nodes/FlowchartNode';
import { MermaidNodeData } from '../components/nodes/types';

// Register custom node types
export const nodeTypes = {
  mermaid: MermaidNode,
  flowchart: FlowchartNode,
};

// Create initial nodes for testing
export const initialNodes: Node<MermaidNodeData>[] = [
  // Architecture Nodes
  {
    id: '1',
    type: 'mermaid',
    position: { x: 250, y: 100 },
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
    position: { x: 250, y: 250 },
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

  // Flowchart Nodes
  {
    id: 'flow1',
    type: 'flowchart',
    position: { x: 500, y: 100 },
    data: {
      type: 'flowchart',
      label: 'Start',
      description: 'Begin process',
      shape: 'circle',
      style: {
        fill: '#dcfce7',
        stroke: '#22c55e',
        strokeWidth: 2,
      },
    },
  },
  {
    id: 'flow2',
    type: 'flowchart',
    position: { x: 500, y: 250 },
    data: {
      type: 'flowchart',
      label: 'User Authenticated?',
      description: 'Check authentication',
      shape: 'diamond',
      condition: 'Yes/No',
      style: {
        fill: '#fef9c3',
        stroke: '#eab308',
        strokeWidth: 2,
      },
    },
  },
  {
    id: 'flow3',
    type: 'flowchart',
    position: { x: 700, y: 250 },
    data: {
      type: 'flowchart',
      label: 'Process Request',
      description: 'Handle authenticated request',
      shape: 'rectangle',
      style: {
        fill: '#f0f9ff',
        stroke: '#0ea5e9',
        strokeWidth: 2,
      },
    },
  },
  {
    id: 'flow4',
    type: 'flowchart',
    position: { x: 500, y: 400 },
    data: {
      type: 'flowchart',
      label: 'Return Error',
      description: 'Authentication failed',
      shape: 'parallelogram',
      style: {
        fill: '#fee2e2',
        stroke: '#ef4444',
        strokeWidth: 2,
      },
    },
  },
];

// Create initial edges
export const initialEdges = [
  // Architecture edges
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
  },
  // Flowchart edges
  {
    id: 'flow1-2',
    source: 'flow1',
    target: 'flow2',
    animated: false,
  },
  {
    id: 'flow2-3',
    source: 'flow2',
    target: 'flow3',
    label: 'Yes',
    animated: false,
  },
  {
    id: 'flow2-4',
    source: 'flow2',
    target: 'flow4',
    label: 'No',
    animated: false,
  },
];

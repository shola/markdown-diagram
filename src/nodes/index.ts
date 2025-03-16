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
  {
    id: '3',
    type: 'mermaid',
    position: { x: 450, y: 250 },
    data: {
      type: 'architecture',
      label: 'User Database',
      description: 'User data storage',
      shape: 'database',
      technology: 'PostgreSQL',
      scalability: 'cluster',
      style: {
        fill: '#f3e8ff',
        stroke: '#a855f7',
        strokeWidth: 2,
      },
    },
  },
  {
    id: '4',
    type: 'mermaid',
    position: { x: 50, y: 250 },
    data: {
      type: 'architecture',
      label: 'Message Queue',
      description: 'Event bus',
      shape: 'queue',
      technology: 'RabbitMQ',
      protocol: 'AMQP',
      scalability: 'distributed',
      style: {
        fill: '#ecfdf5',
        stroke: '#10b981',
        strokeWidth: 2,
      },
    },
  },
];

// Create initial edges
export const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    animated: true,
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
    animated: true,
  },
];

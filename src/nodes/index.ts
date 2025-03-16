import { Node } from '@xyflow/react';
import MermaidNode from '../components/nodes/MermaidNode';
import FlowchartNode from '../components/nodes/FlowchartNode';
import SequenceNode from '../components/nodes/SequenceNode';
import ClassNode from '../components/nodes/ClassNode';
import StateNode from '../components/nodes/StateNode';
import ERNode from '../components/nodes/ERNode';
import { MermaidNodeData } from '../components/nodes/types';

// Register custom node types
export const nodeTypes = {
  mermaid: MermaidNode,
  flowchart: FlowchartNode,
  sequence: SequenceNode,
  class: ClassNode,
  state: StateNode,
  er: ERNode,
};

// Create initial nodes for testing
export const initialNodes: Node<MermaidNodeData>[] = [
  // ER Diagram Nodes
  {
    id: 'er1',
    type: 'er',
    position: { x: 100, y: 50 },
    data: {
      type: 'er',
      label: 'Users',
      description: 'User accounts',
      shape: 'rectangle',
      attributes: [
        { name: 'id', type: 'uuid', key: 'primary' },
        { name: 'username', type: 'varchar(50)' },
        { name: 'email', type: 'varchar(255)' },
        { name: 'password_hash', type: 'varchar(255)' },
        { name: 'created_at', type: 'timestamp' },
      ],
      style: {
        fill: '#f0fdf4',
        stroke: '#16a34a',
        strokeWidth: 2,
      },
    },
  },
  {
    id: 'er2',
    type: 'er',
    position: { x: 400, y: 50 },
    data: {
      type: 'er',
      label: 'Posts',
      description: 'Blog posts',
      shape: 'rectangle',
      attributes: [
        { name: 'id', type: 'uuid', key: 'primary' },
        { name: 'user_id', type: 'uuid', key: 'foreign' },
        { name: 'title', type: 'varchar(255)' },
        { name: 'content', type: 'text' },
        { name: 'published_at', type: 'timestamp' },
      ],
      style: {
        fill: '#fef3c7',
        stroke: '#d97706',
        strokeWidth: 2,
      },
    },
  },
  {
    id: 'er3',
    type: 'er',
    position: { x: 700, y: 50 },
    data: {
      type: 'er',
      label: 'Comments',
      description: 'Post comments',
      shape: 'rectangle',
      attributes: [
        { name: 'id', type: 'uuid', key: 'primary' },
        { name: 'post_id', type: 'uuid', key: 'foreign' },
        { name: 'user_id', type: 'uuid', key: 'foreign' },
        { name: 'content', type: 'text' },
        { name: 'created_at', type: 'timestamp' },
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
    id: 'state1',
    type: 'state',
    position: { x: 100, y: 300 },
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
];

// Create initial edges
export const initialEdges = [
  // ER diagram relationships
  {
    id: 'er1-2',
    source: 'er1',
    target: 'er2',
    animated: false,
    label: '1:N',
    type: 'smoothstep',
    style: { strokeWidth: 2 },
  },
  {
    id: 'er2-3',
    source: 'er2',
    target: 'er3',
    animated: false,
    label: '1:N',
    type: 'smoothstep',
    style: { strokeWidth: 2 },
  },
  {
    id: 'er1-3',
    source: 'er1',
    target: 'er3',
    animated: false,
    label: '1:N',
    type: 'smoothstep',
    style: { strokeWidth: 2 },
  },

  // Previous edges remain unchanged...
  {
    id: 'state1-2',
    source: 'state1',
    target: 'state2',
    animated: true,
    label: 'start',
  },
];

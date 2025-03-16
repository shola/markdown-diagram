import { Node } from '@xyflow/react';
import MermaidNode from '../components/nodes/MermaidNode';
import FlowchartNode from '../components/nodes/FlowchartNode';
import SequenceNode from '../components/nodes/SequenceNode';
import ClassNode from '../components/nodes/ClassNode';
import StateNode from '../components/nodes/StateNode';
import ERNode from '../components/nodes/ERNode';
import GanttNode from '../components/nodes/GanttNode';
import { MermaidNodeData } from '../components/nodes/types';

// Register custom node types
export const nodeTypes = {
  mermaid: MermaidNode,
  flowchart: FlowchartNode,
  sequence: SequenceNode,
  class: ClassNode,
  state: StateNode,
  er: ERNode,
  gantt: GanttNode,
};

// Create initial nodes for testing
export const initialNodes: Node<MermaidNodeData>[] = [
  // Gantt Chart Nodes
  {
    id: 'gantt1',
    type: 'gantt',
    position: { x: 100, y: 50 },
    data: {
      type: 'gantt',
      label: 'Project Planning',
      description: 'Initial project setup and planning',
      shape: 'rectangle',
      startDate: '2025-03-15',
      endDate: '2025-03-20',
      progress: 100,
      style: {
        fill: '#f0fdf4',
        stroke: '#16a34a',
        strokeWidth: 2,
      },
    },
  },
  {
    id: 'gantt2',
    type: 'gantt',
    position: { x: 100, y: 150 },
    data: {
      type: 'gantt',
      label: 'Backend Development',
      description: 'API and database implementation',
      shape: 'rectangle',
      startDate: '2025-03-20',
      endDate: '2025-04-10',
      dependencies: ['gantt1'],
      progress: 60,
      style: {
        fill: '#fef3c7',
        stroke: '#d97706',
        strokeWidth: 2,
      },
    },
  },
  {
    id: 'gantt3',
    type: 'gantt',
    position: { x: 100, y: 250 },
    data: {
      type: 'gantt',
      label: 'Frontend Development',
      description: 'UI implementation',
      shape: 'rectangle',
      startDate: '2025-03-25',
      endDate: '2025-04-15',
      dependencies: ['gantt1'],
      progress: 40,
      style: {
        fill: '#f0f9ff',
        stroke: '#0ea5e9',
        strokeWidth: 2,
      },
    },
  },
  {
    id: 'gantt4',
    type: 'gantt',
    position: { x: 100, y: 350 },
    data: {
      type: 'gantt',
      label: 'Testing',
      description: 'QA and bug fixes',
      shape: 'rectangle',
      startDate: '2025-04-10',
      endDate: '2025-04-20',
      dependencies: ['gantt2', 'gantt3'],
      progress: 0,
      style: {
        fill: '#fdf4ff',
        stroke: '#a855f7',
        strokeWidth: 2,
      },
    },
  },
  {
    id: 'gantt5',
    type: 'gantt',
    position: { x: 100, y: 450 },
    data: {
      type: 'gantt',
      label: 'Deployment',
      description: 'Production release',
      shape: 'rectangle',
      startDate: '2025-04-20',
      endDate: '2025-04-25',
      dependencies: ['gantt4'],
      progress: 0,
      style: {
        fill: '#fff1f2',
        stroke: '#e11d48',
        strokeWidth: 2,
      },
    },
  },

  // Previous nodes remain unchanged...
  {
    id: 'er1',
    type: 'er',
    position: { x: 500, y: 50 },
    data: {
      type: 'er',
      label: 'Users',
      description: 'User accounts',
      shape: 'rectangle',
      attributes: [
        { name: 'id', type: 'uuid', key: 'primary' },
        { name: 'username', type: 'varchar(50)' },
        { name: 'email', type: 'varchar(255)' },
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
  // Gantt dependencies
  {
    id: 'gantt1-2',
    source: 'gantt1',
    target: 'gantt2',
    animated: true,
    style: { stroke: '#94a3b8' },
  },
  {
    id: 'gantt1-3',
    source: 'gantt1',
    target: 'gantt3',
    animated: true,
    style: { stroke: '#94a3b8' },
  },
  {
    id: 'gantt2-4',
    source: 'gantt2',
    target: 'gantt4',
    animated: true,
    style: { stroke: '#94a3b8' },
  },
  {
    id: 'gantt3-4',
    source: 'gantt3',
    target: 'gantt4',
    animated: true,
    style: { stroke: '#94a3b8' },
  },
  {
    id: 'gantt4-5',
    source: 'gantt4',
    target: 'gantt5',
    animated: true,
    style: { stroke: '#94a3b8' },
  },

  // Previous edges remain unchanged...
  {
    id: 'er1-2',
    source: 'er1',
    target: 'er2',
    animated: false,
    label: '1:N',
    type: 'smoothstep',
    style: { strokeWidth: 2 },
  },
];

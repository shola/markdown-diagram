import { NodeProps } from '@xyflow/react';

export type MermaidNodeType =
  | 'flowchart'
  | 'sequence'
  | 'class'
  | 'state'
  | 'er'
  | 'gantt'
  | 'architecture';

export type NodeShape =
  | 'rectangle'
  | 'circle'
  | 'diamond'
  | 'hexagon'
  | 'database'
  | 'queue'
  | 'cloud'
  | 'cylinder'
  | 'microservice';

export interface NodeStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  dashArray?: string;
}

export interface BaseNodeData {
  label: string;
  description?: string;
  shape: NodeShape;
  style?: NodeStyle;
  [key: string]: unknown;
}

export interface FlowchartNodeData extends BaseNodeData {
  type: 'flowchart';
  condition?: string;
}

export interface SequenceNodeData extends BaseNodeData {
  type: 'sequence';
  actor?: boolean;
}

export interface ClassNodeData extends BaseNodeData {
  type: 'class';
  methods: string[];
  properties: string[];
  stereotype?: string;
}

export interface StateNodeData extends BaseNodeData {
  type: 'state';
  entryAction?: string;
  exitAction?: string;
}

export interface EntityNodeData extends BaseNodeData {
  type: 'er';
  attributes: Array<{
    name: string;
    type: string;
    key?: 'primary' | 'foreign';
  }>;
}

export interface GanttNodeData extends BaseNodeData {
  type: 'gantt';
  startDate?: string;
  endDate?: string;
  dependencies?: string[];
}

export interface ArchitectureNodeData extends BaseNodeData {
  type: 'architecture';
  technology?: string;
  port?: string;
  protocol?: string;
  scalability?: 'single' | 'cluster' | 'distributed';
  reliability?: 'high' | 'medium' | 'low';
  dataFlow?: 'in' | 'out' | 'bidirectional';
}

export type MermaidNodeData =
  | FlowchartNodeData
  | SequenceNodeData
  | ClassNodeData
  | StateNodeData
  | EntityNodeData
  | GanttNodeData
  | ArchitectureNodeData;

export type MermaidNodeProps = Omit<NodeProps, 'data'> & {
  data: MermaidNodeData;
};
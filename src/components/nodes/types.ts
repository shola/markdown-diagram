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
  // Architecture shapes
  | 'rectangle'
  | 'circle'
  | 'diamond'
  | 'hexagon'
  | 'database'
  | 'queue'
  | 'cloud'
  | 'cylinder'
  | 'microservice'
  // Flowchart shapes
  | 'parallelogram'
  | 'triangle'
  | 'oval';

export interface NodeStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  dashArray?: string;
}

export interface BaseNodeData {
  label: string;
  description?: string;
  style?: NodeStyle;
  [key: string]: unknown;
}

// Shape is required for nodes that use different shapes
export interface ShapedNodeData extends BaseNodeData {
  shape: NodeShape;
}

export interface FlowchartNodeData extends ShapedNodeData {
  type: 'flowchart';
  condition?: string;
}

export interface SequenceNodeData extends BaseNodeData {
  type: 'sequence';
  actor?: boolean;
}

export interface ClassNodeData extends ShapedNodeData {
  type: 'class';
  methods: string[];
  properties: string[];
  stereotype?: string;
}

export interface StateNodeData extends ShapedNodeData {
  type: 'state';
  entryAction?: string;
  exitAction?: string;
}

export interface EntityNodeData extends ShapedNodeData {
  type: 'er';
  attributes: Array<{
    name: string;
    type: string;
    key?: 'primary' | 'foreign';
  }>;
}

export interface GanttNodeData extends ShapedNodeData {
  type: 'gantt';
  startDate?: string;
  endDate?: string;
  dependencies?: string[];
}

export interface ArchitectureNodeData extends ShapedNodeData {
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
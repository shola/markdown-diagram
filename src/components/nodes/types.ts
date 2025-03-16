import { NodeProps as ReactFlowNodeProps } from '@xyflow/react';

// The data structure for our node's data property
export interface MermaidNodeData {
  label: string;
  description?: string;
  shape?: 'rectangle' | 'circle' | 'diamond' | 'hexagon';
  style?: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  };
  [key: string]: unknown;
}

// The props that will be passed to our node component
export type MermaidNodeProps = Omit<ReactFlowNodeProps, 'data'> & {
  data: MermaidNodeData;
};
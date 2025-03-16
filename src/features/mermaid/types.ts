import { Edge } from '@xyflow/react';
import { MermaidNodeData } from '../../components/nodes/types';

// Define valid marker types for Mermaid diagrams
export type MermaidMarkerType = 'arrowclosed' | 'diamond';

// Create a type that matches the expected Edge structure
export type MermaidEdge = Omit<Edge, 'markerEnd'> & {
  markerEnd?: {
    type: MermaidMarkerType;
  };
};

// Re-export MermaidNodeData for convenience
export type { MermaidNodeData };
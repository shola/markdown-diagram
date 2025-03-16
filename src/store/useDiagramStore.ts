import { create } from 'zustand';
import { Node, Edge, Viewport, Connection } from '@xyflow/react';
import { MermaidNodeData } from '../components/nodes/types';

interface DiagramState {
  nodes: Node<MermaidNodeData>[];
  edges: Edge[];
  viewport: Viewport | null;
  selectedNodes: string[];
  selectedEdges: string[];
}

interface DiagramActions {
  setNodes: (nodes: Node<MermaidNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  setViewport: (viewport: Viewport) => void;
  addNode: (node: Node<MermaidNodeData>) => void;
  updateNode: (nodeId: string, data: Partial<MermaidNodeData>) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (connection: Connection) => void;
  removeEdge: (edgeId: string) => void;
  setSelectedNodes: (nodeIds: string[]) => void;
  setSelectedEdges: (edgeIds: string[]) => void;
}

const initialState: DiagramState = {
  nodes: [],
  edges: [],
  viewport: null,
  selectedNodes: [],
  selectedEdges: [],
};

export const useDiagramStore = create<DiagramState & DiagramActions>((set) => ({
  ...initialState,

  setNodes: (nodes) => set({ nodes }),
  
  setEdges: (edges) => set({ edges }),
  
  setViewport: (viewport) => set({ viewport }),
  
  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),
  
  updateNode: (nodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    })),
  
  removeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    })),
  
  addEdge: (connection) =>
    set((state) => ({
      edges: [
        ...state.edges,
        {
          id: `${connection.source}-${connection.target}`,
          source: connection.source,
          target: connection.target,
          type: 'mermaid',
        },
      ],
    })),
  
  removeEdge: (edgeId) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
    })),
  
  setSelectedNodes: (nodeIds) => set({ selectedNodes: nodeIds }),
  
  setSelectedEdges: (edgeIds) => set({ selectedEdges: edgeIds }),
}));
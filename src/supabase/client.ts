import { createClient } from '@supabase/supabase-js';
import { Node } from '@xyflow/react';
import { MermaidNodeData } from '../components/nodes/types';
import { MermaidEdge } from '../features/mermaid/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper types for database schema
export type Tables = {
  projects: {
    id: string;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
    owner_id: string;
  };
  diagrams: {
    id: string;
    project_id: string;
    name: string;
    content: {
      nodes: Node<MermaidNodeData>[];
      edges: MermaidEdge[];
      viewport?: {
        x: number;
        y: number;
        zoom: number;
      };
    };
    mermaid_markdown: string;
    version: number;
    updated_at: string;
  };
  diagram_versions: {
    id: string;
    diagram_id: string;
    content: {
      nodes: Node<MermaidNodeData>[];
      edges: MermaidEdge[];
    };
    mermaid_markdown: string;
    created_at: string;
    author_id: string;
    message?: string;
  };
};

// Type-safe database types
export type Project = Tables['projects'];
export type Diagram = Tables['diagrams'];
export type DiagramVersion = Tables['diagram_versions'];
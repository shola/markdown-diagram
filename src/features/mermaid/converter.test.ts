import { describe, it, expect } from 'vitest';
import { MermaidConverter } from './converter';
import { Node } from '@xyflow/react';
import { MermaidNodeData } from '../../components/nodes/types';
import { MermaidEdge } from './types';

describe('MermaidConverter', () => {
  describe('flowchart', () => {
    it('should generate correct flowchart markdown', () => {
      const nodes: Node<MermaidNodeData>[] = [
        {
          id: 'a',
          type: 'flowchart',
          position: { x: 0, y: 0 },
          data: {
            type: 'flowchart',
            label: 'Start',
            shape: 'circle',
            style: {},
          },
        },
        {
          id: 'b',
          type: 'flowchart',
          position: { x: 100, y: 100 },
          data: {
            type: 'flowchart',
            label: 'Process',
            shape: 'rectangle',
            style: {},
          },
        },
      ];

      const edges: MermaidEdge[] = [
        {
          id: 'e1',
          source: 'a',
          target: 'b',
          label: 'next',
        },
      ];

      const expected = [
        '```mermaid',
        'flowchart TB',
        '    a((Start))',
        '    b[Process]',
        '    a-->b|next|',
        '```',
      ].join('\n');

      const result = MermaidConverter.convert(nodes, edges);
      expect(result).toBe(expected);
    });
  });

  describe('sequence', () => {
    it('should generate correct sequence diagram markdown', () => {
      const nodes: Node<MermaidNodeData>[] = [
        {
          id: 'user',
          type: 'sequence',
          position: { x: 0, y: 0 },
          data: {
            type: 'sequence',
            label: 'User',
            actor: true,
            style: {},
          },
        },
        {
          id: 'system',
          type: 'sequence',
          position: { x: 100, y: 0 },
          data: {
            type: 'sequence',
            label: 'System',
            style: {},
          },
        },
      ];

      const edges: Edge[] = [
        {
          id: 'e1',
          source: 'user',
          target: 'system',
          label: 'request',
        },
      ];

      const expected = [
        '```mermaid',
        'sequenceDiagram',
        '    actor user as User',
        '    participant system as System',
        '    user->>system: request',
        '```',
      ].join('\n');

      const result = MermaidConverter.convert(nodes, edges);
      expect(result).toBe(expected);
    });
  });

  describe('class', () => {
    it('should generate correct class diagram markdown', () => {
      const nodes: Node<MermaidNodeData>[] = [
        {
          id: 'animal',
          type: 'class',
          position: { x: 0, y: 0 },
          data: {
            type: 'class',
            label: 'Animal',
            shape: 'rectangle',
            properties: ['- name: string'],
            methods: ['+ makeSound(): void'],
            style: {},
          },
        },
        {
          id: 'dog',
          type: 'class',
          position: { x: 100, y: 100 },
          data: {
            type: 'class',
            label: 'Dog',
            shape: 'rectangle',
            properties: ['- breed: string'],
            methods: ['+ bark(): void'],
            style: {},
          },
        },
      ];

      const edges: Edge[] = [
        {
          id: 'e1',
          source: 'dog',
          target: 'animal',
          markerEnd: { type: 'arrowclosed' },
        },
      ];

      const expected = [
        '```mermaid',
        'classDiagram',
        '    class Animal {',
        '        - name: string',
        '        + makeSound(): void',
        '    }',
        '    class Dog {',
        '        - breed: string',
        '        + bark(): void',
        '    }',
        '    Dog --|> Animal',
        '```',
      ].join('\n');

      const result = MermaidConverter.convert(nodes, edges);
      expect(result).toBe(expected);
    });
  });

  describe('error handling', () => {
    it('should throw error for mixed diagram types', () => {
      const nodes: Node<MermaidNodeData>[] = [
        {
          id: 'a',
          type: 'flowchart',
          position: { x: 0, y: 0 },
          data: {
            type: 'flowchart',
            label: 'Start',
            shape: 'circle',
            style: {},
          },
        },
        {
          id: 'b',
          type: 'sequence',
          position: { x: 100, y: 100 },
          data: {
            type: 'sequence',
            label: 'User',
            actor: true,
            style: {},
          },
        },
      ];

      expect(() => MermaidConverter.convert(nodes, [])).toThrow('Mixed diagram types are not supported');
    });

    it('should handle empty nodes array', () => {
      expect(() => MermaidConverter.convert([], [])).toThrow('No nodes provided');
    });
  });
});
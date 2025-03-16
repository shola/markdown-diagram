import { Node } from '@xyflow/react';
import { MermaidNodeData, NodeShape } from '../../components/nodes/types';
import { MermaidEdge } from './types';

type DiagramType = 'flowchart' | 'sequence' | 'class' | 'state' | 'er' | 'gantt';

interface ParsedDiagram {
  nodes: Node<MermaidNodeData>[];
  edges: MermaidEdge[];
}

interface NodePosition {
  x: number;
  y: number;
}

interface ConversionOptions {
  direction?: 'TB' | 'BT' | 'LR' | 'RL';
}

export class MermaidConverter {
  private static getDiagramType(nodes: Node<MermaidNodeData>[]): DiagramType {
    if (nodes.length === 0) {
      throw new Error('No nodes provided');
    }
    const types = new Set(nodes.map(node => node.data.type));
    if (types.size !== 1) {
      throw new Error('Mixed diagram types are not supported');
    }
    return Array.from(types)[0] as DiagramType;
  }

  private static getEdgeRelationType(edge: MermaidEdge): 'inheritance' | 'composition' | 'association' {
    const markerEnd = edge.markerEnd as { type?: string } | undefined;
    if (markerEnd?.type === 'arrowclosed') return 'inheritance';
    if (markerEnd?.type === 'diamond') return 'composition';
    return 'association';
  }

  private static convertFlowchart(
    nodes: Node<MermaidNodeData>[],
    edges: MermaidEdge[],
    options: ConversionOptions = {}
  ): string {
    const direction = options.direction || 'TB';
    let markdown = `flowchart ${direction}\n`;

    // Convert nodes
    nodes.forEach(node => {
      const shape = node.data.shape || 'rectangle';
      let shapeStart = '[';
      let shapeEnd = ']';

      switch (shape) {
        case 'circle':
          shapeStart = '((';
          shapeEnd = '))';
          break;
        case 'diamond':
          shapeStart = '{';
          shapeEnd = '}';
          break;
        case 'hexagon':
          shapeStart = '{{';
          shapeEnd = '}}';
          break;
        case 'parallelogram':
          shapeStart = '[/';
          shapeEnd = '/]';
          break;
        case 'triangle':
          shapeStart = '[\\';
          shapeEnd = '\\]';
          break;
      }

      markdown += `    ${node.id}${shapeStart}${node.data.label}${shapeEnd}\n`;
    });

    // Convert edges
    edges.forEach(edge => {
      const arrow = edge.animated ? '-..->' : '-->';
      markdown += `    ${edge.source}${arrow}${edge.target}`;
      if (edge.label) {
        markdown += `|${edge.label}|`;
      }
      markdown += '\n';
    });

    return markdown;
  }

  private static convertSequence(
    nodes: Node<MermaidNodeData>[],
    edges: MermaidEdge[]
  ): string {
    let markdown = 'sequenceDiagram\n';

    // Define participants
    nodes.forEach(node => {
      if (node.data.type === 'sequence') {
        const isActor = 'actor' in node.data && node.data.actor;
        markdown += `    ${isActor ? 'actor' : 'participant'} ${node.id} as ${node.data.label}\n`;
      }
    });

    // Convert messages
    edges.forEach(edge => {
      markdown += `    ${edge.source}->>${edge.target}: ${edge.label || ''}\n`;
    });

    return markdown;
  }

  private static convertClass(
    nodes: Node<MermaidNodeData>[],
    edges: MermaidEdge[]
  ): string {
    let markdown = 'classDiagram\n';

    // Convert classes
    nodes.forEach(node => {
      if (node.data.type === 'class') {
        const properties = 'properties' in node.data ? node.data.properties as string[] : [];
        const methods = 'methods' in node.data ? node.data.methods as string[] : [];

        markdown += `    class ${node.data.label} {\n`;
        properties.forEach(prop => {
          markdown += `        ${prop}\n`;
        });
        methods.forEach(method => {
          markdown += `        ${method}\n`;
        });
        markdown += '    }\n';
      }
    });

    // Convert relationships
    edges.forEach(edge => {
      const source = nodes.find(n => n.id === edge.source)?.data.label;
      const target = nodes.find(n => n.id === edge.target)?.data.label;
      if (source && target) {
        const relationType = this.getEdgeRelationType(edge);
        switch (relationType) {
          case 'inheritance':
            markdown += `    ${source} --|> ${target}\n`;
            break;
          case 'composition':
            markdown += `    ${source} *-- ${target}\n`;
            break;
          default:
            markdown += `    ${source} --> ${target}\n`;
        }
      }
    });

    return markdown;
  }

  private static convertState(
    nodes: Node<MermaidNodeData>[],
    edges: MermaidEdge[]
  ): string {
    let markdown = 'stateDiagram-v2\n';

    // Convert states
    nodes.forEach(node => {
      if (node.data.type === 'state') {
        const entryAction = 'entryAction' in node.data ? node.data.entryAction as string : undefined;
        const exitAction = 'exitAction' in node.data ? node.data.exitAction as string : undefined;

        if (node.data.label.toLowerCase() === 'initial') {
          markdown += `    [*] --> ${edges.find(e => e.source === node.id)?.target}\n`;
        } else if (node.data.label.toLowerCase() === 'final') {
          markdown += `    ${edges.find(e => e.target === node.id)?.source} --> [*]\n`;
        } else {
          markdown += `    state ${node.data.label}`;
          if (node.data.description || entryAction || exitAction) {
            markdown += ' {\n';
            if (node.data.description) {
              markdown += `        description: ${node.data.description}\n`;
            }
            if (entryAction) {
              markdown += `        entry/ ${entryAction}\n`;
            }
            if (exitAction) {
              markdown += `        exit/ ${exitAction}\n`;
            }
            markdown += '    }\n';
          } else {
            markdown += '\n';
          }
        }
      }
    });

    // Convert transitions
    edges.forEach(edge => {
      if (edge.source !== '[*]' && edge.target !== '[*]') {
        markdown += `    ${edge.source} --> ${edge.target}`;
        if (edge.label) {
          markdown += `: ${edge.label}`;
        }
        markdown += '\n';
      }
    });

    return markdown;
  }

  private static convertER(
    nodes: Node<MermaidNodeData>[],
    edges: MermaidEdge[]
  ): string {
    let markdown = 'erDiagram\n';

    // Convert entities
    nodes.forEach(node => {
      if (node.data.type === 'er') {
        const attributes = 'attributes' in node.data ? node.data.attributes as Array<{
          name: string;
          type: string;
          key?: 'primary' | 'foreign';
        }> : [];

        markdown += `    ${node.data.label} {\n`;
        attributes.forEach(attr => {
          const keyType = attr.key === 'primary' ? 'PK' : attr.key === 'foreign' ? 'FK' : '';
          markdown += `        ${attr.type} ${attr.name} ${keyType}\n`;
        });
        markdown += '    }\n';
      }
    });

    // Convert relationships
    edges.forEach(edge => {
      const source = nodes.find(n => n.id === edge.source)?.data.label;
      const target = nodes.find(n => n.id === edge.target)?.data.label;
      if (source && target) {
        markdown += `    ${source} ||--o{ ${target} : "${edge.label || ''}"\n`;
      }
    });

    return markdown;
  }

  private static convertGantt(
    nodes: Node<MermaidNodeData>[]
  ): string {
    let markdown = 'gantt\n';
    markdown += '    dateFormat  YYYY-MM-DD\n';
    markdown += '    title Project Timeline\n\n';

    // Group tasks by dependencies
    const tasksByDependency = new Map<string | undefined, Node<MermaidNodeData>[]>();
    nodes.forEach(node => {
      if (node.data.type === 'gantt') {
        const deps = 'dependencies' in node.data ? (node.data.dependencies as string[])?.join(',') : undefined;
        const tasks = tasksByDependency.get(deps) || [];
        tasks.push(node);
        tasksByDependency.set(deps, tasks);
      }
    });

    // Convert tasks
    tasksByDependency.forEach((tasks, deps) => {
      if (deps) {
        markdown += `    section After ${deps}\n`;
      } else {
        markdown += '    section Start\n';
      }

      tasks.forEach(node => {
        const progress = 'progress' in node.data ? node.data.progress as number : 0;
        const status = progress === 100 ? 'done' :
                      progress > 0 ? 'active' : 'pending';
        const startDate = 'startDate' in node.data ? node.data.startDate as string : undefined;
        const endDate = 'endDate' in node.data ? node.data.endDate as string : undefined;

        markdown += `    ${node.data.label}`;
        if (startDate && endDate) {
          markdown += `: ${status}, ${startDate}, ${endDate}\n`;
        } else {
          markdown += `: ${status}, after ${deps || 'start'}\n`;
        }
      });
    });

    return markdown;
  }

  static convert(
    nodes: Node<MermaidNodeData>[],
    edges: MermaidEdge[],
    options: ConversionOptions = {}
  ): string {
    const diagramType = this.getDiagramType(nodes);

    let markdown: string;
    switch (diagramType) {
      case 'flowchart':
        markdown = this.convertFlowchart(nodes, edges, options);
        break;
      case 'sequence':
        markdown = this.convertSequence(nodes, edges);
        break;
      case 'class':
        markdown = this.convertClass(nodes, edges);
        break;
      case 'state':
        markdown = this.convertState(nodes, edges);
        break;
      case 'er':
        markdown = this.convertER(nodes, edges);
        break;
      case 'gantt':
        markdown = this.convertGantt(nodes);
        break;
      default:
        throw new Error(`Unsupported diagram type: ${diagramType}`);
    }

    return [
      '```mermaid',
      markdown,
      '```'
    ].join('\n');
  }

  private static getGridPosition(index: number, total: number): NodePosition {
    const SPACING = 200;
    const VERTICAL_SPACING = 150;
    const gridColumns = Math.ceil(Math.sqrt(total));
    return {
      x: (index % gridColumns) * SPACING + 100,
      y: Math.floor(index / gridColumns) * VERTICAL_SPACING + 100
    };
  }

  private static calculateNodePosition(index: number, total: number, type: DiagramType): NodePosition {
    const SPACING = 200;
    const VERTICAL_SPACING = 150;
    
    switch (type) {
      case 'sequence':
        // Horizontal layout for sequence diagrams
        return {
          x: index * SPACING + 100,
          y: 100
        };
      case 'gantt':
        // Vertical layout for gantt charts
        return {
          x: 100,
          y: index * VERTICAL_SPACING + 100
        };
      default:
        // Grid layout for other diagrams
        return this.getGridPosition(index, total);
    }
  }

  private static parseFlowchart(lines: string[]): ParsedDiagram {
    const nodes: Node<MermaidNodeData>[] = [];
    const edges: MermaidEdge[] = [];

    // Regular expressions for parsing
    const nodeRegex = /^\s*(\w+)([[\](){}<>].*[[\](){}<>])/;
    const edgeRegex = /^\s*(\w+)(--?-?[>x]|==?>|-.->)(\w+)(?:\|(.+?)\|)?/;

    lines.slice(1).forEach(line => {
      const nodeLine = line.match(nodeRegex);
      if (nodeLine) {
        const [, id, shape] = nodeLine;
        let nodeShape: NodeShape = 'rectangle';
        const label = shape.slice(1, -1);

        // Map Mermaid shapes to our shapes
        if (shape.startsWith('((')) nodeShape = 'circle';
        else if (shape.startsWith('{{')) nodeShape = 'hexagon';
        else if (shape.startsWith('{')) nodeShape = 'diamond';
        else if (shape.startsWith('[/')) nodeShape = 'parallelogram';
        else if (shape.startsWith('[\\')) nodeShape = 'triangle';

        nodes.push({
          id,
          type: 'default',
          position: this.calculateNodePosition(nodes.length, lines.length, 'flowchart'),
          data: {
            type: 'flowchart',
            label,
            shape: nodeShape
          }
        });
      }

      const edgeLine = line.match(edgeRegex);
      if (edgeLine) {
        const [, source, connector, target, label] = edgeLine;
        edges.push({
          id: `${source}-${target}`,
          source,
          target,
          label,
          animated: connector.includes('-.-'),
          markerEnd: {
            type: 'arrowclosed'
          }
        });
      }
    });

    return { nodes, edges };
  }

  private static parseSequence(lines: string[]): ParsedDiagram {
    const nodes: Node<MermaidNodeData>[] = [];
    const edges: MermaidEdge[] = [];

    // Regular expressions for parsing
    const participantRegex = /^\s*(participant|actor)\s+(\w+)(?:\s+as\s+(.+))?/;
    const messageRegex = /^\s*(\w+)(->>|-->|-)(\w+):(.+)?/;

    // First pass: collect all participants
    lines.slice(1).forEach(line => {
      const participantMatch = line.match(participantRegex);
      if (participantMatch) {
        const [, type, id, label] = participantMatch;
        nodes.push({
          id,
          type: 'default',
          position: this.calculateNodePosition(nodes.length, lines.length, 'sequence'),
          data: {
            type: 'sequence',
            label: label || id,
            actor: type === 'actor'
          }
        });
      }
    });

    // Second pass: collect all messages
    lines.slice(1).forEach(line => {
      const messageMatch = line.match(messageRegex);
      if (messageMatch) {
        const [, source, arrow, target, label = ''] = messageMatch;
        edges.push({
          id: `${source}-${target}-${edges.length}`,
          source,
          target,
          label: label.trim(),
          animated: arrow.includes('--'),
          markerEnd: {
            type: 'arrowclosed'
          }
        });
      }
    });

    return { nodes, edges };
  }

  static fromMermaid(markdown: string): ParsedDiagram {
    // Remove ```mermaid wrapper if present
    const content = markdown.replace(/```mermaid\n([\s\S]*?)```/, '$1').trim();
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);

    if (lines.length === 0) {
      throw new Error('Empty Mermaid diagram');
    }

    // Detect diagram type from first line
    const firstLine = lines[0].toLowerCase();
    let diagramType: DiagramType;

    if (firstLine.startsWith('flowchart') || firstLine.startsWith('graph')) {
      diagramType = 'flowchart';
    } else if (firstLine.startsWith('sequencediagram')) {
      diagramType = 'sequence';
    } else if (firstLine.startsWith('classdiagram')) {
      diagramType = 'class';
    } else if (firstLine.startsWith('statediagram')) {
      diagramType = 'state';
    } else if (firstLine.startsWith('erdiagram')) {
      diagramType = 'er';
    } else if (firstLine.startsWith('gantt')) {
      diagramType = 'gantt';
    } else {
      throw new Error(`Unsupported diagram type: ${firstLine}`);
    }

    // Parse based on diagram type
    switch (diagramType) {
      case 'flowchart':
        return this.parseFlowchart(lines);
      case 'sequence':
        return this.parseSequence(lines);
      case 'class':
        // TODO: Implement class diagram parsing
        throw new Error('Class diagram parsing not implemented yet');
      case 'state':
        // TODO: Implement state diagram parsing
        throw new Error('State diagram parsing not implemented yet');
      case 'er':
        // TODO: Implement ER diagram parsing
        throw new Error('ER diagram parsing not implemented yet');
      case 'gantt':
        // TODO: Implement Gantt chart parsing
        throw new Error('Gantt chart parsing not implemented yet');
      default:
        throw new Error(`Unsupported diagram type: ${diagramType}`);
    }
  }
}
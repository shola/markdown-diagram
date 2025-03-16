import { Node, Edge } from '@xyflow/react';
import { MermaidNodeData } from '../../components/nodes/types';

type DiagramType = 'flowchart' | 'sequence' | 'class' | 'state' | 'er' | 'gantt';

interface ConversionOptions {
  direction?: 'TB' | 'BT' | 'LR' | 'RL';
}

export class MermaidConverter {
  private static getDiagramType(nodes: Node<MermaidNodeData>[]): DiagramType {
    const types = new Set(nodes.map(node => node.data.type));
    if (types.size !== 1) {
      throw new Error('Mixed diagram types are not supported');
    }
    return Array.from(types)[0] as DiagramType;
  }

  private static getEdgeRelationType(edge: Edge): 'inheritance' | 'composition' | 'association' {
    const markerEnd = edge.markerEnd as { type?: string } | undefined;
    if (markerEnd?.type === 'arrowclosed') return 'inheritance';
    if (markerEnd?.type === 'diamond') return 'composition';
    return 'association';
  }

  private static convertFlowchart(
    nodes: Node<MermaidNodeData>[],
    edges: Edge[],
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
    edges: Edge[]
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
    edges: Edge[]
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
    edges: Edge[]
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
    edges: Edge[]
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
    edges: Edge[],
    options: ConversionOptions = {}
  ): string {
    const diagramType = this.getDiagramType(nodes);

    switch (diagramType) {
      case 'flowchart':
        return this.convertFlowchart(nodes, edges, options);
      case 'sequence':
        return this.convertSequence(nodes, edges);
      case 'class':
        return this.convertClass(nodes, edges);
      case 'state':
        return this.convertState(nodes, edges);
      case 'er':
        return this.convertER(nodes, edges);
      case 'gantt':
        return this.convertGantt(nodes);
      default:
        throw new Error(`Unsupported diagram type: ${diagramType}`);
    }
  }
}
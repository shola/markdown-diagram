import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MermaidNodeProps, NodeShape } from './types';

const MermaidNode = ({
  data,
  selected,
}: MermaidNodeProps) => {
  const { label, description, shape = 'rectangle', style = {} } = data;

  // Define shape-specific styles
  const shapeStyles: Record<NodeShape, string> = {
    rectangle: 'rounded-lg',
    circle: 'rounded-full aspect-square',
    diamond: 'rotate-45',
    hexagon: 'clip-path-hexagon',
    database: 'rounded-lg border-b-4',
    queue: 'rounded-lg border-l-4',
    cloud: 'rounded-full',
    cylinder: 'rounded-lg border-t-4 border-b-4',
    microservice: 'rounded-lg border-2 border-dashed',
  };

  // Additional shape-specific elements
  const ShapeDecorator = () => {
    switch (shape) {
      case 'database':
        return <div className="absolute -bottom-1 left-0 right-0 h-1 bg-current opacity-20 rounded-b-lg" />;
      case 'cloud':
        return (
          <>
            <div className="absolute -top-2 left-1/4 right-1/4 h-2 bg-current opacity-10 rounded-full" />
            <div className="absolute -bottom-2 left-1/4 right-1/4 h-2 bg-current opacity-10 rounded-full" />
          </>
        );
      case 'cylinder':
        return (
          <>
            <div className="absolute -top-1 left-0 right-0 h-1 bg-current opacity-20 rounded-t-lg" />
            <div className="absolute -bottom-1 left-0 right-0 h-1 bg-current opacity-20 rounded-b-lg" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`
        mermaid-node
        ${shapeStyles[shape]}
        ${selected ? 'ring-2 ring-primary' : ''}
        bg-background
        border border-border
        shadow-sm
        transition-all
        hover:shadow-md
        p-4
        min-w-[150px]
        relative
      `}
      style={{
        backgroundColor: style.fill,
        borderColor: style.stroke,
        borderWidth: style.strokeWidth,
        borderStyle: style.dashArray ? 'dashed' : 'solid',
      }}
    >
      <ShapeDecorator />
      
      <div className="mermaid-node__content relative z-10">
        <div className="mermaid-node__header font-medium">
          {label}
        </div>
        
        {description && (
          <div className="mermaid-node__description text-sm text-muted-foreground mt-1">
            {description}
          </div>
        )}

        {/* Render type-specific content */}
        {data.type === 'architecture' && (
          <div className="mt-2 text-xs">
            {data.technology && (
              <div className="text-muted-foreground">
                Tech: {data.technology}
              </div>
            )}
            {data.protocol && (
              <div className="text-muted-foreground">
                Protocol: {data.protocol}
              </div>
            )}
            {data.scalability && (
              <div className="text-muted-foreground">
                Scale: {data.scalability}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-primary !w-3 !h-3 !border-2 !border-background"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-primary !w-3 !h-3 !border-2 !border-background"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-primary !w-3 !h-3 !border-2 !border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-primary !w-3 !h-3 !border-2 !border-background"
      />
    </div>
  );
};

export default memo(MermaidNode);
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MermaidNodeProps } from './types';

const MermaidNode = ({
  data,
  selected,
}: MermaidNodeProps) => {
  const { label, description, shape = 'rectangle', style = {} } = data;

  // Define shape-specific styles
  const shapeStyles: Record<NonNullable<typeof shape>, string> = {
    rectangle: 'rounded-lg',
    circle: 'rounded-full aspect-square',
    diamond: 'rotate-45',
    hexagon: 'clip-path-hexagon',
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
      `}
      style={{
        backgroundColor: style.fill,
        borderColor: style.stroke,
        borderWidth: style.strokeWidth,
      }}
    >
      <div className="mermaid-node__content">
        <div className="mermaid-node__header font-medium">
          {label}
        </div>
        
        {description && (
          <div className="mermaid-node__description text-sm text-muted-foreground mt-1">
            {description}
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
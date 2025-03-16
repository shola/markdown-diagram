import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MermaidNodeProps } from './types';

const FlowchartNode = ({
  data,
  selected,
}: MermaidNodeProps) => {
  if (data.type !== 'flowchart') return null;

  const { label, description, shape = 'rectangle', style = {}, condition } = data;

  // Flowchart-specific shapes
  const shapeStyles: Record<string, string> = {
    rectangle: 'rounded-lg',
    diamond: 'rotate-45',
    circle: 'rounded-full aspect-square',
    parallelogram: 'skew-x-12',
    hexagon: 'clip-path-hexagon',
    triangle: 'clip-path-triangle',
    oval: 'rounded-full px-8',
  };

  // Decision diamond needs special handling for text
  const isDecision = shape === 'diamond';

  return (
    <div
      className={`
        flowchart-node
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
      <div className={`
        flowchart-node__content
        relative z-10
        ${isDecision ? '-rotate-45' : ''}
      `}>
        <div className="flowchart-node__header font-medium">
          {label}
        </div>
        
        {description && (
          <div className="flowchart-node__description text-sm text-muted-foreground mt-1">
            {description}
          </div>
        )}

        {condition && (
          <div className="flowchart-node__condition mt-2 text-sm font-medium text-primary">
            {condition}
          </div>
        )}
      </div>

      {/* Handles - positioned based on shape */}
      {isDecision ? (
        <>
          {/* Diamond shape handles */}
          <Handle
            type="target"
            position={Position.Top}
            className="!bg-primary !w-3 !h-3 !border-2 !border-background rotate-45"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            className="!bg-primary !w-3 !h-3 !border-2 !border-background rotate-45"
          />
          <Handle
            type="source"
            position={Position.Right}
            className="!bg-primary !w-3 !h-3 !border-2 !border-background rotate-45"
          />
          <Handle
            type="source"
            position={Position.Left}
            className="!bg-primary !w-3 !h-3 !border-2 !border-background rotate-45"
          />
        </>
      ) : (
        <>
          {/* Standard handles */}
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
        </>
      )}
    </div>
  );
};

export default memo(FlowchartNode);
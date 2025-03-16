import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MermaidNodeProps } from './types';

const SequenceNode = ({
  data,
  selected,
}: MermaidNodeProps) => {
  if (data.type !== 'sequence') return null;

  const { label, description, style = {}, actor = false } = data;

  return (
    <div
      className={`
        sequence-node
        ${actor ? 'sequence-node--actor' : 'rounded-lg'}
        ${selected ? 'ring-2 ring-primary' : ''}
        bg-background
        border border-border
        shadow-sm
        transition-all
        hover:shadow-md
        p-4
        min-w-[120px]
        relative
      `}
      style={{
        backgroundColor: style.fill,
        borderColor: style.stroke,
        borderWidth: style.strokeWidth,
        borderStyle: style.dashArray ? 'dashed' : 'solid',
      }}
    >
      {/* Actor stick figure */}
      {actor && (
        <div className="sequence-node__actor mb-2">
          <div className="w-8 h-8 mx-auto mb-1 relative">
            {/* Head */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-current" />
            {/* Body */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0 h-4 border-l-2 border-current" />
            {/* Arms */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-4 h-0 border-t-2 border-current" />
            {/* Legs */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2">
              <div className="relative w-4 h-4">
                <div className="absolute top-0 left-0 w-2 h-0 border-t-2 border-current rotate-45 origin-left" />
                <div className="absolute top-0 right-0 w-2 h-0 border-t-2 border-current -rotate-45 origin-right" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="sequence-node__content text-center">
        <div className="sequence-node__header font-medium">
          {label}
        </div>
        
        {description && (
          <div className="sequence-node__description text-sm text-muted-foreground mt-1">
            {description}
          </div>
        )}
      </div>

      {/* Vertical line for lifeline */}
      <div className="absolute left-1/2 -bottom-16 w-0 h-16 border-l-2 border-dashed border-muted-foreground" />

      {/* Handles for message connections */}
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
      
      {/* Additional handles for activation boxes */}
      <Handle
        type="target"
        position={Position.Bottom}
        id="activation"
        className="!bg-primary !w-3 !h-3 !border-2 !border-background"
        style={{ left: '50%' }}
      />
    </div>
  );
};

export default memo(SequenceNode);
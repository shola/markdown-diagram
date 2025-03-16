import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MermaidNodeProps } from './types';

const StateNode = ({
  data,
  selected,
}: MermaidNodeProps) => {
  if (data.type !== 'state') return null;

  const { label, description, shape = 'circle', style = {}, entryAction, exitAction } = data;

  // Special styling for initial/final states
  const isInitial = label.toLowerCase() === 'initial';
  const isFinal = label.toLowerCase() === 'final';

  return (
    <div
      className={`
        state-node
        ${shape === 'circle' ? 'rounded-full aspect-square' : 'rounded-lg'}
        ${selected ? 'ring-2 ring-primary' : ''}
        ${isInitial ? 'bg-black' : isFinal ? 'bg-background p-2' : 'bg-background'}
        border border-border
        shadow-sm
        transition-all
        hover:shadow-md
        min-w-[150px]
        relative
      `}
      style={{
        backgroundColor: isInitial ? '#000' : style.fill,
        borderColor: style.stroke,
        borderWidth: isFinal ? '3px' : style.strokeWidth,
        borderStyle: style.dashArray ? 'dashed' : 'solid',
      }}
    >
      {/* Final state inner circle */}
      {isFinal && (
        <div className="absolute inset-2 rounded-full bg-black" />
      )}

      {/* Regular state content */}
      {!isInitial && !isFinal && (
        <div className="state-node__content p-4">
          <div className="state-node__header font-medium text-center">
            {label}
          </div>
          
          {description && (
            <div className="text-xs text-muted-foreground text-center mt-1">
              {description}
            </div>
          )}

          {/* Entry/Exit Actions */}
          {(entryAction || exitAction) && (
            <div className="border-t border-border mt-2 pt-2 text-xs">
              {entryAction && (
                <div className="text-muted-foreground">
                  entry / {entryAction}
                </div>
              )}
              {exitAction && (
                <div className="text-muted-foreground">
                  exit / {exitAction}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Handles for transitions */}
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

      {/* Self-transition handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="self"
        className="!bg-primary !w-3 !h-3 !border-2 !border-background"
        style={{ top: '25%' }}
      />
    </div>
  );
};

export default memo(StateNode);
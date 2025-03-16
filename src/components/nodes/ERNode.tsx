import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MermaidNodeProps } from './types';

const ERNode = ({
  data,
  selected,
}: MermaidNodeProps) => {
  if (data.type !== 'er') return null;

  const { label, description, style = {}, attributes = [] } = data;

  // Format attribute with key indicator
  const formatAttribute = (attr: { name: string; type: string; key?: 'primary' | 'foreign' }) => {
    const keyIndicator = attr.key === 'primary' ? 'PK' : attr.key === 'foreign' ? 'FK' : '';
    return (
      <div 
        key={attr.name}
        className={`
          text-sm font-mono
          ${attr.key === 'primary' ? 'font-bold' : ''}
          ${attr.key === 'foreign' ? 'italic' : ''}
        `}
      >
        {keyIndicator && (
          <span className="text-xs mr-2 text-muted-foreground">
            {keyIndicator}
          </span>
        )}
        {attr.name}: {attr.type}
      </div>
    );
  };

  return (
    <div
      className={`
        er-node
        rounded-lg
        ${selected ? 'ring-2 ring-primary' : ''}
        bg-background
        border border-border
        shadow-sm
        transition-all
        hover:shadow-md
        min-w-[200px]
        relative
      `}
      style={{
        backgroundColor: style.fill,
        borderColor: style.stroke,
        borderWidth: style.strokeWidth,
        borderStyle: style.dashArray ? 'dashed' : 'solid',
      }}
    >
      {/* Entity Name */}
      <div className="er-node__header font-medium text-center p-2 border-b border-border">
        {label}
        {description && (
          <div className="text-xs text-muted-foreground mt-1">
            {description}
          </div>
        )}
      </div>

      {/* Attributes */}
      <div className="er-node__attributes p-2 space-y-1">
        {attributes.map((attr) => formatAttribute(attr))}
        {attributes.length === 0 && (
          <div className="text-xs text-muted-foreground text-center">
            No attributes
          </div>
        )}
      </div>

      {/* Handles for relationships */}
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

      {/* Additional handles for cardinality markers */}
      <Handle
        type="source"
        position={Position.Right}
        id="one"
        className="!bg-primary !w-3 !h-3 !border-2 !border-background"
        style={{ top: '25%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="many"
        className="!bg-primary !w-3 !h-3 !border-2 !border-background"
        style={{ top: '75%' }}
      />
    </div>
  );
};

export default memo(ERNode);
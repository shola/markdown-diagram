import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MermaidNodeProps } from './types';

const ClassNode = ({
  data,
  selected,
}: MermaidNodeProps) => {
  if (data.type !== 'class') return null;

  const { label, description, style = {}, methods = [], properties = [], stereotype } = data;

  // Format method or property with visibility
  const formatMember = (member: string) => {
    if (!member.startsWith('+') && !member.startsWith('-') && 
        !member.startsWith('#') && !member.startsWith('~')) {
      return '+ ' + member;
    }
    return member;
  };

  return (
    <div
      className={`
        class-node
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
      {/* Stereotype */}
      {stereotype && (
        <div className="class-node__stereotype text-xs text-muted-foreground text-center italic py-1 border-b border-border">
          «{stereotype}»
        </div>
      )}

      {/* Class Name */}
      <div className="class-node__header font-medium text-center p-2 border-b border-border">
        {label}
        {description && (
          <div className="text-xs text-muted-foreground mt-1">
            {description}
          </div>
        )}
      </div>

      {/* Properties */}
      <div className="class-node__properties border-b border-border p-2">
        {properties.map((prop, index) => (
          <div key={`prop-${index}`} className="text-sm font-mono">
            {formatMember(prop)}
          </div>
        ))}
        {properties.length === 0 && (
          <div className="text-xs text-muted-foreground text-center">No properties</div>
        )}
      </div>

      {/* Methods */}
      <div className="class-node__methods p-2">
        {methods.map((method, index) => (
          <div key={`method-${index}`} className="text-sm font-mono">
            {formatMember(method)}
          </div>
        ))}
        {methods.length === 0 && (
          <div className="text-xs text-muted-foreground text-center">No methods</div>
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
    </div>
  );
};

export default memo(ClassNode);
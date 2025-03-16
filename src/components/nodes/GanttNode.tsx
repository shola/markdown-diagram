import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MermaidNodeProps } from './types';

const GanttNode = ({
  data,
  selected,
}: MermaidNodeProps) => {
  if (data.type !== 'gantt') return null;

  const { 
    label, 
    description, 
    style = {}, 
    startDate, 
    endDate,
    dependencies = [],
    progress = 0 
  } = data as {
    label: string;
    description?: string;
    style?: { fill?: string; stroke?: string; strokeWidth?: number; dashArray?: string };
    startDate?: string;
    endDate?: string;
    dependencies?: string[];
    progress?: number;
  };

  // Format date for display
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate duration in days
  const getDuration = () => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} days`;
  };

  return (
    <div
      className={`
        gantt-node
        rounded-lg
        ${selected ? 'ring-2 ring-primary' : ''}
        bg-background
        border border-border
        shadow-sm
        transition-all
        hover:shadow-md
        min-w-[250px]
        relative
      `}
      style={{
        backgroundColor: style.fill,
        borderColor: style.stroke,
        borderWidth: style.strokeWidth,
        borderStyle: style.dashArray ? 'dashed' : 'solid',
      }}
    >
      {/* Task Header */}
      <div className="gantt-node__header p-2 border-b border-border">
        <div className="font-medium">
          {label}
        </div>
        {description && (
          <div className="text-xs text-muted-foreground mt-1">
            {description}
          </div>
        )}
      </div>

      {/* Task Details */}
      <div className="gantt-node__details p-2 space-y-2">
        {/* Dates */}
        {(startDate || endDate) && (
          <div className="text-sm">
            {startDate && (
              <span className="text-muted-foreground">
                Start: {formatDate(startDate)}
              </span>
            )}
            {startDate && endDate && (
              <span className="mx-2">→</span>
            )}
            {endDate && (
              <span className="text-muted-foreground">
                End: {formatDate(endDate)}
              </span>
            )}
          </div>
        )}

        {/* Duration */}
        {getDuration() && (
          <div className="text-sm text-muted-foreground">
            Duration: {getDuration()}
          </div>
        )}

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-primary rounded-full"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        )}

        {/* Dependencies */}
        {dependencies.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Depends on: {dependencies.join(', ')}
          </div>
        )}
      </div>

      {/* Handles for dependencies */}
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

export default memo(GanttNode);
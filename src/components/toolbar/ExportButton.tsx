import { useCallback, useState, useRef, useEffect } from 'react';
import { useReactFlow, Edge } from '@xyflow/react';
import toast from 'react-hot-toast';
import { MermaidConverter } from '../../features/mermaid/converter';
import { PreviewDialog } from './PreviewDialog';

type DiagramType = 'flowchart' | 'sequence' | 'class' | 'state' | 'er' | 'gantt';

export const ExportButton = () => {
  const instance = useReactFlow();
  const [isOpen, setIsOpen] = useState(false);
  const [previewData, setPreviewData] = useState<{ markdown: string; isOpen: boolean }>({
    markdown: '',
    isOpen: false,
  });
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleExport = useCallback((type: DiagramType) => {
    try {
      const allNodes = instance.getNodes();
      const allEdges = instance.getEdges();

      // Filter nodes by type
      const nodes = allNodes.filter(node => 
        node.data.type === type
      ) as Parameters<typeof MermaidConverter.convert>[0];

      // Filter edges that connect these nodes
      const nodeIds = new Set(nodes.map(node => node.id));
      const edges = allEdges.filter(edge =>
        nodeIds.has(edge.source) && nodeIds.has(edge.target)
      ) as Edge[];

      if (nodes.length === 0) {
        throw new Error(`No ${type} diagram nodes found`);
      }

      const markdown = MermaidConverter.convert(nodes, edges);

      // Show preview dialog
      setPreviewData({
        markdown,
        isOpen: true,
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [instance]);

  const handleCopy = useCallback(() => {
    try {
      // Copy to clipboard
      const textarea = document.createElement('textarea');
      textarea.value = previewData.markdown;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      // Close preview and show success message
      setPreviewData(prev => ({ ...prev, isOpen: false }));
      alert('Mermaid markdown copied to clipboard!');
    } catch (error) {
      console.error('Copy failed:', error);
      alert('Failed to copy to clipboard');
    }
  }, [previewData.markdown]);

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Export as Mermaid
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg overflow-hidden">
            <div className="py-1">
              {(['flowchart', 'sequence', 'class', 'state', 'er', 'gantt'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => handleExport(type)}
                  className="w-full px-4 py-2 text-left hover:bg-accent text-sm capitalize"
                >
                  {type} Diagram
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <PreviewDialog
        markdown={previewData.markdown}
        isOpen={previewData.isOpen}
        onClose={() => setPreviewData(prev => ({ ...prev, isOpen: false }))}
        onCopy={handleCopy}
      />
    </>
  );
};
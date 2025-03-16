import { useCallback } from 'react';
import { useReactFlow, Edge } from '@xyflow/react';
import { MermaidConverter } from '../../features/mermaid/converter';

export const ExportButton = () => {
  const instance = useReactFlow();

  const handleExport = useCallback(() => {
    try {
      const nodes = instance.getNodes();
      const edges = instance.getEdges();

      // Type assertion since we know our nodes are MermaidNodeData
      const markdown = MermaidConverter.convert(
        nodes as Parameters<typeof MermaidConverter.convert>[0],
        edges as Edge[]
      );

      // Create a temporary textarea to copy the markdown
      const textarea = document.createElement('textarea');
      textarea.value = markdown;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      // Show success message
      alert('Mermaid markdown copied to clipboard!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [instance]);

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
    >
      Export as Mermaid
    </button>
  );
};
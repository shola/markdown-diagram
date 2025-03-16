import { useEffect, useRef, useCallback } from 'react';
import mermaid from 'mermaid';

interface PreviewDialogProps {
  markdown: string;
  isOpen: boolean;
  onClose: () => void;
  onCopy: () => void;
}

export const PreviewDialog = ({ markdown, isOpen, onClose, onCopy }: PreviewDialogProps) => {
  const previewRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Close on Escape
    if (e.key === 'Escape') {
      onClose();
    }
    // Copy on Cmd/Ctrl + C
    if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
      e.preventDefault();
      onCopy();
    }
  }, [onClose, onCopy]);

  useEffect(() => {
    if (isOpen) {
      // Initialize mermaid
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
      });
      
      try {
        // Clear previous content
        if (previewRef.current) {
          previewRef.current.innerHTML = '';
          // Generate new diagram
          mermaid.render('preview', markdown).then(({ svg }) => {
            if (previewRef.current) {
              previewRef.current.innerHTML = svg;
            }
          });
        }
      } catch (error) {
        console.error('Mermaid render error:', error);
        if (previewRef.current) {
          previewRef.current.innerHTML = 'Error rendering preview';
        }
      }

      // Add keyboard event listener
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, markdown, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-medium">Preview Mermaid Diagram</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            {/* Preview */}
            <div
              ref={previewRef}
              className="border border-border rounded-lg p-4 bg-white"
            />

            {/* Markdown */}
            <div className="space-y-2">
              <h3 className="font-medium">Mermaid Markdown</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-48">
                <code>{markdown}</code>
              </pre>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent"
          >
            Cancel
          </button>
          <button
            onClick={onCopy}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  );
};
import { Card } from '@/components/ui/card';

interface SqlViewerProps {
  query: string;
}

export const SqlViewer = ({ query }: SqlViewerProps) => {
  return (
    <Card className="p-4 h-full">
      <h4 className="text-sm font-semibold mb-3 text-muted-foreground">SQL Query</h4>
      <div className="bg-accent/50 rounded-md p-3 h-full overflow-auto">
        <pre className="text-xs font-mono text-accent-foreground whitespace-pre-wrap">
          {query}
        </pre>
      </div>
    </Card>
  );
};
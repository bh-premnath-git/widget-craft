import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, RotateCcw, RefreshCw } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { flipWidget, maximizeWidget, refreshWidget } from '@/store/dashboardStore';

interface WidgetHeaderProps {
  widgetId: string;
  title: string;
  isFlipped: boolean;
  isMaximized: boolean;
  isRefreshing?: boolean;
}

export const WidgetHeader = ({ 
  widgetId, 
  title, 
  isFlipped, 
  isMaximized, 
  isRefreshing = false 
}: WidgetHeaderProps) => {
  const dispatch = useDispatch();

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(flipWidget(widgetId));
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(maximizeWidget(widgetId));
  };

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(refreshWidget(widgetId));
  };

  return (
    <div className="flex items-center justify-between p-4 bg-widget-header border-b border-widget-border relative z-10">
      <h3 className="text-sm font-semibold text-foreground truncate">{title}</h3>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFlip}
          className="h-8 w-8 p-0 hover:bg-muted relative z-20"
          title={isFlipped ? "Show Chart" : "Show Data"}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          className="h-8 w-8 p-0 hover:bg-muted relative z-20"
          disabled={isRefreshing}
          title="Refresh Data"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMaximize}
          className="h-8 w-8 p-0 hover:bg-muted relative z-20"
          title={isMaximized ? "Minimize" : "Maximize"}
        >
          {isMaximized ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
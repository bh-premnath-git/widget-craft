import { Button } from '@/components/ui/button';
import { downloadElementAsJPEG, downloadElementAsPDF } from '@/lib/download';
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  RefreshCw,
  Settings,
  BarChart3,
  Palette,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import {
  removeWidget,
  flipWidget,
  toggleMaximize,
  refreshWidget,
  toggleChartTypePicker,
  toggleColorSchemePicker,
} from '@/store/dashboardStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

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
  isRefreshing = false,
}: WidgetHeaderProps) => {
  const dispatch = useDispatch();

  const stop = (e: React.SyntheticEvent | Event) => {
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
    if (typeof e.preventDefault === 'function') e.preventDefault();
  };

  return (
    <div className="widget-header flex items-center justify-between p-4 bg-widget-header border-b border-widget-border relative z-10">
      <h3 className="widget-drag-handle text-sm font-semibold text-foreground truncate cursor-move">
        {title}
      </h3>

      <div className="flex items-center gap-1">
        {/* flip front/back */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            stop(e);
            dispatch(flipWidget(widgetId));
          }}
          className="h-8 w-8 p-0 hover:bg-muted hover:text-foreground relative z-30"
          title={isFlipped ? 'Show Chart' : 'Show Data'}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        {/* manual data refresh */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            stop(e);
            dispatch(refreshWidget(widgetId));
          }}
          className="h-8 w-8 p-0 hover:bg-muted hover:text-foreground relative z-20"
          disabled={isRefreshing}
          title="Refresh Data"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>

        {/* maximize / restore */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            stop(e);
            dispatch(toggleMaximize(widgetId));
          }}
          className="h-8 w-8 p-0 hover:bg-muted hover:text-foreground relative z-20"
          title={isMaximized ? 'Minimize' : 'Maximize'}
        >
          {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>

        {/* settings drop‑down */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-muted hover:text-foreground relative z-20"
              onClick={stop}
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={(e) => {
                stop(e);
                dispatch(toggleChartTypePicker(widgetId));
              }}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Chart Type
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                stop(e);
                dispatch(toggleColorSchemePicker(widgetId));
              }}
            >
              <Palette className="mr-2 h-4 w-4" />
              Color Scheme
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-muted hover:text-foreground relative z-20"
              onClick={stop}
              title="More"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={(e) => {
                stop(e);
                const el = document.getElementById(`widget-${widgetId}`);
                if (el) downloadElementAsPDF(el, `${title}.pdf`);
              }}
            >
              Download PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                stop(e);
                const el = document.getElementById(`widget-${widgetId}`);
                if (el) downloadElementAsJPEG(el, `${title}.jpeg`);
              }}
            >
              Download JPEG
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                stop(e);
                dispatch(removeWidget(widgetId));
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

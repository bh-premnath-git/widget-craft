import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Unlock, RefreshCw, Star, Link, MoreHorizontal } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, toggleGridLock, refreshWidget } from '@/store/dashboardStore';

export const DashboardHeader = () => {
  const dispatch = useDispatch();
  const { widgets, isGridLocked } = useSelector((state: RootState) => state.dashboard);

  const handleRefreshAll = () => {
    Object.keys(widgets).forEach(widgetId => {
      dispatch(refreshWidget(widgetId));
    });
  };

  const handleToggleLock = () => {
    dispatch(toggleGridLock());
  };

  return (
    <div className="flex items-center justify-between p-6 bg-widget-bg border-b border-widget-border">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">Release 1 Dashboard</h1>
          <Badge variant="outline" className="text-xs">
            {Object.keys(widgets).length} widgets
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Star className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Link className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefreshAll}
          className="h-8 px-3"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
        <Button
          variant={isGridLocked ? "default" : "ghost"}
          size="sm"
          onClick={handleToggleLock}
          className="h-8 px-3"
        >
          {isGridLocked ? (
            <>
              <Lock className="h-4 w-4 mr-1" />
              Locked
            </>
          ) : (
            <>
              <Unlock className="h-4 w-4 mr-1" />
              Unlocked
            </>
          )}
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
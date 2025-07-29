import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { addWidget, RootState } from '@/store/dashboardStore';
import { useWidgetData } from '@/hooks/useWidgetData';

const defaultLayouts: Record<string, { x: number; y: number; w: number; h: number }> = {
  'chart-widget-1': { x: 0, y: 0, w: 4, h: 8 },
  'chart-widget-2': { x: 4, y: 0, w: 4, h: 8 },
  'table-widget-1': { x: 8, y: 0, w: 4, h: 8 }
};

const Index = () => {
   const dispatch = useDispatch();
  const widgets = useSelector((state: RootState) => state.dashboard.widgets);

  // Prefetch widget data using the existing hook
  useWidgetData('chart-widget-1');
  useWidgetData('chart-widget-2');
  useWidgetData('table-widget-1');

  useEffect(() => {
    const defaultWidgetIds = ['chart-widget-1', 'chart-widget-2', 'table-widget-1'];

    defaultWidgetIds.forEach(id => {
      if (!widgets[id]) {
        dispatch(
          addWidget({
            id,
            isFlipped: false,
            ischartView: true,
            isColorScheme: false,
            isMaximized: false,
            lastRefreshed: Date.now(),
            layout: defaultLayouts[id] || { x: 0, y: 0, w: 4, h: 8 }
          })
        );
      }
    });
  }, [dispatch, widgets]);

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <DashboardHeader />
      <div className="p-6">
        <DashboardGrid />
      </div>
    </div>
  );
};

export default Index;

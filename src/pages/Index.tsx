import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import {
  addWidget,
  RootState,
  AppDispatch,
} from '@/store/dashboardStore';
import { useWidgetData } from '@/hooks/useWidgetData';

/* ------------------------------------------------------------------ */
/*  Preset layouts                                                     */
/* ------------------------------------------------------------------ */

const defaultLayouts = {
  'chart-widget-1': { x: 0, y: 0, w: 4, h: 8 },
  'chart-widget-2': { x: 4, y: 0, w: 4, h: 8 },
  'table-widget-1': { x: 8, y: 0, w: 4, h: 8 },
} as const;

/* ------------------------------------------------------------------ */
/*  Default widget definitions                                         */
/* ------------------------------------------------------------------ */

const defaultWidgets = [
  {
    id: 'chart-widget-1',
    view: 'chart',
    chartType: 'bar',
    layout: defaultLayouts['chart-widget-1'],
  },
  {
    id: 'chart-widget-2',
    view: 'chart',
    chartType: 'line',
    layout: defaultLayouts['chart-widget-2'],
  },
  {
    id: 'table-widget-1',
    view: 'table',
    layout: defaultLayouts['table-widget-1'],
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

const Index = () => {
  const dispatch = useDispatch<AppDispatch>();
  const widgets = useSelector((s: RootState) => s.dashboard.widgets);

  // Prefetch widget data
  useWidgetData('chart-widget-1');
  useWidgetData('chart-widget-2');
  useWidgetData('table-widget-1');

  useEffect(() => {
    defaultWidgets.forEach((w) => {
      if (!widgets[w.id]) {
        dispatch(addWidget(w));
      }
    });
  }, [dispatch]);

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

import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, updateWidgetLayout } from '@/store/dashboardStore';
import { WidgetWrapper } from '@/components/widgets/WidgetWrapper';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  className?: string;
}

export const DashboardGrid = ({ className }: DashboardGridProps) => {
  const dispatch = useDispatch();
  const { widgets, isGridLocked } = useSelector((state: RootState) => state.dashboard);

  const layouts = {
    lg: Object.values(widgets).map(widget => ({
      i: widget.id,
      x: widget.layout.x,
      y: widget.layout.y,
      w: widget.layout.w,
      h: widget.layout.h,
      minW: 3,
      minH: 3
    }))
  };

  const handleLayoutChange = (layout: Layout[]) => {
    if (isGridLocked) return;
    
    layout.forEach(item => {
      dispatch(updateWidgetLayout({
        id: item.i,
        layout: {
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h
        }
      }));
    });
  };

  const widgetTitles: Record<string, string> = {
    'chart-widget-1': 'Recently Created Chart: bh-release1',
    'chart-widget-2': 'Pie Chart: bh-release1',
    'table-widget-1': 'Two Dimensional Filter Statistics: bh-release1'
  };

  return (
    <div className={className}>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        margin={[16, 16]}
        onLayoutChange={handleLayoutChange}
        isDraggable={!isGridLocked}
        isResizable={!isGridLocked}
        useCSSTransforms={true}
        draggableCancel=".widget-header, .widget-header *"
        onResizeStop={() => {
          // Force chart resize after grid resize
          setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
          }, 100);
        }}
      >
        {Object.values(widgets).map(widget => (
          <div key={widget.id} className="widget-grid-item">
            <WidgetWrapper
              widgetId={widget.id}
              title={widgetTitles[widget.id] || 'Widget'}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};
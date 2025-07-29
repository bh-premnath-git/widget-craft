import { createPortal } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WidgetHeader } from './WidgetHeader';
import { ChartView } from './ChartView';
import { TableView } from './TableView';
import { SqlViewer } from './SqlViewer';
import { ChartTypeViewer } from './ChartTypeViewer';
import { ColorSchemeViewer } from './ColorSchemeViewer';
import {
  RootState, setChartType, setColorScheme, toggleChartTypePicker,
  toggleColorSchemePicker
} from '@/store/dashboardStore';
import { useWidgetData } from '@/hooks/useWidgetData';
import { Skeleton } from '@/components/ui/skeleton';

interface WidgetWrapperProps {
  widgetId: string;
  title: string;
  className?: string;
}

export const WidgetWrapper = ({ widgetId, title, className }: WidgetWrapperProps) => {
  const widget = useSelector((state: RootState) => state.dashboard.widgets[widgetId]);
  const { data, isLoading, isRefetching } = useWidgetData(widgetId);
  const dispatch = useDispatch();
  if (!widget) return null;

  const { isFlipped, isMaximized, isChartTypePickerOpen, isColorSchemePickerOpen, chartType, color } = widget;
  /* ------------------------------------------------------------------ */
  /*  Loading placeholder                                               */
  /* ------------------------------------------------------------------ */
  if (isLoading || isRefetching) {
    const skeleton = (
      <Card  id={`widget-${widgetId}`}  className={`bg-widget-bg border-widget-border shadow-widget h-full ${className}`}>
        <WidgetHeader
          widgetId={widgetId}
          title={title}
          isFlipped={isFlipped}
          isMaximized={isMaximized}
          isRefreshing={true}
        />
        <div className="p-2 h-full flex flex-col gap-3">
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full flex-1" />
          <div className="flex gap-2">
            <Skeleton className="w-20 h-6" />
            <Skeleton className="w-16 h-6" />
          </div>
        </div>
      </Card>
    );
    return isMaximized
      ? createPortal(<div className="fixed inset-0 z-50 bg-dashboard-bg p-4">{skeleton}</div>, document.body)
      : skeleton;
  }

  if (!data) return null;

  /* ------------------------------------------------------------------ */
  /*  1) ChartType picker OR 2) ColorScheme picker OR 3) Normal content */
  /* ------------------------------------------------------------------ */
  const pickerBody = isChartTypePickerOpen ? (
    <ChartTypeViewer
      selected={chartType}
      onChange={(type) => dispatch(setChartType({ id: widgetId, chartType: type }))}
      onApply={() => dispatch(toggleChartTypePicker(widgetId))}
    />
  ) : isColorSchemePickerOpen ? (
    <ColorSchemeViewer
      selected={color.scheme}
      onChange={(scheme, palette) =>
        dispatch(setColorScheme({ id: widgetId, scheme, customPalette: palette }))
      }
      onApply={() => dispatch(toggleColorSchemePicker(widgetId))}
    />
  ) : null;

  const contentBody = pickerBody ? (
    /* ── Show picker as main body ── */
    <div className="p-4 overflow-auto h-full">{pickerBody}</div>
  ) : (
    /* ── Normal flip/card content ── */
    <div className="h-[calc(100%-64px)] relative overflow-hidden perspective-1000">
      <div
        className={`absolute inset-0 transition-all duration-600 ease-in-out ${isFlipped ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'
          }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front (chart) */}
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <div className="p-2 h-full">
            <ChartView data={data.plotlyData} layout={data.plotlyLayout} widgetId={widgetId} chartType={chartType} color={color} />
          </div>
        </div>

        {/* Back (table / SQL) */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <Tabs defaultValue="table" className="h-full flex flex-col">
            <div className="px-2 pt-1">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="table" className="text-xs">
                  Table
                </TabsTrigger>
                <TabsTrigger value="sql" className="text-xs">
                  SQL
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="flex-1 p-2 pt-1">
              <TabsContent value="table" className="h-full m-0">
                <TableView columns={data.tableData.columns} rows={data.tableData.rows} />
              </TabsContent>
              <TabsContent value="sql" className="h-full m-0">
                <SqlViewer query={data.query} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );

  const card = (
    <Card  id={`widget-${widgetId}`} className={`bg-widget-bg border-widget-border shadow-widget hover:shadow-widget-hover transition-smooth h-full overflow-hidden ${className}`}>
      <WidgetHeader
        widgetId={widgetId}
        title={title}
        isFlipped={isFlipped}
        isMaximized={isMaximized}
        isRefreshing={isLoading || isRefetching}
      />
      {contentBody}
    </Card>
  );

  return isMaximized
    ? createPortal(
      <div className="fixed inset-0 z-50 bg-dashboard-bg overflow-auto">
        <div className="min-h-screen p-4">
          <div className="max-w-7xl mx-auto h-[calc(100vh-2rem)]">{card}</div>
        </div>
      </div>,
      document.body,
    )
    : card;
};
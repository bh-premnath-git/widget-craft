import { createPortal } from 'react-dom';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WidgetHeader } from './WidgetHeader';
import { ChartView } from './ChartView';
import { TableView } from './TableView';
import { SqlViewer } from './SqlViewer';
import { ChartTypeViewer } from './ChartTypeViewer';
import { ColorSchemeViewer } from './ColorSchemeViewer';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/dashboardStore';
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

  if (!widget) return null;

  const { isFlipped, isMaximized } = widget;

  if (isLoading || isRefetching) {
    const loadingCard = (
      <Card className={`bg-widget-bg border-widget-border shadow-widget h-full ${className}`}>
        <WidgetHeader
          widgetId={widgetId}
          title={title}
          isFlipped={isFlipped}
          isMaximized={isMaximized}
          isRefreshing={isLoading || isRefetching}
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
      ? createPortal(
          <div className="fixed inset-0 z-50 bg-dashboard-bg p-4 overflow-auto">
            {loadingCard}
          </div>,
          document.body
        )
      : loadingCard;
  }

  if (!data) return null;

  const cardContent = (
    <Card className={`bg-widget-bg border-widget-border shadow-widget hover:shadow-widget-hover transition-smooth h-full overflow-hidden ${className}`}>
      <WidgetHeader
        widgetId={widgetId}
        title={title}
        isFlipped={isFlipped}
        isMaximized={isMaximized}
        isRefreshing={isLoading || isRefetching}
      />

      <div className="h-[calc(100%-64px)] relative overflow-hidden perspective-1000">
        {/* Flip Animation Container */}
        <div 
          className={`absolute inset-0 transition-all duration-600 ease-in-out ${isFlipped ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'}`}
          style={{ 
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Front Face - Chart */}
          <div 
            className="absolute inset-0"
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          >
            <div className="p-2 h-full">
              <ChartView
                data={data.plotlyData}
                layout={data.plotlyLayout}
                widgetId={widgetId}
              />
            </div>
          </div>
          
          {/* Back Face - Data Tabs */}
          <div 
            className="absolute inset-0"
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <Tabs defaultValue="table" className="h-full flex flex-col">
              <div className="px-2 pt-1">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="table" className="text-xs">Table View</TabsTrigger>
                  <TabsTrigger value="sql" className="text-xs">SQL Query</TabsTrigger>
                </TabsList>
              </div>
              <div className="flex-1 p-2 pt-1">
                <TabsContent value="table" className="h-full m-0">
                  <TableView
                    columns={data.tableData.columns}
                    rows={data.tableData.rows}
                  />
                </TabsContent>
                <TabsContent value="sql" className="h-full m-0">
                  <SqlViewer query={data.query} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </Card>
  );

  return isMaximized
    ? createPortal(
        <div className="fixed inset-0 z-50 bg-dashboard-bg overflow-auto">
          <div className="min-h-screen p-4">
            <div className="max-w-7xl mx-auto h-[calc(100vh-2rem)]">
              {cardContent}
            </div>
          </div>
        </div>,
        document.body
      )
    : cardContent;
};
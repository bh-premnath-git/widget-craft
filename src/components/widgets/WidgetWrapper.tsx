import { ReactNode, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WidgetHeader } from './WidgetHeader';
import { ChartView } from './ChartView';
import { TableView } from './TableView';
import { SqlViewer } from './SqlViewer';
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

  if (isLoading) {
    return (
      <Card className={`bg-widget-bg border-widget-border shadow-widget h-full ${className}`}>
        <WidgetHeader
          widgetId={widgetId}
          title={title}
          isFlipped={isFlipped}
          isMaximized={isMaximized}
          isRefreshing={isLoading || isRefetching}
        />
        <div className="p-4 h-full">
          <Skeleton className="w-full h-full" />
        </div>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card className={`bg-widget-bg border-widget-border shadow-widget hover:shadow-widget-hover transition-smooth h-full overflow-hidden ${className}`}>
      <WidgetHeader
        widgetId={widgetId}
        title={title}
        isFlipped={isFlipped}
        isMaximized={isMaximized}
        isRefreshing={isLoading || isRefetching}
      />
      
      <div className="h-[calc(100%-64px)] relative">
        {/* Flip Animation Container */}
        <div className={`absolute inset-0 transition-transform duration-600 ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front Face - Chart */}
          <div className={`absolute inset-0 backface-hidden ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
            <div className="p-4 h-full">
              <ChartView
                data={data.plotlyData}
                layout={data.plotlyLayout}
                widgetId={widgetId}
              />
            </div>
          </div>
          
          {/* Back Face - Data Tabs */}
          <div className={`absolute inset-0 backface-hidden rotate-y-180 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
            <Tabs defaultValue="table" className="h-full flex flex-col">
              <div className="px-4 pt-2">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="table" className="text-xs">Table View</TabsTrigger>
                  <TabsTrigger value="sql" className="text-xs">SQL Query</TabsTrigger>
                </TabsList>
              </div>
              <div className="flex-1 p-4 pt-2">
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
};
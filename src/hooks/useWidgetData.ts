import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/dashboardStore';

export interface WidgetData {
  plotlyData: any[];
  plotlyLayout?: any;
  tableData: {
    columns: string[];
    rows: any[][];
  };
  query: string;
}

// Sample data matching your dashboard image
const sampleData: Record<string, WidgetData> = {
  'chart-widget-1': {
    plotlyData: [
      {
        x: ['2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19', '2024-01-20', '2024-01-21'],
        y: [6, 4, 0, 0, 0, 0, 8],
        type: 'bar',
        name: 'Issues',
        marker: {
          color: ['#ef4444', '#ef4444', '#22c55e', '#22c55e', '#22c55e', '#22c55e', '#ef4444']
        }
      }
    ],
    plotlyLayout: {
      title: 'Recently Created Chart: bh-release1',
      xaxis: { title: 'Date' },
      yaxis: { title: 'Issues' },
      showlegend: false
    },
    tableData: {
      columns: ['Date', 'Issues', 'Status'],
      rows: [
        ['2024-01-15', '6', 'High'],
        ['2024-01-16', '4', 'Medium'],
        ['2024-01-17', '0', 'Low'],
        ['2024-01-18', '0', 'Low'],
        ['2024-01-19', '0', 'Low'],
        ['2024-01-20', '0', 'Low'],
        ['2024-01-21', '8', 'Critical']
      ]
    },
    query: 'SELECT date, COUNT(*) as issues FROM bh_release1 WHERE created_date >= CURRENT_DATE - 7 GROUP BY date'
  },
  'chart-widget-2': {
    plotlyData: [
      {
        values: [14, 8, 6, 4],
        labels: ['Open', 'In Progress', 'Resolved', 'Closed'],
        type: 'pie',
        marker: {
          colors: ['#3b82f6', '#f59e0b', '#10b981', '#6b7280']
        }
      }
    ],
    plotlyLayout: {
      title: 'Pie Chart: bh-release1'
    },
    tableData: {
      columns: ['Status', 'Count', 'Percentage'],
      rows: [
        ['Open', '14', '43.8%'],
        ['In Progress', '8', '25.0%'],
        ['Resolved', '6', '18.8%'],
        ['Closed', '4', '12.5%']
      ]
    },
    query: 'SELECT status, COUNT(*) as count FROM bh_release1 GROUP BY status'
  },
  'table-widget-1': {
    plotlyData: [
      {
        x: ['Anil Kumar Koduri', 'Dhanushpathi Prakash', 'Krishnan Angaluri', 'K SHASHIKIRAN REDDY', 'Muthukumar', 'premnath p', 'Rajesh Choudhary', 'rajni-bh', 'Sasikumar Gudavalli', 'SUKANT SANA'],
        y: [6, 13, 8, 1, 70, 27, 14, 1, 28, 3],
        type: 'bar',
        name: 'Total Issues'
      }
    ],
    plotlyLayout: {
      title: 'Issues by Assignee',
      xaxis: { title: 'Assignee' },
      yaxis: { title: 'Total Issues' }
    },
    tableData: {
      columns: ['Assignee', 'TO DO', 'IN PROGRESS', 'DONE', 'Total'],
      rows: [
        ['Anil Kumar Koduri', '4', '0', '2', '6'],
        ['Dhanushpathi Prakash', '3', '1', '9', '13'],
        ['Krishnan Angaluri', '2', '2', '4', '8'],
        ['K SHASHIKIRAN REDDY', '0', '0', '1', '1'],
        ['Muthukumar', '16', '3', '51', '70'],
        ['premnath p', '9', '1', '17', '27'],
        ['Rajesh Choudhary', '8', '0', '6', '14'],
        ['rajni-bh', '0', '0', '1', '1'],
        ['Sasikumar Gudavalli', '8', '3', '17', '28'],
        ['SUKANT SANA', '3', '0', '0', '3']
      ]
    },
    query: 'SELECT assignee, status, COUNT(*) FROM bh_release1 GROUP BY assignee, status'
  }
};

export const useWidgetData = (widgetId: string) => {
  const lastRefreshed = useSelector((state: RootState) => 
    state.dashboard.widgets[widgetId]?.lastRefreshed
  );

  return useQuery({
    queryKey: ['widget-data', widgetId, lastRefreshed],
    queryFn: async (): Promise<WidgetData> => {
      // Simulate real API loading time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const data = sampleData[widgetId];
      if (!data) {
        throw new Error(`No data found for widget ${widgetId}`);
      }
      
      return data;
    },
    staleTime: 0, // Always refetch when lastRefreshed changes
    refetchOnWindowFocus: false
  });
};
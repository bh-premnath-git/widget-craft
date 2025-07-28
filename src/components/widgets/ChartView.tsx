import Plot from 'react-plotly.js';
import { useEffect, useRef } from 'react';

interface ChartViewProps {
  data: any[];
  layout?: any;
  widgetId: string;
}

export const ChartView = ({ data, layout, widgetId }: ChartViewProps) => {
  const plotRef = useRef<any>(null);

  const defaultLayout = {
    margin: { t: 50, b: 50, l: 50, r: 20 },
    font: { family: 'Inter, sans-serif', size: 12 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    autosize: true,
    ...layout
  };

  useEffect(() => {
    // Force resize when component mounts or updates
    const timer = setTimeout(() => {
      if (plotRef.current) {
        window.dispatchEvent(new Event('resize'));
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full">
      <Plot
        ref={plotRef}
        data={data}
        layout={defaultLayout}
        config={{
          displayModeBar: false,
          responsive: true
        }}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
        className="w-full h-full"
      />
    </div>
  );
};
import Plot from 'react-plotly.js';

interface ChartViewProps {
  data: any[];
  layout?: any;
  widgetId: string;
}

export const ChartView = ({ data, layout, widgetId }: ChartViewProps) => {
  const defaultLayout = {
    margin: { t: 50, b: 50, l: 50, r: 20 },
    font: { family: 'Inter, sans-serif', size: 12 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    ...layout
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Plot
        data={data}
        layout={defaultLayout}
        config={{
          displayModeBar: false,
          responsive: true
        }}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
      />
    </div>
  );
};
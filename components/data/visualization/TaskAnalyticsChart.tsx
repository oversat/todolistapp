import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useTaskAnalytics } from '@/hooks/useTaskAnalytics';

export function TaskAnalyticsChart({ chibiId }: { chibiId: string }) {
  const { analytics, loading } = useTaskAnalytics(chibiId);

  if (loading || !analytics) return (
    <div className="font-vt323 text-[#33ff33] animate-pulse">
      LOADING DATA...
    </div>
  );

  const data = Object.entries(analytics.byDate).map(([date, count]) => ({
    date,
    completed: count
  }));

  const config = {
    completed: {
      label: 'Tasks Completed',
      theme: { light: '#33ff33', dark: '#33ff33' }
    }
  };

  return (
    <ChartContainer config={config}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#33ff33" opacity={0.3} />
        <XAxis 
          dataKey="date" 
          stroke="#33ff33"
          tick={{ fill: '#33ff33', fontFamily: 'VT323' }}
        />
        <YAxis 
          stroke="#33ff33"
          tick={{ fill: '#33ff33', fontFamily: 'VT323' }}
        />
        <ChartTooltip 
          content={<ChartTooltipContent />}
          cursor={{ fill: '#33ff33', opacity: 0.1 }}
        />
        <Bar
          dataKey="completed"
          fill="#33ff33"
          radius={[0, 0, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
} 
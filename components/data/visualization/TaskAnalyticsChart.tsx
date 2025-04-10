import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useTaskAnalytics } from '@/hooks/useTaskAnalytics';

export function TaskAnalyticsChart({ chibiId }: { chibiId: string }) {
  const { analytics, loading } = useTaskAnalytics(chibiId);

  if (loading || !analytics) return <div>Loading...</div>;

  const data = Object.entries(analytics.byDate).map(([date, count]) => ({
    date,
    completed: count
  }));

  const config = {
    completed: {
      label: 'Tasks Completed',
      theme: { light: '#FF9800', dark: '#FFB74D' }
    }
  };

  return (
    <ChartContainer config={config}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="completed"
          fill="var(--color-completed)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
} 
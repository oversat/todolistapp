import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useChibiStats } from '@/hooks/useChibiStats';

export function ChibiHealthChart({ chibiId }: { chibiId: string }) {
  const { stats, loading } = useChibiStats(chibiId);

  if (loading || !stats) return <div>Loading...</div>;

  const data = [
    {
      date: new Date(stats.last_fed).toLocaleDateString(),
      happiness: stats.happiness,
      energy: stats.energy
    }
  ];

  const config = {
    happiness: {
      label: 'Happiness',
      theme: { light: '#4CAF50', dark: '#81C784' }
    },
    energy: {
      label: 'Energy',
      theme: { light: '#2196F3', dark: '#64B5F6' }
    }
  };

  return (
    <ChartContainer config={config}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 100]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="happiness"
          stroke="var(--color-happiness)"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="energy"
          stroke="var(--color-energy)"
          strokeWidth={2}
        />
      </LineChart>
    </ChartContainer>
  );
} 
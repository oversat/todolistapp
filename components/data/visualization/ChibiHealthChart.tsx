import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useChibiStats } from '@/hooks/useChibiStats';

export function ChibiHealthChart({ chibiId }: { chibiId: string }) {
  const { stats, loading } = useChibiStats(chibiId);

  if (loading || !stats) return (
    <div className="font-vt323 text-[#33ff33] animate-pulse">
      LOADING DATA...
    </div>
  );

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
      theme: { light: '#33ff33', dark: '#33ff33' }
    },
    energy: {
      label: 'Energy',
      theme: { light: '#33ff33', dark: '#33ff33' }
    }
  };

  return (
    <ChartContainer config={config}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#33ff33" opacity={0.3} />
        <XAxis 
          dataKey="date" 
          stroke="#33ff33"
          tick={{ fill: '#33ff33', fontFamily: 'VT323' }}
        />
        <YAxis 
          domain={[0, 100]}
          stroke="#33ff33"
          tick={{ fill: '#33ff33', fontFamily: 'VT323' }}
        />
        <ChartTooltip 
          content={<ChartTooltipContent />}
          cursor={{ fill: '#33ff33', opacity: 0.1 }}
        />
        <Line
          type="monotone"
          dataKey="happiness"
          stroke="#33ff33"
          strokeWidth={2}
          dot={{ fill: '#33ff33', stroke: '#33ff33' }}
        />
        <Line
          type="monotone"
          dataKey="energy"
          stroke="#33ff33"
          strokeWidth={2}
          dot={{ fill: '#33ff33', stroke: '#33ff33' }}
        />
      </LineChart>
    </ChartContainer>
  );
} 
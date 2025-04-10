import { TaskAnalyticsChart } from './TaskAnalyticsChart';
import { ChibiHealthChart } from './ChibiHealthChart';

interface SleepZoneAnalyticsProps {
  chibiId: string;
}

export function SleepZoneAnalytics({ chibiId }: SleepZoneAnalyticsProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-[#ff6ad5]/80 to-[#c774e8]/80 p-4 rounded-lg backdrop-blur-sm border border-white/20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-[#ff6ad5]" />
          <h3 className="font-vt323 text-lg text-white">Task Completion Trend</h3>
        </div>
        <div className="h-[300px] bg-black/20 rounded-lg p-4">
          <TaskAnalyticsChart chibiId={chibiId} />
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#00c2ff]/80 to-[#6b7dff]/80 p-4 rounded-lg backdrop-blur-sm border border-white/20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-[#00c2ff]" />
          <h3 className="font-vt323 text-lg text-white">Chibi Health Trend</h3>
        </div>
        <div className="h-[300px] bg-black/20 rounded-lg p-4">
          <ChibiHealthChart chibiId={chibiId} />
        </div>
      </div>
    </div>
  );
} 
import { TaskAnalyticsChart } from './TaskAnalyticsChart';
import { ChibiHealthChart } from './ChibiHealthChart';
import { Task } from '@/components/task/Task';

interface SleepZoneAnalyticsProps {
  chibiId: string;
  completedTasks?: Array<{
    id: string;
    text: string;
    completed: boolean;
    notes?: string;
    due_date?: string;
  }>;
  onDeleteTask?: (id: string) => void;
  onNotesChange?: (id: string, notes: string) => void;
  onDueDateChange?: (id: string, date: string) => void;
}

export function SleepZoneAnalytics({ 
  chibiId, 
  completedTasks = [],
  onDeleteTask,
  onNotesChange,
  onDueDateChange
}: SleepZoneAnalyticsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#000080] p-4 rounded-none border-2 border-[#c0c0c0] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-none bg-[#ff6ad5] border border-[#c0c0c0]" />
            <h3 className="font-vt323 text-lg text-[#33ff33]">C:\TASK_COMPLETION_TREND.EXE</h3>
          </div>
          <div className="h-[200px] bg-[#000080] rounded-none border-2 border-[#c0c0c0] p-4">
            <TaskAnalyticsChart chibiId={chibiId} />
          </div>
        </div>

        <div className="bg-[#000080] p-4 rounded-none border-2 border-[#c0c0c0] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-none bg-[#00c2ff] border border-[#c0c0c0]" />
            <h3 className="font-vt323 text-lg text-[#33ff33]">C:\CHIBI_HEALTH_TREND.EXE</h3>
          </div>
          <div className="h-[200px] bg-[#000080] rounded-none border-2 border-[#c0c0c0] p-4">
            <ChibiHealthChart chibiId={chibiId} />
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="bg-[#000080] p-4 rounded-none border-2 border-[#c0c0c0] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-none bg-[#33ff33] border border-[#c0c0c0]" />
            <h3 className="font-vt323 text-lg text-[#33ff33]">C:\COMPLETED_TASKS.EXE</h3>
          </div>
          {completedTasks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {completedTasks.map((task, index) => (
                <div 
                  key={task.id}
                  className="relative"
                  style={{
                    transform: `translate(${index * 4}px, ${index * 4}px)`,
                    zIndex: completedTasks.length - index
                  }}
                >
                  <Task
                    {...task}
                    disabled
                    onDelete={() => onDeleteTask?.(task.id)}
                    onNotesChange={(notes) => onNotesChange?.(task.id, notes)}
                    onDueDateChange={(date) => onDueDateChange?.(task.id, date)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="font-vt323 text-[#33ff33]">NO COMPLETED TASKS FOUND</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
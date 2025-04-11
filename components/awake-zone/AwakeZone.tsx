import React, { useState } from 'react';
import { AwakeZoneHealth } from '@/components/data/visualization/AwakeZoneHealth';
import { TaskForm } from '@/components/task/TaskForm';

export function AwakeZone({ chibiId }: { chibiId: string }) {
  const [immediateUpdate, setImmediateUpdate] = useState<{
    deadlineHearts?: number;
    noteHearts?: number;
  }>();

  const handleImmediateUpdate = (update: {
    deadlineHearts?: number;
    noteHearts?: number;
  }) => {
    setImmediateUpdate(update);
  };

  return (
    <div className="space-y-4">
      <AwakeZoneHealth 
        chibiId={chibiId} 
        immediateUpdate={immediateUpdate}
      />
      <TaskForm 
        chibiId={chibiId} 
        onImmediateUpdate={handleImmediateUpdate}
      />
    </div>
  );
} 
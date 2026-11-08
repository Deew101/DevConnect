import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Task, TaskStatus } from '@/types/database.types';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  count: number;
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  tasks,
  count,
  onAddTask,
  onEditTask,
}) => {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: 'Column',
      status: id,
    },
  });

  const columnColors: Record<TaskStatus, { dot: string; border: string }> = {
    todo: { dot: 'bg-[#B8ACD9]', border: 'border-[rgba(167,139,250,0.20)]' },
    in_progress: { dot: 'bg-[#8B5CF6] shadow-[0_0_6px_#8B5CF6]', border: 'border-[#8B5CF6]/40' },
    review: { dot: 'bg-[#D946EF] shadow-[0_0_6px_#D946EF]', border: 'border-[#D946EF]/40' },
    done: { dot: 'bg-[#34D399] shadow-[0_0_6px_#34D399]', border: 'border-[#34D399]/40' },
  };

  const cConfig = columnColors[id] || columnColors.todo;

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col w-72 sm:w-80 flex-shrink-0 rounded-2xl border border-[rgba(167,139,250,0.20)] bg-[#160E30]/75 backdrop-blur-xl p-3.5 max-h-[calc(100vh-14rem)] min-h-[450px] shadow-xl"
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 px-1 border-b border-[rgba(167,139,250,0.20)]">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${cConfig.dot}`} />
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#F8F7FF]">{title}</h4>
          <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-[#100A24] border border-[rgba(167,139,250,0.20)] font-mono text-[10px] font-bold text-[#B8ACD9]">
            {count}
          </span>
        </div>

        <button
          onClick={() => onAddTask(id)}
          className="p-1 rounded-lg text-[#B8ACD9] hover:text-[#F8F7FF] hover:bg-[#8B5CF6]/20 transition-all"
          title={`Add task to ${title}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Column Tasks */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pt-3 pr-1">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="h-32 flex flex-col items-center justify-center border border-dashed border-[rgba(167,139,250,0.20)] rounded-xl text-center p-4 bg-[#100A24]/40">
            <p className="text-xs text-[#B8ACD9]">No tasks in this lane</p>
            <button
              onClick={() => onAddTask(id)}
              className="mt-2 text-[11px] text-[#A855F7] hover:text-[#D946EF] hover:underline font-mono transition-colors"
            >
              + Create task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

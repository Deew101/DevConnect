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
    todo: { dot: 'bg-slate-400', border: 'border-slate-800' },
    in_progress: { dot: 'bg-cyan-400', border: 'border-cyan-500/20' },
    review: { dot: 'bg-violet-400', border: 'border-violet-500/20' },
    done: { dot: 'bg-emerald-400', border: 'border-emerald-500/20' },
  };

  const cConfig = columnColors[id] || columnColors.todo;

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col w-72 sm:w-80 flex-shrink-0 rounded-2xl border border-slate-800/80 bg-[#090d16]/70 backdrop-blur-md p-3.5 max-h-[calc(100vh-14rem)] min-h-[450px]"
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${cConfig.dot}`} />
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200">{title}</h4>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 font-mono text-[10px] font-bold text-slate-400">
            {count}
          </span>
        </div>

        <button
          onClick={() => onAddTask(id)}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
          <div className="h-32 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl text-center p-4">
            <p className="text-xs text-slate-500">No tasks in this lane</p>
            <button
              onClick={() => onAddTask(id)}
              className="mt-2 text-[11px] text-cyan-400 hover:underline"
            >
              + Create a task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

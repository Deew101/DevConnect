import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, GripVertical } from 'lucide-react';
import { Task, TaskPriority } from '@/types/database.types';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const priorityStyles: Record<TaskPriority, { variant: 'default' | 'success' | 'warning' | 'destructive' | 'cyan'; label: string }> = {
    low: { variant: 'default', label: 'Low' },
    medium: { variant: 'cyan', label: 'Med' },
    high: { variant: 'warning', label: 'High' },
    urgent: { variant: 'destructive', label: 'Urgent' },
  };

  const pConfig = priorityStyles[task.priority] || priorityStyles.medium;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group rounded-xl border border-[#273249] bg-[#151F30] p-3.5 shadow-md hover:border-[#6D95FF]/45 hover:shadow-lg transition-all ${
        isDragging ? 'opacity-40 border-[#6D95FF] scale-95' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <Badge variant={pConfig.variant} className="text-[10px] uppercase font-mono px-1.5 py-0">
          {pConfig.label}
        </Badge>
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-[#929DB2] group-hover:text-[#F4F6FC] p-0.5 rounded hover:bg-[#1C2940]"
          title="Drag task"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>

      <h5
        onClick={() => onEdit(task)}
        className="font-display font-semibold text-xs text-[#F4F6FC] mt-2 mb-1.5 hover:text-[#6D95FF] cursor-pointer line-clamp-2 transition-colors"
      >
        {task.title}
      </h5>

      {task.description && (
        <p className="text-[11px] text-[#929DB2] line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {task.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] px-1.5 py-0.5 rounded bg-[#101725] text-[#929DB2] border border-[#273249] font-mono"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-[#273249] text-[11px] text-[#929DB2]">
        {task.due_date ? (
          <span className="flex items-center gap-1 font-mono text-[10px]">
            <Calendar className="h-3 w-3 text-[#929DB2]" />
            {formatDate(task.due_date)}
          </span>
        ) : (
          <span />
        )}

        {task.assignee && (
          <div className="flex items-center gap-1.5" title={`Assigned to ${task.assignee.full_name}`}>
            <span className="text-[10px] text-[#929DB2] font-mono hidden sm:inline">
              {task.assignee.full_name?.split(' ')[0]}
            </span>
            <Avatar src={task.assignee.avatar_url} name={task.assignee.full_name} size="xs" />
          </div>
        )}
      </div>
    </div>
  );
};

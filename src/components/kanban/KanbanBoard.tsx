import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Task, TaskStatus, ProjectMember } from '@/types/database.types';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { TaskDialog } from './TaskDialog';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import confetti from 'canvas-confetti';

interface KanbanBoardProps {
  projectId: string;
  initialTasks: Task[];
  members: ProjectMember[];
  onTasksUpdated?: () => void;
}

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  projectId,
  initialTasks,
  members,
  onTasksUpdated,
}) => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [targetColumn, setTargetColumn] = useState<TaskStatus>('todo');

  // Keep state synced with props
  React.useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';

    if (!isActiveTask) return;

    // Dropping a Task over another Task
    if (isActiveTask && isOverTask) {
      setTasks((prev) => {
        const activeIndex = prev.findIndex((t) => t.id === activeId);
        const overIndex = prev.findIndex((t) => t.id === overId);

        if (prev[activeIndex].status !== prev[overIndex].status) {
          const updated = [...prev];
          updated[activeIndex] = {
            ...updated[activeIndex],
            status: prev[overIndex].status,
          };
          return updated;
        }

        return prev;
      });
    }

    // Dropping a Task over a Column
    const isOverColumn = over.data.current?.type === 'Column';
    if (isActiveTask && isOverColumn) {
      setTasks((prev) => {
        const activeIndex = prev.findIndex((t) => t.id === activeId);
        const newStatus = over.id as TaskStatus;

        if (prev[activeIndex].status !== newStatus) {
          const updated = [...prev];
          updated[activeIndex] = {
            ...updated[activeIndex],
            status: newStatus,
          };
          return updated;
        }

        return prev;
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const currentTask = tasks.find((t) => t.id === activeId);
    if (!currentTask) return;

    // Check target status
    let targetStatus: TaskStatus = currentTask.status;
    if (over.data.current?.type === 'Column') {
      targetStatus = over.id as TaskStatus;
    } else if (over.data.current?.type === 'Task') {
      const overTask = tasks.find((t) => t.id === over.id);
      if (overTask) targetStatus = overTask.status;
    }

    // Trigger celebratory confetti if moved to 'done'
    if (targetStatus === 'done' && currentTask.status !== 'done') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }

    // Persist change to Supabase database
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: targetStatus })
        .eq('id', activeId);

      if (error) throw error;
      onTasksUpdated?.();
    } catch (err: any) {
      console.error('Failed to update task status in Supabase:', err);
      toast({
        title: 'Error updating task',
        description: err.message,
        type: 'error',
      });
      // Revert if error
      setTasks(initialTasks);
    }
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      if (selectedTask) {
        // Update existing task
        const { error } = await supabase
          .from('tasks')
          .update(taskData)
          .eq('id', selectedTask.id);

        if (error) throw error;
        toast({ title: 'Task updated', type: 'success' });
      } else {
        // Create new task
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('You must be signed in to create tasks');

        const { error } = await supabase.from('tasks').insert({
          ...taskData,
          project_id: projectId,
          creator_id: user.id,
          order_index: tasks.length,
        });

        if (error) throw error;
        toast({ title: 'Task created successfully', type: 'success' });
      }

      onTasksUpdated?.();
    } catch (err: any) {
      toast({
        title: 'Task action failed',
        description: err.message,
        type: 'error',
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) throw error;
      toast({ title: 'Task deleted', type: 'info' });
      onTasksUpdated?.();
    } catch (err: any) {
      toast({
        title: 'Failed to delete task',
        description: err.message,
        type: 'error',
      });
    }
  };

  const handleOpenAdd = (status: TaskStatus) => {
    setSelectedTask(null);
    setTargetColumn(status);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  return (
    <div className="relative">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-6">
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            return (
              <KanbanColumn
                key={col.id}
                id={col.id}
                title={col.title}
                tasks={colTasks}
                count={colTasks.length}
                onAddTask={handleOpenAdd}
                onEditTask={handleOpenEdit}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="rotate-2 scale-105 shadow-2xl">
              <TaskCard task={activeTask} onEdit={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        task={selectedTask}
        defaultStatus={targetColumn}
        members={members}
      />
    </div>
  );
};

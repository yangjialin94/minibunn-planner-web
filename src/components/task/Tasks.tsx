"use client";

import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

import { fetchTasksInRange } from "@/api/tasks";
import { updateTask } from "@/api/tasks";
import CreateTaskModal from "@/components/modals/CreateTaskModal";
import TaskCard from "@/components/task/TaskCard";
import TaskFilter from "@/components/task/TaskFilter";
import { useAuth } from "@/hooks/useAuth";
import { usePageStore } from "@/hooks/usePageStore";
import { Task } from "@/types/task";

function SortableItem({ id, task }: { id: number; task: Task }) {
  const isModalOpen = usePageStore((state) => state.isModalOpen);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    pointerEvents: isModalOpen ? "none" : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!isModalOpen ? { ...attributes, ...listeners } : {})}
      className="cursor-grab"
    >
      <TaskCard task={task} />
    </div>
  );
}

function Tasks({ dateStr }: { dateStr: string }) {
  const taskFilter = usePageStore((state) => state.taskFilter);

  const { user } = useAuth();
  const tokenReady = !!user;

  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks", dateStr],
    queryFn: () => fetchTasksInRange(dateStr, dateStr),
    enabled: tokenReady,
  });
  const [orderedTasks, setOrderedTasks] = useState<Task[]>([]);
  const queryClient = useQueryClient();

  // Handle the task order update
  const { mutate: mutateUpdateOrder, isPending: isUpdating } = useMutation({
    mutationFn: ({ taskId, order }: { taskId: number; order: number }) =>
      updateTask(taskId, { order: order }),
    onSuccess: () => {
      // Invalidate the tasks query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["tasks", dateStr] });
    },
    onError: (error) => {
      console.error("Error updating task order:", error);
    },
  });

  // Load tasks into state
  useEffect(() => {
    if (data) {
      setOrderedTasks(data);
    }
  }, [data]);

  // Update task order
  const handleDragEnd = (event: DragEndEvent) => {
    if (isUpdating) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedTasks.findIndex((item) => item.id === active.id);
    const newIndex = orderedTasks.findIndex((item) => item.id === over.id);
    const newOrder = arrayMove(orderedTasks, oldIndex, newIndex);
    setOrderedTasks(newOrder);

    // Update the order in the backend
    mutateUpdateOrder({ taskId: Number(active.id), order: newIndex + 1 });
  };

  // Handle loading and error states
  if (isLoading) return <div className="p-4">Loading tasks...</div>;
  if (error) {
    console.error(error);
    return <div className="p-4">Error loading tasks.</div>;
  }

  return (
    <>
      {/* filters and Progress */}
      <div className="flex flex-wrap-reverse items-center justify-between gap-4 p-4">
        <TaskFilter />
        {orderedTasks && (
          <p className="font-medium">
            Progress: {orderedTasks.filter((task) => task.is_completed).length}{" "}
            / {orderedTasks.length}
          </p>
        )}
      </div>

      {/* Task List */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={orderedTasks} strategy={rectSortingStrategy}>
          <div className="flex flex-wrap gap-4 p-4">
            {orderedTasks.map((task) => {
              if (taskFilter === "completed" && !task.is_completed) return null;
              if (taskFilter === "incomplete" && task.is_completed) return null;
              return <SortableItem key={task.id} id={task.id} task={task} />;
            })}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add Task Button */}
      <CreateTaskModal dateStr={dateStr} />
    </>
  );
}

export default Tasks;

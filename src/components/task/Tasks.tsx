"use client";

import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";

import { fetchTasksInRange } from "@/api/tasks";
import { updateTask } from "@/api/tasks";
import Error from "@/components/elements/Error";
import Loading from "@/components/elements/Loading";
import TaskHeader from "@/components/task/TaskHeader";
import TaskItem from "@/components/task/TaskItem";
import { useAuth } from "@/hooks/useAuth";
import { usePageStore } from "@/hooks/usePageStore";
import { Task } from "@/types/task";

/**
 * Sortable Item List for Tasks
 */
function Tasks({ dateStr }: { dateStr: string }) {
  // Refs
  const topRef = useRef<HTMLDivElement>(null);

  // Page store
  const taskFilter = usePageStore((state) => state.taskFilter);

  // Check user authentication
  const { user } = useAuth();
  const tokenReady = !!user;

  // Fetch tasks
  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks", dateStr],
    queryFn: () => fetchTasksInRange(dateStr, dateStr),
    enabled: tokenReady,
  });
  const [orderedTasks, setOrderedTasks] = useState<Task[]>([]);

  // Query client
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
  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    console.error(error);
    return <Error />;
  }

  return (
    <>
      {/* Header */}
      <TaskHeader tasks={orderedTasks} dateStr={dateStr} topRef={topRef} />

      {/* Task List */}
      <div className="overflow-y-auto pb-32">
        {/* Ref for the top */}
        <div ref={topRef} />

        {/* Tasks */}
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={orderedTasks}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col flex-wrap gap-4 p-4">
              {orderedTasks.map((task) => {
                if (taskFilter === "completed" && !task.is_completed)
                  return null;
                if (taskFilter === "incomplete" && task.is_completed)
                  return null;
                return <TaskItem key={task.id} id={task.id} task={task} />;
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
}

export default Tasks;

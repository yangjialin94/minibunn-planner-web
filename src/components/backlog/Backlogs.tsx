"use client";

import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

import { updateBacklog } from "@/api/backlogs";
import BacklogItem from "@/components/backlog/BacklogItem";
import { usePageStore } from "@/hooks/usePageStore";
import { Backlog } from "@/types/backlog";

interface BacklogsProps {
  data: Backlog[];
  topRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Sortable Item List for Backlogs
 */
function Backlogs({ data, topRef }: BacklogsProps) {
  // Ordered backlogs state
  const [orderedBacklogs, setOrderedBacklogs] = useState<Backlog[]>([]);

  // Page store
  const backlogsFilter = usePageStore((state) => state.backlogsFilter);
  const isDraggable = backlogsFilter.trim() === "" ? true : false;

  // Query client
  const queryClient = useQueryClient();

  // Handle the backlog order update
  const { mutate: mutateUpdateOrder, isPending: isUpdating } = useMutation({
    mutationFn: ({ backlogId, order }: { backlogId: number; order: number }) =>
      updateBacklog(backlogId, { order: order }),
    onSuccess: () => {
      // Invalidate the backlogs query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["backlogs"] });
    },
    onError: (error) => {
      console.error("Error updating backlog order:", error);
    },
  });

  // Handle the backlog order update
  useEffect(() => {
    if (data) {
      setOrderedBacklogs(data);
    }
  }, [data]);

  // Update backlog order
  const handleDragEnd = (event: DragEndEvent) => {
    if (isUpdating) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedBacklogs.findIndex((item) => item.id === active.id);
    const newIndex = orderedBacklogs.findIndex((item) => item.id === over.id);
    const newOrder = arrayMove(orderedBacklogs, oldIndex, newIndex);
    setOrderedBacklogs(newOrder);

    // Update the order in the backend
    mutateUpdateOrder({ backlogId: Number(active.id), order: newIndex + 1 });
  };

  return (
    <div className="overflow-y-auto">
      {/* Ref for the top */}
      <div ref={topRef} />

      {/* Backlogs */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={orderedBacklogs}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col flex-wrap gap-4 p-4">
            {orderedBacklogs.map((backlog) => {
              console.log(backlog);
              if (
                backlogsFilter &&
                !backlog.date
                  .toLowerCase()
                  .includes(backlogsFilter.toLowerCase()) &&
                !backlog.detail
                  .toLowerCase()
                  .includes(backlogsFilter.toLowerCase())
              ) {
                return null;
              }

              return (
                <BacklogItem
                  key={backlog.id}
                  id={backlog.id}
                  backlog={backlog}
                  isDraggable={isDraggable}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default Backlogs;

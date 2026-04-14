import { useState } from "react";
import type { VideoTask, KanbanColumn, Editor } from "@/lib/types";
import { COLUMNS } from "@/lib/types";
import { TaskCard } from "./TaskCard";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";

const columnColors: Record<KanbanColumn, string> = {
  queue: "bg-queue",
  production: "bg-production",
  review: "bg-review",
  approval: "bg-approval",
  done: "bg-done",
};

interface KanbanBoardProps {
  tasks: VideoTask[];
  onMove: (taskId: string, column: KanbanColumn, editor?: Editor) => void;
  onAssign: (taskId: string, editor: Editor) => void;
  onComment: (taskId: string, author: string, text: string) => void;
  onToggleChecklist: (taskId: string, checklistId: string) => void;
  onDelete: (taskId: string) => void;
}

function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`space-y-2 min-h-[120px] rounded-lg transition-colors ${isOver ? "bg-primary/10 ring-1 ring-primary/30" : ""}`}
    >
      {children}
    </div>
  );
}

export function KanbanBoard({ tasks, onMove, onAssign, onComment, onToggleChecklist, onDelete }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const targetColumn = over.id as KanbanColumn;
    const task = tasks.find((t) => t.id === taskId);

    if (task && task.column !== targetColumn) {
      onMove(taskId, targetColumn, task.editor ?? undefined);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-12rem)]">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.column === col.key);
          return (
            <div key={col.key} className="flex-shrink-0 w-72">
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className={`w-2.5 h-2.5 rounded-full ${columnColors[col.key]}`} />
                <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
                <span className="text-xs text-muted-foreground ml-auto bg-muted rounded-full px-2 py-0.5">
                  {colTasks.length}
                </span>
              </div>
              <DroppableColumn id={col.key}>
                {colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onMove={onMove}
                    onAssign={onAssign}
                    onComment={onComment}
                    onToggleChecklist={onToggleChecklist}
                    onDelete={onDelete}
                    isDragging={task.id === activeId}
                  />
                ))}
                {colTasks.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border p-6 text-center">
                    <p className="text-xs text-muted-foreground">Nenhum vídeo</p>
                  </div>
                )}
              </DroppableColumn>
            </div>
          );
        })}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="w-72 opacity-90 rotate-2">
            <TaskCard
              task={activeTask}
              onMove={onMove}
              onAssign={onAssign}
              onComment={onComment}
              onToggleChecklist={onToggleChecklist}
              onDelete={onDelete}
              isOverlay
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

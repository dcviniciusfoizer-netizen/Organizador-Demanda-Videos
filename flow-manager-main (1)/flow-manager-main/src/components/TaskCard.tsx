import { useState } from "react";
import type { VideoTask, KanbanColumn, Editor } from "@/lib/types";
import { COLUMNS } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MessageSquare, CheckSquare, Calendar, User, Send, Trash2, ArrowRight } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";

const priorityStyles: Record<string, string> = {
  high: "bg-destructive/20 text-destructive border-destructive/30",
  medium: "bg-accent/20 text-accent border-accent/30",
  low: "bg-muted text-muted-foreground border-border",
};

interface TaskCardProps {
  task: VideoTask;
  onMove: (taskId: string, column: KanbanColumn, editor?: Editor) => void;
  onAssign: (taskId: string, editor: Editor) => void;
  onComment: (taskId: string, author: string, text: string) => void;
  onToggleChecklist: (taskId: string, checklistId: string) => void;
  onDelete: (taskId: string) => void;
  isDragging?: boolean;
  isOverlay?: boolean;
}

export function TaskCard({ task, onMove, onAssign, onComment, onToggleChecklist, onDelete, isDragging, isOverlay }: TaskCardProps) {
  const [open, setOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const checkedCount = task.checklist.filter((c) => c.checked).length;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id });
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    onComment(task.id, "Gestor", commentText.trim());
    setCommentText("");
  };

  return (
    <>
      <div
        ref={isOverlay ? undefined : setNodeRef}
        style={style}
        {...(isOverlay ? {} : { ...attributes, ...listeners })}
        onClick={() => !isDragging && setOpen(true)}
        className={`w-full rounded-lg border border-border bg-card p-3 text-left transition-all hover:border-primary/40 hover:shadow-[0_0_15px_-5px_var(--primary)] cursor-grab group ${isDragging ? "opacity-30" : ""}`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-sm font-medium text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {task.title}
          </h4>
          <Badge className={`text-[10px] shrink-0 ${priorityStyles[task.priority]}`}>
            {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Média" : "Baixa"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-3">{task.client}</p>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            {task.editor && (
              <span className={`flex items-center gap-1 ${task.editor === "Editor 1" ? "text-editor1" : "text-editor2"}`}>
                <User className="w-3 h-3" />
                {task.editor}
              </span>
            )}
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {task.comments.length}
            </span>
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3" />
              {checkedCount}/{task.checklist.length}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(task.dueDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
          </span>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">{task.title}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {task.client} · {COLUMNS.find((c) => c.key === task.column)?.label}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Editor Assignment */}
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Responsável</h5>
              <div className="flex gap-2">
                {(["Editor 1", "Editor 2"] as Editor[]).map((e) => (
                  <Button
                    key={e}
                    variant={task.editor === e ? "default" : "outline"}
                    size="sm"
                    onClick={() => onAssign(task.id, e)}
                    className={task.editor === e ? (e === "Editor 1" ? "bg-editor1 text-foreground hover:bg-editor1/80" : "bg-editor2 text-foreground hover:bg-editor2/80") : ""}
                  >
                    <User className="w-3 h-3 mr-1" />
                    {e}
                  </Button>
                ))}
              </div>
            </div>

            {/* Move to any column */}
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Mover para</h5>
              <div className="flex flex-wrap gap-2">
                {COLUMNS.filter((c) => c.key !== task.column).map((col) => (
                  <Button
                    key={col.key}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onMove(task.id, col.key, task.editor ?? undefined);
                      setOpen(false);
                    }}
                  >
                    <ArrowRight className="w-3 h-3 mr-1" />
                    {col.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-xs text-muted-foreground">Prioridade</span>
                <Badge className={`mt-1 block w-fit ${priorityStyles[task.priority]}`}>
                  {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Média" : "Baixa"}
                </Badge>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Prazo</span>
                <p className="text-sm text-foreground mt-1">
                  {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Criado em</span>
                <p className="text-sm text-foreground mt-1">
                  {new Date(task.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>

            {/* Checklist */}
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Checklist de Entrega ({checkedCount}/{task.checklist.length})
              </h5>
              <div className="space-y-1">
                {task.checklist.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => onToggleChecklist(task.id, item.id)}
                      className="rounded border-border accent-primary w-4 h-4"
                    />
                    <span className={`text-sm ${item.checked ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${(checkedCount / task.checklist.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Comments */}
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Comentários & Revisões
              </h5>
              <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                {task.comments.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">Nenhum comentário ainda.</p>
                )}
                {task.comments.map((c) => (
                  <div key={c.id} className="rounded-md bg-muted/50 p-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-foreground">{c.author}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(c.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/80">{c.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                  placeholder="Escreva um comentário..."
                  className="flex-1 rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button size="sm" onClick={handleAddComment} disabled={!commentText.trim()}>
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Delete */}
            <div className="pt-2 border-t border-border">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onDelete(task.id);
                  setOpen(false);
                }}
                className="w-full"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Excluir Tarefa
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

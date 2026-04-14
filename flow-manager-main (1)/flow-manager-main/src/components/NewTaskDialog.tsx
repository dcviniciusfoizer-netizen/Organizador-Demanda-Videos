import { useState } from "react";
import type { Editor, VideoTask } from "@/lib/types";
import { CLIENTS } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface NewTaskDialogProps {
  onAdd: (task: Omit<VideoTask, "id" | "createdAt" | "comments" | "checklist">) => void;
}

export function NewTaskDialog({ onAdd }: NewTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [client, setClient] = useState<string>(CLIENTS[0]);
  const [editor, setEditor] = useState<Editor | "">("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !dueDate) return;
    onAdd({
      title: title.trim(),
      client,
      editor: editor || null,
      column: editor ? "production" : "queue",
      priority,
      dueDate,
    });
    setTitle("");
    setClient(CLIENTS[0]);
    setEditor("");
    setPriority("medium");
    setDueDate("");
    setOpen(false);
  };

  const inputClass = "w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";
  const labelClass = "text-xs font-medium text-muted-foreground uppercase tracking-wider";

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus className="w-4 h-4 mr-1" />
        Novo Vídeo
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Novo Vídeo</DialogTitle>
            <DialogDescription className="text-muted-foreground">Adicione um novo vídeo ao fluxo de produção.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className={labelClass}>Título</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Reels Black Friday" className={`mt-1 ${inputClass}`} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Cliente</label>
                <select value={client} onChange={(e) => setClient(e.target.value)} className={`mt-1 ${inputClass}`}>
                  {CLIENTS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Editor</label>
                <select value={editor} onChange={(e) => setEditor(e.target.value as Editor | "")} className={`mt-1 ${inputClass}`}>
                  <option value="">Não atribuído</option>
                  <option value="Editor 1">Editor 1</option>
                  <option value="Editor 2">Editor 2</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Prioridade</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")} className={`mt-1 ${inputClass}`}>
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Prazo</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={`mt-1 ${inputClass}`} />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!title.trim() || !dueDate}>Criar Vídeo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useVideoStore } from "@/lib/store";

import { KanbanBoard } from "@/components/KanbanBoard";
import { NewTaskDialog } from "@/components/NewTaskDialog";
import { WorkloadBar } from "@/components/WorkloadBar";
import { Film, Filter, X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "VideoFlow — Gestão de Vídeos" },
      { name: "description", content: "Sistema de gestão de vídeos para agências com Kanban, atribuição de editores e controle de produção." },
    ],
  }),
});

function Dashboard() {
  const { tasks, addTask, moveTask, assignEditor, addComment, toggleChecklist, deleteTask } = useVideoStore();
  const [clientTabs, setClientTabs] = useState<string[]>(["Todos"]);
  const [activeTab, setActiveTab] = useState("Todos");
  const [filterEditor, setFilterEditor] = useState<string>("");
  const [newTabOpen, setNewTabOpen] = useState(false);
  const [newTabName, setNewTabName] = useState("");

  const filteredTasks = tasks.filter((t) => {
    if (activeTab !== "Todos" && t.client !== activeTab) return false;
    if (filterEditor && t.editor !== filterEditor) return false;
    return true;
  });

  const handleAddTab = () => {
    const name = newTabName.trim();
    if (!name || clientTabs.includes(name)) return;
    setClientTabs((prev) => [...prev, name]);
    setActiveTab(name);
    setNewTabName("");
    setNewTabOpen(false);
  };

  const handleRemoveTab = (tab: string) => {
    if (tab === "Todos") return;
    setClientTabs((prev) => prev.filter((t) => t !== tab));
    if (activeTab === tab) setActiveTab("Todos");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Film className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-base font-bold text-foreground tracking-tight">VideoFlow</h1>
                <p className="text-[11px] text-muted-foreground">Gestão de Produção</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <WorkloadBar tasks={tasks} />
              <NewTaskDialog onAdd={addTask} />
            </div>
          </div>
        </div>
      </header>

      {/* Client Tabs */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-3">
        <div className="flex items-center gap-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="h-auto flex-wrap gap-1 bg-transparent p-0">
              {clientTabs.map((tab) => (
                <div key={tab} className="relative group">
                  <TabsTrigger
                    value={tab}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-1.5 text-xs"
                  >
                    {tab}
                  </TabsTrigger>
                  {tab !== "Todos" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTab(tab);
                      }}
                      className="absolute -top-1 -right-1 hidden group-hover:flex w-4 h-4 rounded-full bg-destructive text-destructive-foreground items-center justify-center text-[10px]"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" onClick={() => setNewTabOpen(true)} className="text-xs shrink-0">
            <Plus className="w-3 h-3 mr-1" />
            Nova Aba
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filterEditor}
            onChange={(e) => setFilterEditor(e.target.value)}
            className="rounded-md border border-border bg-input px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Todos os Editores</option>
            <option value="Editor 1">Editor 1</option>
            <option value="Editor 2">Editor 2</option>
          </select>
          {filterEditor && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterEditor("")}
              className="text-xs text-muted-foreground"
            >
              <X className="w-3 h-3 mr-1" />
              Limpar
            </Button>
          )}
          <span className="text-xs text-muted-foreground ml-auto">
            {filteredTasks.length} vídeo{filteredTasks.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Board */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 pb-8">
        <KanbanBoard
          tasks={filteredTasks}
          onMove={moveTask}
          onAssign={assignEditor}
          onComment={addComment}
          onToggleChecklist={toggleChecklist}
          onDelete={deleteTask}
        />
      </div>

      {/* New Tab Dialog */}
      <Dialog open={newTabOpen} onOpenChange={setNewTabOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Nova Aba de Cliente</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Crie uma aba para filtrar o kanban por cliente.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <input
              type="text"
              value={newTabName}
              onChange={(e) => setNewTabName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTab()}
              placeholder="Nome do cliente (ex: Cliente A)"
              className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setNewTabOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddTab} disabled={!newTabName.trim()}>Criar Aba</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

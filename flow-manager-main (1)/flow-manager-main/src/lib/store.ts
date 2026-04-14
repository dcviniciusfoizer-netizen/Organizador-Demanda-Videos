import { useState, useCallback } from "react";
import type { VideoTask, KanbanColumn, Editor, Comment } from "./types";
import { DEFAULT_CHECKLIST } from "./types";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

const INITIAL_TASKS: VideoTask[] = [
  {
    id: "1",
    title: "Reels Lançamento Produto X",
    client: "Cliente A",
    editor: "Editor 1",
    column: "production",
    priority: "high",
    dueDate: "2026-04-18",
    comments: [
      { id: "c1", author: "Gestor", text: "Usar a paleta de cores do novo branding do cliente.", createdAt: "2026-04-12T10:00:00" },
      { id: "c2", author: "Editor 1", text: "Entendido! Vou aplicar nos primeiros 5s.", createdAt: "2026-04-12T11:30:00" },
    ],
    checklist: DEFAULT_CHECKLIST.map((c, i) => ({ ...c, id: `ch1-${i}` })),
    createdAt: "2026-04-10T09:00:00",
  },
  {
    id: "2",
    title: "Vídeo Institucional 2026",
    client: "Cliente B",
    editor: "Editor 2",
    column: "review",
    priority: "medium",
    dueDate: "2026-04-20",
    comments: [
      { id: "c3", author: "Gestor", text: "O cliente pediu para trocar a música de fundo.", createdAt: "2026-04-13T14:00:00" },
    ],
    checklist: DEFAULT_CHECKLIST.map((c, i) => ({ ...c, id: `ch2-${i}`, checked: i < 3 })),
    createdAt: "2026-04-08T09:00:00",
  },
  {
    id: "3",
    title: "Tutorial Feature Y",
    client: "Cliente C",
    editor: null,
    column: "queue",
    priority: "low",
    dueDate: "2026-04-25",
    comments: [],
    checklist: DEFAULT_CHECKLIST.map((c, i) => ({ ...c, id: `ch3-${i}` })),
    createdAt: "2026-04-14T09:00:00",
  },
];

export function useVideoStore() {
  const [tasks, setTasks] = useState<VideoTask[]>(INITIAL_TASKS);

  const addTask = useCallback((task: Omit<VideoTask, "id" | "createdAt" | "comments" | "checklist">) => {
    setTasks((prev) => [
      ...prev,
      {
        ...task,
        id: generateId(),
        createdAt: new Date().toISOString(),
        comments: [],
        checklist: DEFAULT_CHECKLIST.map((c, i) => ({ ...c, id: `ch-${generateId()}-${i}` })),
      },
    ]);
  }, []);

  const moveTask = useCallback((taskId: string, newColumn: KanbanColumn, editor?: Editor) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updates: Partial<VideoTask> = { column: newColumn };
        if (newColumn === "production" && editor) {
          updates.editor = editor;
        }
        return { ...t, ...updates };
      })
    );
  }, []);

  const assignEditor = useCallback((taskId: string, editor: Editor) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, editor } : t))
    );
  }, []);

  const addComment = useCallback((taskId: string, author: string, text: string) => {
    const comment: Comment = {
      id: generateId(),
      author,
      text,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, comments: [...t.comments, comment] } : t
      )
    );
  }, []);

  const toggleChecklist = useCallback((taskId: string, checklistId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              checklist: t.checklist.map((c) =>
                c.id === checklistId ? { ...c, checked: !c.checked } : c
              ),
            }
          : t
      )
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  return { tasks, addTask, moveTask, assignEditor, addComment, toggleChecklist, deleteTask };
}

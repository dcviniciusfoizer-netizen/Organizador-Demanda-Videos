export type Editor = "Editor 1" | "Editor 2";
export type KanbanColumn = "queue" | "production" | "review" | "approval" | "done";

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface VideoTask {
  id: string;
  title: string;
  client: string;
  editor: Editor | null;
  column: KanbanColumn;
  priority: "low" | "medium" | "high";
  dueDate: string;
  comments: Comment[];
  checklist: ChecklistItem[];
  createdAt: string;
}

export const CLIENTS = [
  "Cliente A", "Cliente B", "Cliente C", "Cliente D", "Cliente E",
  "Cliente F", "Cliente G", "Cliente H", "Cliente I", "Cliente J",
] as const;

export const COLUMNS: { key: KanbanColumn; label: string }[] = [
  { key: "queue", label: "Fila de Edição" },
  { key: "production", label: "Em Produção" },
  { key: "review", label: "Revisão Interna" },
  { key: "approval", label: "Aprovação do Cliente" },
  { key: "done", label: "Concluído" },
];

export const DEFAULT_CHECKLIST: Omit<ChecklistItem, "id">[] = [
  { label: "Exportação em 4K", checked: false },
  { label: "Legendas revisadas", checked: false },
  { label: "Cores corrigidas", checked: false },
  { label: "Áudio normalizado", checked: false },
  { label: "Link do Drive testado", checked: false },
  { label: "Thumbnail aprovada", checked: false },
];

import type { VideoTask } from "@/lib/types";
import { User } from "lucide-react";

interface WorkloadBarProps {
  tasks: VideoTask[];
}

export function WorkloadBar({ tasks }: WorkloadBarProps) {
  const activeTasks = tasks.filter((t) => t.column !== "done");
  const editor1 = activeTasks.filter((t) => t.editor === "Editor 1");
  const editor2 = activeTasks.filter((t) => t.editor === "Editor 2");
  const unassigned = activeTasks.filter((t) => !t.editor);

  return (
    <div className="flex items-center gap-6 text-xs">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-editor1">
          <User className="w-3.5 h-3.5" />
          <span className="font-medium">Editor 1</span>
        </div>
        <span className="bg-editor1/20 text-editor1 rounded-full px-2 py-0.5 font-semibold">{editor1.length}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-editor2">
          <User className="w-3.5 h-3.5" />
          <span className="font-medium">Editor 2</span>
        </div>
        <span className="bg-editor2/20 text-editor2 rounded-full px-2 py-0.5 font-semibold">{editor2.length}</span>
      </div>
      {unassigned.length > 0 && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="font-medium">Sem editor</span>
          <span className="bg-muted rounded-full px-2 py-0.5 font-semibold">{unassigned.length}</span>
        </div>
      )}
    </div>
  );
}

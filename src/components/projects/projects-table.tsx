import { ProjectRow } from "./project-row";
import type { Project } from "../../lib/types";

export function ProjectsTable({ projects }: { projects: Project[] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr className="border-b border-border bg-surface-muted text-left text-xs font-medium text-text-muted">
            <th className="px-3 py-2.5 font-medium">Projects</th>
            <th className="px-3 py-2.5 font-medium">Priority</th>
            <th className="px-3 py-2.5 font-medium">Lead</th>
            <th className="px-3 py-2.5 font-medium">Due Date</th>
            <th className="w-10 px-2 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { Avatar } from "../ui/avatar";
import { DateChip } from "../ui/date-chip";
import { PriorityBadge } from "../ui/priority-badge";
import { OverflowMenu } from "../ui/overflow-menu";
import { useDeleteProject } from "../../hooks/useProjects";
import { routes } from "../../lib/routeBuilder";
import type { Project } from "../../lib/types";

export function ProjectRow({ project }: { project: Project }) {
  const router = useRouter();
  const deleteProject = useDeleteProject();

  return (
    <tr
      onClick={() => router.push(routes.projectDetail(project.id))}
      className="cursor-pointer border-b border-border text-sm last:border-b-0 hover:bg-surface-muted"
    >
      <td className="px-3 py-2 text-text">
        <span className="line-clamp-1">{project.name}</span>
      </td>
      <td className="px-3 py-2">
        <PriorityBadge priority={project.priority} />
      </td>
      <td className="px-3 py-2">
        {project.lead ? (
          <div className="flex items-center gap-1.5">
            <Avatar name={project.lead.name} size="xs" />
            <span className="truncate text-text-muted">{project.lead.name}</span>
          </div>
        ) : (
          <span className="text-text-subtle">Unassigned</span>
        )}
      </td>
      <td className="px-3 py-2">
        <DateChip date={project.dueDate} />
      </td>
      <td className="w-10 px-2 py-2 text-right" onClick={(e) => e.stopPropagation()}>
        <OverflowMenu
          label={`Actions for ${project.name}`}
          onEdit={() => router.push(routes.projectDetail(project.id))}
          onDelete={() => deleteProject.mutate(project.id)}
        />
      </td>
    </tr>
  );
}

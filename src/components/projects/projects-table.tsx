"use client";

import { useRouter } from "next/navigation";
import { Avatar } from "../ui/avatar";
import { DateChip } from "../ui/date-chip";
import { OverflowMenu } from "../ui/overflow-menu";
import { PriorityBadge } from "../ui/priority-badge";
import { useMediaQuery, BREAKPOINTS } from "../../hooks/useMediaQuery";
import { useDeleteProject } from "../../hooks/useProjects";
import { routes } from "../../lib/routeBuilder";
import type { Project } from "../../lib/types";

/**
 * Projects table — dense bordered table on ≥700px, stacked cards below
 * (design_break_down.md §14). Always keep the name visible first.
 */
export function ProjectsTable({ projects }: { projects: Project[] }) {
  const isMobile = useMediaQuery(BREAKPOINTS.mobile);

  if (isMobile) {
    return (
      <div className="flex flex-col gap-1.5">
        {projects.map((project) => (
          <ProjectMobileCard key={project.id} project={project} />
        ))}
      </div>
    );
  }

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
            <ProjectDesktopRow key={project.id} project={project} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProjectDesktopRow({ project }: { project: Project }) {
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

function ProjectMobileCard({ project }: { project: Project }) {
  const router = useRouter();
  const deleteProject = useDeleteProject();

  return (
    <div
      onClick={() => router.push(routes.projectDetail(project.id))}
      className="cursor-pointer rounded-md border border-border bg-surface px-3 py-2.5"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="line-clamp-2 text-sm font-medium text-text">{project.name}</p>
          {project.lead && (
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-text-muted">
              <Avatar name={project.lead.name} size="xs" />
              {project.lead.name}
            </p>
          )}
        </div>
        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
          <OverflowMenu
            label={`Actions for ${project.name}`}
            onEdit={() => router.push(routes.projectDetail(project.id))}
            onDelete={() => deleteProject.mutate(project.id)}
          />
        </div>
      </div>
      <div className="mt-2 flex items-center gap-3 text-xs text-text-muted">
        <PriorityBadge priority={project.priority} />
        <DateChip date={project.dueDate} short />
      </div>
    </div>
  );
}

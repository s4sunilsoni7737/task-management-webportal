"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search as SearchIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { EmptyState } from "@/components/ui/empty-state";
import { QueryErrorCard } from "@/components/ui/query-error-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { Avatar } from "@/components/ui/avatar";
import { DateChip, PriorityBadge } from "@/components/ui/badge";
import { OverflowMenu } from "@/components/ui/menu";
import { useMediaQuery, BREAKPOINTS } from "@/hooks/useMediaQuery";
import { useCreateProject, useDeleteProject, useProjects } from "@/hooks/useProjects";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { routes } from "@/lib/routeBuilder";
import { PROJECT_PRIORITIES, type Project, type ProjectPriority } from "@/lib/types";

/**
 * Projects table — dense bordered table on ≥700px, stacked cards below
 * (design_break_down.md §14). Always keep the name visible first.
 */
function ProjectsTable({ projects }: { projects: Project[] }) {
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

/** Mobile-optimized project card — name first, then identity + meta row. */
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
export default function ProjectsPage() {
  const createProject = useCreateProject();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [priority, setPriority] = useState<ProjectPriority>("medium");

  const debouncedSearch = useDebouncedValue(search, 350);

  const { data, isLoading, isError, error, refetch } = useProjects({
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Reset to page 1 whenever search or page-size changes.
  function changeSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleAddProject() {
    const trimmed = name.trim();
    if (!trimmed) return;
    createProject.mutate(
      { name: trimmed, priority },
      {
        onSuccess: () => {
          setModalOpen(false);
          setName("");
          setPriority("medium");
        },
      },
    );
  }

  return (
    <>
      <div className="mb-5 flex min-h-8 flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-bold text-text">Projects</h1>
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput value={search} onChange={changeSearch} placeholder="Search projects..." />
          <Button variant="accent" size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            Add Project
          </Button>
        </div>
      </div>

      {isLoading ? (
          <div>
            <Skeleton className="h-48 rounded-md" />
          </div>
        ) : isError ? (
          <QueryErrorCard error={error} onRetry={() => refetch()} />
        ) : data && data.items.length === 0 ? (
          <EmptyState
            icon={SearchIcon}
            title="No projects found"
            description="Try a different search, or create a new project."
          />
        ) : (
          <>
            <ProjectsTable projects={data?.items ?? []} />
            <Pagination
              page={data?.page ?? page}
              pageSize={data?.pageSize ?? pageSize}
              total={data?.total ?? 0}
              totalPages={data?.totalPages ?? 1}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </>
        )}

      {modalOpen && (
        <div
          className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/30 p-4 animate-fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-[380px] rounded-md border border-border bg-surface p-4 shadow-popover"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text">New Project</h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setModalOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-sm text-text-subtle hover:bg-surface-muted hover:text-text"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <label className="mb-1 block text-xs font-medium text-text-subtle">Name</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddProject();
              }}
              placeholder="Project name"
              className="mb-3 h-9 w-full rounded-sm border border-border bg-surface px-2.5 text-sm text-text outline-none placeholder:text-text-subtle focus:border-accent"
            />

            <label className="mb-1 block text-xs font-medium text-text-subtle">Priority</label>
            <div className="mb-4 flex gap-1.5">
              {PROJECT_PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`h-8 flex-1 rounded-sm border text-sm capitalize transition-colors ${
                    priority === p
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-border bg-surface text-text-muted hover:bg-surface-muted"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="accent"
                size="sm"
                onClick={handleAddProject}
                disabled={!name.trim() || createProject.isPending}
              >
                {createProject.isPending ? "Creatingâ€¦" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
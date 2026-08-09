"use client";

import { useState } from "react";
import { Plus, Search as SearchIcon, X } from "lucide-react";
import { TopBar } from "../../../components/shell/top-bar";
import { PageHeader } from "../../../components/shell/page-header";
import { ProjectsTable } from "../../../components/projects/projects-table";
import { Button } from "../../../components/ui/button";
import { SearchInput } from "../../../components/ui/search-input";
import { EmptyState } from "../../../components/ui/empty-state";
import { QueryErrorCard } from "../../../components/ui/query-error-card";
import { Skeleton } from "../../../components/ui/skeleton";
import { Pagination } from "../../../components/ui/pagination";
import { useProjects, useCreateProject } from "../../../hooks/useProjects";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { PROJECT_PRIORITIES, type ProjectPriority } from "../../../lib/types";

/**
 * Projects list — fully server-driven: `search` (debounced), `page`,
 * `pageSize`, `sortBy`/`sortOrder` go straight to `GET /projects`, and the
 * compact Pagination footer drives page navigation. No more `limit:1000`.
 */
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
      <TopBar />
      <main className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-6">
        <PageHeader
          title="Projects"
          toolbar={
            <>
              <SearchInput value={search} onChange={changeSearch} placeholder="Search projects..." />
              <Button variant="black" size="sm" onClick={() => setModalOpen(true)}>
                <Plus className="h-3.5 w-3.5" />
                Add Project
              </Button>
            </>
          }
        />

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
      </main>

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
                variant="black"
                size="sm"
                onClick={handleAddProject}
                disabled={!name.trim() || createProject.isPending}
              >
                {createProject.isPending ? "Creating…" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
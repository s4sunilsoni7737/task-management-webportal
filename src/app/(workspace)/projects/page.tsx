"use client";

import { useMemo, useState } from "react";
import { Plus, Search as SearchIcon } from "lucide-react";
import { TopBar } from "../../../components/shell/top-bar";
import { PageHeader } from "../../../components/shell/page-header";
import { ProjectsTable } from "../../../components/projects/projects-table";
import { Button } from "../../../components/ui/button";
import { SearchInput } from "../../../components/ui/search-input";
import { EmptyState } from "../../../components/ui/empty-state";
import { useProjects, useCreateProject } from "../../../hooks/useProjects";

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useProjects();
  const createProject = useCreateProject();
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [projects, search],
  );

  function handleAddProject() {
    createProject.mutate({ name: "New project", priority: "medium" });
  }

  return (
    <>
      <TopBar />
      <main className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-6">
        <PageHeader
          title="Projects"
          toolbar={
            <>
              <SearchInput value={search} onChange={setSearch} placeholder="Search projects..." />
              <Button variant="black" size="sm" onClick={handleAddProject}>
                <Plus className="h-3.5 w-3.5" />
                Add Project
              </Button>
            </>
          }
        />

        {isLoading ? (
          <div className="h-48 animate-pulse rounded-md bg-surface-muted" />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={SearchIcon}
            title="No projects found"
            description="Try a different search, or create a new project."
          />
        ) : (
          <ProjectsTable projects={filtered} />
        )}
      </main>
    </>
  );
}

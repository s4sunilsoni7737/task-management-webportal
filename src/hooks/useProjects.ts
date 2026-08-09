import { useQuery } from "@tanstack/react-query";
import { projectsService } from "../services/projects/projects.service";
import { useApiMutation } from "./useApiMutation";
import type { CreateProjectInput, ProjectQueryParams, UpdateProjectInput } from "../lib/types";

export function useProjects(params: ProjectQueryParams = {}) {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => projectsService.getAll(params),
  });
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => projectsService.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateProject() {
  return useApiMutation({
    mutationFn: (input: CreateProjectInput) => projectsService.create(input),
    successMessage: "Project created",
    errorMessage: "Couldn't create project",
    invalidateQueries: [["projects"]],
  });
}

export function useUpdateProject(projectId: string) {
  return useApiMutation({
    mutationFn: (input: UpdateProjectInput) => projectsService.update(projectId, input),
    errorMessage: "Couldn't update project",
    invalidateQueries: [["projects"], ["projects", projectId]],
  });
}

export function useDeleteProject() {
  return useApiMutation({
    mutationFn: (id: string) => projectsService.remove(id),
    successMessage: "Project deleted",
    errorMessage: "Couldn't delete project",
    invalidateQueries: [["projects"]],
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { workspacesService } from "@/services/workspaces/workspaces.service";

export function useWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: () => workspacesService.getAll(),
  });
}

export function useWorkspace(id: string | undefined) {
  return useQuery({
    queryKey: ["workspaces", id],
    queryFn: () => workspacesService.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateWorkspace() {
  return useMutation({
    mutationFn: (input: { name: string; avatarUrl?: File | string | null }) => workspacesService.create(input),
  });
}

export function useUpdateWorkspace(workspaceId: string) {
  return useMutation({
    mutationFn: (input: { name?: string; avatarUrl?: File | string | null }) => workspacesService.update(workspaceId, input),
  });
}

import { useQuery } from "@tanstack/react-query";
import { workspacesService } from "../services/workspaces/workspaces.service";

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

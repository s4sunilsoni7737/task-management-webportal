import { useQuery, useQueryClient } from "@tanstack/react-query";
import { tasksService } from "@/services/tasks/tasks.service";
import { useApiMutation } from "@/hooks/useApiMutation";

export function useComments(taskId: string | undefined) {
  return useQuery({
    queryKey: ["tasks", taskId, "comments"],
    queryFn: () => tasksService.getComments(taskId as string),
    enabled: Boolean(taskId),
    refetchInterval: 5000,
  });
}

export function useActivity(taskId: string | undefined) {
  return useQuery({
    queryKey: ["tasks", taskId, "activity"],
    queryFn: () => tasksService.getActivity(taskId as string),
    enabled: Boolean(taskId),
  });
}

export function useAddComment(taskId: string) {
  const queryClient = useQueryClient();
  return useApiMutation({
    mutationFn: (input: { body: string; file?: File }) => tasksService.addComment(taskId, input),
    errorMessage: "Couldn't post comment",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });
    },
  });
}

export function useUpdateComment(taskId: string, commentId: string) {
  const queryClient = useQueryClient();
  return useApiMutation({
    mutationFn: (body: string) => tasksService.updateComment(taskId, commentId, body),
    successMessage: "Comment updated",
    errorMessage: "Couldn't update comment",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId, "comments"] });
    },
  });
}

export function useDeleteComment(taskId: string, commentId: string) {
  const queryClient = useQueryClient();
  return useApiMutation({
    mutationFn: () => tasksService.removeComment(taskId, commentId),
    successMessage: "Comment deleted",
    errorMessage: "Couldn't delete comment",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId, "comments"] });
    },
  });
}

export function useAddSubtask(taskId: string) {
  const queryClient = useQueryClient();
  return useApiMutation({
    mutationFn: (title: string) => tasksService.addSubtask(taskId, { title }),
    errorMessage: "Couldn't add subtask",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId, "subtasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });
    },
  });
}

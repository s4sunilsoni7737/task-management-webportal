import { useQuery } from "@tanstack/react-query";
import { tasksService } from "../services/tasks/tasks.service";
import { useApiMutation } from "./useApiMutation";
import type { CreateTaskInput, TaskQueryParams, UpdateTaskInput } from "../lib/types";

export function useTasks(params: TaskQueryParams = {}) {
  return useQuery({
    queryKey: ["tasks", "list", params],
    queryFn: () => tasksService.getAll(params),
  });
}

/** Grouped-by-status query — powering both the List view's sections and the Board columns. */
export function useGroupedTasks(params: TaskQueryParams = {}) {
  return useQuery({
    queryKey: ["tasks", "grouped", params],
    queryFn: () => tasksService.getGrouped(params),
  });
}

export function useTask(id: string | undefined) {
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: () => tasksService.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useSubtasks(taskId: string | undefined) {
  return useQuery({
    queryKey: ["tasks", taskId, "subtasks"],
    queryFn: () => tasksService.getSubtasks(taskId as string),
    enabled: Boolean(taskId),
  });
}

export function useCreateTask() {
  return useApiMutation({
    mutationFn: (input: CreateTaskInput) => tasksService.create(input),
    successMessage: "Task created",
    errorMessage: "Couldn't create task",
    invalidateQueries: [["tasks"], ["projects"]],
  });
}

export function useUpdateTask(taskId: string) {
  return useApiMutation({
    mutationFn: (input: UpdateTaskInput) => tasksService.update(taskId, input),
    errorMessage: "Couldn't update task",
    invalidateQueries: [["tasks"], ["tasks", taskId]],
  });
}

export function useDeleteTask() {
  return useApiMutation({
    mutationFn: (id: string) => tasksService.remove(id),
    successMessage: "Task deleted",
    errorMessage: "Couldn't delete task",
    invalidateQueries: [["tasks"], ["projects"]],
  });
}

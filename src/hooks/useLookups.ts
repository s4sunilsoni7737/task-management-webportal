import { useQuery } from "@tanstack/react-query";
import { membersService } from "@/services/members/members.service";
import { labelsService } from "@/services/labels/labels.service";

export function useMembers() {
  return useQuery({
    queryKey: ["members"],
    queryFn: () => membersService.getAll(),
    staleTime: 60_000,
  });
}

export function useLabels() {
  return useQuery({
    queryKey: ["labels"],
    queryFn: () => labelsService.getAll(),
    staleTime: 60_000,
  });
}

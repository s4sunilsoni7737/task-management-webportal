export interface Workspace {
  id: string;
  name: string;
  avatarUrl: string | null;
  ownerId: string;
  memberIds: string[];
}

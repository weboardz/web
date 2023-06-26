export type Board = {
  id: string;
  name: string;
  type: "private" | "public" | "team";
  creatorId: string;
  createdAt: string;
  updatedAt: string;
};

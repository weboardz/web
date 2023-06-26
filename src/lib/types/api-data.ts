export type Board = {
  id: string;
  name: string;
  type: "private" | "public" | "team";
  creatorId: string;
  createdAt: string;
  updatedAt: string;
};

export type WsMessage = {
  id: string;
  data: string;
  operation: "update" | "create" | "delete";
  save: boolean;
};

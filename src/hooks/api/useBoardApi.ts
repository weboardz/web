import { useState } from "react";

import { api } from "@/config";
import { Board } from "@/lib/types";

import { useAsync, useToken } from "..";

const useBoardApi = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const config = useToken();

  const { isLoading: getBoardsLoading, execute: getBoards } = useAsync(
    async () => {
      const { data } = await api.get<Board[]>("/board", config);
      setBoards(data);
    }
  );

  const { isLoading: deleteBoardLoading, execute: deleteBoard } = useAsync<
    [string]
  >(async (id) => api.delete(`/board/${id}`, config));

  const { isLoading: createBoardLoading, execute: createBoard } = useAsync<
    [Pick<Board, "type" | "name">]
  >(async (payload) => api.post("/board", payload, config));

  const { isLoading: updateBoardLoading, execute: updateBoard } = useAsync<
    [string, Partial<Pick<Board, "type" | "name">>]
  >(async (id, payload) => api.patch(`/board/${id}`, payload, config));

  return {
    boards,
    getBoards,
    getBoardsLoading,
    deleteBoard,
    deleteBoardLoading,
    createBoard,
    createBoardLoading,
    updateBoard,
    updateBoardLoading,
  };
};

export { useBoardApi };

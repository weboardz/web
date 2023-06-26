"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Board } from "@/components";
import { ElementCategory } from "@/lib/types";

const wsUrl = process.env.NEXT_PUBLIC_WS_API_URL;

const connect = (id: string, saveData: (data: any) => void) => {
  return new Promise<WebSocket>((resolve, reject) => {
    const server = new WebSocket(`${wsUrl}room/${id}`);
    server.onopen = () => resolve(server);
    server.onerror = (error) => reject(error);
    server.addEventListener("message", (event) => {
      const test = JSON.parse(event.data) as { id: string };
      if (test?.id) return;
      const data = JSON.parse(event.data) as { data: string }[];
      const newData = data.map((d) => JSON.parse(d.data));
      saveData(newData);
    });
  });
};

const BoardRoom = () => {
  const [initialData, setInitialData] = useState<ElementCategory[]>([]);
  const [socket, setSocket] = useState<WebSocket>();
  const [hasToken, setHasToken] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  const tryConnectToRoom = useCallback(async () => {
    try {
      const server = await connect(id, setInitialData);
      setSocket(server);
    } catch (error) {
      return router.push("/home");
    }
  }, [id, router]);

  useEffect(() => {
    setHasToken(!!document.cookie);
    tryConnectToRoom();
    //eslint-disable-next-line
  }, []);

  return (
    <main className="absolute left-0 top-0 h-screen w-screen overflow-hidden bg-white">
      <Board
        backgroundColor="Alabaster"
        asViewer={!hasToken}
        {...{ socket, initialData }}
      />
    </main>
  );
};

export default BoardRoom;

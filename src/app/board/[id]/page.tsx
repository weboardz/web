"use client";

import { Board } from "@/components";

const BoardRoom = () => {
  return (
    <main className="absolute left-0 top-0 h-screen w-screen overflow-hidden bg-white">
      <Board backgroundColor="Alabaster" />
    </main>
  );
};

export default BoardRoom;

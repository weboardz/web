"use client";

import { Card, Logo } from "@/components";
import { useEffect, useRef, useState } from "react";

const Home = () => {
  const [deleteId, setDeleteId] = useState<string>();

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    deleteId ? dialogRef.current?.showModal() : dialogRef.current?.close();
  }, [deleteId]);

  return (
    <main className="flex h-full w-full bg-white p-32 ">
      <div className="p absolute left-0 top-0 h-72 w-full bg-AliceBlue-400 p-14">
        <Logo theme="light" />
      </div>

      <div className="z-10 flex flex-col gap-16">
        <section className="flex flex-col gap-8">
          <h2 className="font-alt text-5xl font-bold text-white">My Boards</h2>
          <div className="flex flex-wrap gap-10">
            <Card
              id="a"
              name="test"
              updatedAt={new Date()}
              type="public"
              {...{ setDeleteId }}
            />
            <Card
              id="aa"
              name="hello"
              updatedAt={new Date()}
              type="private"
              {...{ setDeleteId }}
            />
            <Card
              id="aaa"
              name="hello"
              updatedAt={new Date()}
              type="team"
              {...{ setDeleteId }}
            />
          </div>
        </section>
      </div>

      <dialog ref={dialogRef} className="rounded">
        <form
          method="dialog"
          className="m-8 flex flex-col items-center gap-6 rounded font-alt"
          onSubmit={() => {}}
        >
          <p className="text-center text-lg text-gray-800">
            Are you sure you want to <span className="font-medium">delete</span>{" "}
            this board?
          </p>

          <div className="flex gap-8 font-medium">
            <button
              className="rounded bg-Chablis-500 px-4 py-2 text-white transition-colors hover:bg-Chablis-600"
              type="submit"
            >
              Yes, delete it
            </button>
            <button
              className="cursor-pointer text-gray-800 hover:underline"
              onClick={() => setDeleteId(undefined)}
              type="reset"
            >
              No, cancel
            </button>
          </div>
        </form>
      </dialog>
    </main>
  );
};

export default Home;

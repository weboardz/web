"use client";

import { FilePlus2, LogOut } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Card, Logo } from "@/components";
import { useBoardApi } from "@/hooks";
import { convertFormDataToObject } from "@/lib/utils";

const Home = () => {
  const [deleteId, setDeleteId] = useState<string>();
  const [create, setCreate] = useState(false);

  const router = useRouter();

  const dialogRef = useRef<HTMLDialogElement>(null);

  const { boards, getBoards, getBoardsLoading, deleteBoard, createBoard } =
    useBoardApi();

  useEffect(() => {
    if (!document.cookie) return redirect("/signin");
    getBoards();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    deleteId || create
      ? dialogRef.current?.showModal()
      : dialogRef.current?.close();
  }, [deleteId, create]);

  return (
    <main className="flex h-full w-full bg-white p-32 ">
      <div className="absolute left-0 top-0 flex h-80 w-full items-start justify-between bg-AliceBlue-400 p-14">
        <Logo theme="light" />

        <div className="flex gap-4">
          <button
            className="group/logout flex items-center gap-2 font-medium text-white hover:underline"
            onClick={() => {
              document.cookie =
                "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              router.push("/signin");
            }}
          >
            <LogOut /> Log out
          </button>
        </div>
      </div>

      <div className="z-10 flex flex-col gap-16">
        <section className="flex flex-col justify-center gap-8">
          <div className="flex gap-8">
            <h2 className="font-alt text-5xl font-bold text-white">
              My Boards
            </h2>
            <button
              onClick={() => {
                setCreate(true);
              }}
            >
              <FilePlus2 className="h-8 w-8 text-white" strokeWidth={2} />
            </button>
          </div>

          <div className="flex flex-wrap gap-10">
            {getBoardsLoading ? (
              <p>Loading</p>
            ) : (
              boards?.map(({ id, name, updatedAt, type }) => (
                <Card
                  key={id}
                  updatedAt={new Date(updatedAt)}
                  {...{ id, name, type, setDeleteId }}
                />
              ))
            )}
          </div>
        </section>
      </div>

      <dialog ref={dialogRef} className="rounded">
        {deleteId && (
          <form
            method="dialog"
            className="m-8 flex flex-col items-center gap-6 rounded font-alt"
            onSubmit={async () => {
              await deleteBoard(deleteId);
              await getBoards();
              setDeleteId(undefined);
            }}
          >
            <p className="text-center text-lg text-gray-800">
              Are you sure you want to{" "}
              <span className="font-medium">delete</span> this board?
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
        )}
        {create && (
          <form
            method="dialog"
            className="m-5 flex w-80 flex-col items-center gap-6 rounded font-alt text-gray-800"
            onSubmit={async (e) => {
              e.preventDefault();

              const data = convertFormDataToObject(
                new FormData(e.currentTarget)
              );

              const { name, type } = data as {
                name: string;
                type: "public" | "private";
              };

              await createBoard({ name, type });
              await getBoards();
              setCreate(false);
            }}
          >
            <div className="flex w-full flex-col gap-4">
              <label className="flex w-full flex-col">
                Name
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full rounded border-2 border-Alabaster-100 px-3 py-2"
                />
              </label>
              <label className="flex w-full flex-col">
                Type
                <select
                  id="type"
                  name="type"
                  className="w-full rounded border-2 border-Alabaster-100"
                >
                  <option value="private">private</option>
                  <option value="public">public</option>
                </select>
              </label>
            </div>

            <div className="flex gap-8 font-medium">
              <button
                className="rounded bg-AliceBlue-500 px-4 py-2 text-white transition-colors hover:bg-AliceBlue-600"
                type="submit"
              >
                Submit
              </button>
              <button
                className="cursor-pointer text-gray-800 hover:underline"
                onClick={() => setCreate(false)}
                type="reset"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </dialog>
    </main>
  );
};

export default Home;

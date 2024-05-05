import {
  getMob,
  createMob,
  addParticipant,
  editParticipant,
  deleteParticipant,
} from "@/server/queries";
import Form from "./form";
import { revalidatePath } from "next/cache";
import { Timer } from "@/components/timer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { StorageProvider } from "./storage";
import { Suspense } from "react";

export default async function MobPage({ params }: { params: { id: string } }) {
  const { participants } = await getMob(params.id);

  return (
    <StorageProvider>
      <header className="fixed left-0 top-0 p-4">
        <Link href="/">
          <ArrowLeft />
        </Link>
      </header>

      <main className="grid grid-rows-[50px_auto] grid-cols-1 justify-center items-center gap-5 max-w-[360px] w-full">
        <div className="text-center text-xl">
          {participants.length
            ? participants.join(", ")
            : "Type a name to get started"}
        </div>

        <div className="flex flex-col gap-4">
          <Form
            participants={participants}
            action={async (
              type: "add" | "delete" | "edit",
              name: string,
              outdatedName?: string
            ) => {
              "use server";

              if (!name || typeof name !== "string") return;

              if (type === "add") {
                await addParticipant(params.id, name);
              }

              if (type === "edit") {
                await editParticipant(params.id, name, outdatedName ?? "");
              }

              if (type === "delete") {
                await deleteParticipant(params.id, name);
              }

              revalidatePath(`/${params.id}`);
            }}
          />

          <Timer participants={participants} />
        </div>
      </main>
    </StorageProvider>
  );
}

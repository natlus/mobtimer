import {
  getMob,
  createMob,
  addParticipant,
  editParticipant,
  deleteParticipant,
} from "@/server/queries";
import Form from "./form";
import { revalidatePath } from "next/cache";

export default async function Home({ params }: { params: { id: string } }) {
  const mob = await getMob(params.id);
  const participants = mob.participants?.split(",") ?? [];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="h-5">{mob.participants}</div>

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
    </main>
  );
}

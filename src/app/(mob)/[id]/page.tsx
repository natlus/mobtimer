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

export default async function Home({ params }: { params: { id: string } }) {
  const { participants } = await getMob(params.id);

  return (
    <main className="grid grid-rows-[50px_auto] justify-center items-center mx-auto gap-5 p-5 pt-20">
      <div className="text-center text-xl">
        {participants.length
          ? participants.join(", ")
          : "Type a name to get started"}
      </div>

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
    </main>
  );
}

import { addParticipant, getMob } from "@/server/queries";
import PreviousParticipants from "./previous-participants";
import { revalidatePath } from "next/cache";

export default async function Page({ params }: { params: { id: string } }) {
  const { participants } = await getMob(params.id);

  return (
    <PreviousParticipants
      participants={participants}
      action={async (formData) => {
        "use server";
        const name = formData.get("action");

        if (!name) return;

        await addParticipant(params.id, name as string);
        revalidatePath(`/${params.id}`);
      }}
    />
  );
}

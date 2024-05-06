"use client";

import { Sidebar } from "@/app/sidebar";
import { useIsClient, useLocalStorage } from "@uidotdev/usehooks";

type Props = {
  action: (formData: FormData) => void;
  participants: string[];
};
import { CheckIcon, Plus, Users } from "lucide-react";

export default function PreviousParticipantsSection(props: Props) {
  const isClient = useIsClient();
  if (!isClient) return null;

  return <PreviousParticipants {...props} />;
}

export function PreviousParticipants({ action, participants }: Props) {
  const [recentParticipants] = useLocalStorage<string | null>(
    "mobtimer:recent-participants",
    null
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="px-6 py-2">
        <Sidebar />
      </div>

      {recentParticipants && (
        <div className="bg-zinc-900 dark:bg-zinc-900 px-6 py-4 rounded-xl flex flex-col gap-4">
          <div className="flex gap-2 text-lg items-center">
            <Users size={20} /> Recent participants
          </div>

          <div className="flex flex-row flex-wrap gap-2">
            {recentParticipants?.split(",").map((p) => {
              const included = participants.includes(p);
              return (
                <form key={p} action={action}>
                  <button
                    type="submit"
                    name="action"
                    value={p}
                    disabled={included}
                    className="flex flex-row gap-0 items-center disabled:opacity-75 disabled:pointer-events-none hover:underline"
                  >
                    {p}{" "}
                    {!included ? (
                      <Plus size={16} />
                    ) : (
                      <CheckIcon size={16} className="text-green-600" />
                    )}
                  </button>
                </form>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

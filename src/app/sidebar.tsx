"use client";

import { useIsClient, useLocalStorage } from "@uidotdev/usehooks";
import { useQuery } from "@tanstack/react-query";
import { Link2, Rows4, UsersRound } from "lucide-react";
import Link from "next/link";

export function Sidebar() {
  const isClient = useIsClient();
  if (!isClient) return null;

  return <PreviousMobs />;
}

type RecentMobsData = {
  participants: string[];
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
}[];

export function PreviousMobs() {
  const [ids] = useLocalStorage<string | null>("mobtimer:ids", null);
  const [recentParticipants] = useLocalStorage<string | null>(
    "mobtimer:recent-participants",
    null
  );

  const { data, isLoading } = useQuery<RecentMobsData>({
    queryKey: ["recent-mobs"],
    queryFn: async () => {
      const data = await fetch(`/api/mobs/${ids}`);
      const mobs = await data.json();

      return mobs;
    },
    enabled: !!ids,
  });

  if (!ids) return null;

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 text-lg">
          <Rows4 /> Recent mobs
        </div>

        <div className="flex flex-col gap-6 px-6">
          {ids?.split(",").map(
            (id) =>
              data?.map((item) => item.id).includes(id) && (
                <div key={id} className="flex flex-col gap-2">
                  <Link
                    href={id}
                    className="hover:underline flex items-center gap-1"
                  >
                    <Link2 size={20} /> {id}
                  </Link>

                  <div className="text-sm flex gap-2 px-2 opacity-75 items-center">
                    <UsersRound size={16} />
                    {isLoading ? (
                      "Loading..."
                    ) : (
                      <span className="truncate max-w-[150px]">
                        {data
                          ?.find((mob) => mob.id === id)
                          ?.participants.join(", ")}
                      </span>
                    )}
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}

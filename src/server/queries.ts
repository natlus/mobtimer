import "server-only";
import { db } from "./db";

import { mobs } from "./db/schema";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import {
  uniqueNamesGenerator as gen,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

const genOpts = {
  separator: "-",
  dictionaries: [adjectives, colors, animals],
};

export async function getMob(id: string) {
  const mob = await db.query.mobs.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!mob) redirect("/");

  return {
    ...mob,
    participants: mob.participants?.split(",").filter(Boolean) ?? [],
  };
}

export async function getMobs(ids: string[]) {
  const mobs = await db.query.mobs.findMany({
    where: (model, { inArray }) => inArray(model.id, ids),
  });

  if (!mobs) redirect("/");

  return mobs.map((mob) => ({
    ...mob,
    participants: mob.participants?.split(",").filter(Boolean) ?? [],
  }));
}

export async function createMob() {
  const mob = await db
    .insert(mobs)
    .values({ id: gen(genOpts) })
    .returning();

  return mob;
}

async function getParticipants(id: string) {
  const { participants } =
    (await db.query.mobs.findFirst({
      where: (model, { eq }) => eq(model.id, id),
    })) ?? {};

  const participantsSet = new Set(
    participants?.split(",").map((p) => p.trim())
  );

  return participantsSet;
}

export async function addParticipant(id: string, participant: string) {
  const participants = await getParticipants(id);

  participants.add(participant);

  const mob = await db
    .update(mobs)
    .set({
      participants: Array.from(participants)
        .map((p) => p.trim())
        .join(","),
    })
    .where(eq(mobs.id, id));
}

export async function editParticipant(
  id: string,
  participant: string,
  outdatedParticipant: string
) {
  const participants = await getParticipants(id);

  participants.delete(outdatedParticipant);
  participants.add(participant);

  const mob = await db
    .update(mobs)
    .set({
      participants: Array.from(participants)
        .map((p) => p.trim())
        .join(","),
    })
    .where(eq(mobs.id, id));
}

export async function deleteParticipant(id: string, participant: string) {
  const participants = await getParticipants(id);

  participants.delete(participant);

  const mob = await db
    .update(mobs)
    .set({
      participants: Array.from(participants).length
        ? Array.from(participants)
            .map((p) => p.trim())
            .join(",")
        : null,
    })
    .where(eq(mobs.id, id));
}

export async function setTime(id: string, time: number) {
  const mob = await db
    .update(mobs)
    .set({
      time,
    })
    .where(eq(mobs.id, id));
}

"use server";

import { createMob } from "@/server/queries";
import { redirect } from "next/navigation";

export async function createMobSession() {
  const [{ id }] = await createMob();

  redirect(`/${id}`);
}

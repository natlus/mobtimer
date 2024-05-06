"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useIsClient, useLocalStorage } from "@uidotdev/usehooks";

const idStore = new Set<string>();

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const isClient = useIsClient();

  if (!isClient) return children;

  return <LocalStorageProvider>{children}</LocalStorageProvider>;
}

function LocalStorageProvider({ children }: { children: React.ReactNode }) {
  const [ids, saveIds] = useLocalStorage<string | null>("mobtimer:ids", null);
  const { id: slug } = useParams();
  const id = typeof slug === "object" ? slug[0] : slug;

  useEffect(() => {
    if (ids) {
      ids.split(",").forEach((id) => idStore.add(id));
    }
  }, [ids]);

  useEffect(() => {
    if (typeof id === "object") return;
    idStore.add(id);
  }, [id]);

  useEffect(() => {
    saveIds(Array.from(idStore).join(","));
  }, [idStore]);

  return <>{children}</>;
}

"use client";

import {
  activeParticipantAtom,
  readableTime,
  timerAtom,
} from "@/components/timer";
import { Input } from "@/components/ui/input";
import { useAtom } from "jotai";
import { Trash2 as Trash, CirclePlus, CircleCheck } from "lucide-react";

import { useOptimistic, useRef, useState } from "react";

type Action = (
  type: "add" | "delete" | "edit",
  name: string,
  outdatedName?: string
) => void;

const PLACEHOLDER = "Add new participant";

export default function Form({
  action,
  participants,
}: {
  action: Action;
  participants: string[];
}) {
  const [optimistic, addOptimistic] = useOptimistic<
    string[],
    { action: "add" | "edit" | "delete"; newName: string }
  >(participants, (state, { action, newName }) => {
    switch (action) {
      case "add":
        return [...state, newName];
      case "delete":
        return state.filter((name) => name !== newName);
      case "edit":
        return state.map((name) => (name === newName ? newName : name));
      default:
        return state;
    }
  });
  const formRef = useRef<HTMLFormElement>(null);

  const handleAction = (data: FormData, outdatedName?: string) => {
    const actionType = data.get("action") as "add" | "edit" | "delete";
    const name = data.get("name");

    if (!name || typeof name !== "string" || !formRef.current) return;

    addOptimistic({ action: actionType, newName: name });
    action(actionType, name, outdatedName);

    if (actionType === "add") formRef.current.reset();
  };

  return (
    <div className="flex flex-col gap-5 relative w-full">
      {optimistic?.map((participant) => (
        <form
          key={participant}
          action={(formData) => handleAction(formData, participant)}
          className="flex gap-1 w-full items-center"
        >
          <Entry key={participant} participant={participant} />
        </form>
      ))}

      <form
        ref={formRef}
        action={handleAction}
        className="flex gap-1 w-full items-center"
      >
        <Entry participant={PLACEHOLDER} autoFocus />
      </form>
    </div>
  );
}

function Entry({
  participant,
  autoFocus = false,
}: {
  participant: string;
  autoFocus?: boolean;
}) {
  const [focused, setFocused] = useState<boolean>(false);
  const [activeParticipant] = useAtom(activeParticipantAtom);
  const [timer] = useAtom(timerAtom);

  const isNew = participant === PLACEHOLDER;
  const faded = !isNew ? "opacity-100" : "opacity-100";
  const active =
    activeParticipant === participant
      ? "bg-zinc-600 dark:bg-zinc-900"
      : "dark:bg-zinc-700 bg-zinc-900 ";

  const preventFocus = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      <title>{activeParticipant + " - " + readableTime(timer)}</title>

      <Input
        id="inputtest"
        tabIndex={1}
        type="text"
        name="name"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Add participant"
        defaultValue={isNew ? undefined : participant}
        className={`${faded} ${active} focus-visible:opacity-100 text-md text-white`}
        data-1p-ignore
        autoFocus={autoFocus}
      />

      {!isNew && (
        <button
          name="action"
          value="delete"
          type="submit"
          className={`text-white ${
            focused
              ? "absolute right-[40px]"
              : "absolute right-[8px] opacity-50"
          } hover:opacity-100`}
          onMouseDown={preventFocus}
        >
          <Trash />
        </button>
      )}
      {isNew && focused && (
        <button
          name="action"
          type="submit"
          value="add"
          disabled={!focused}
          onMouseDown={preventFocus}
          className="absolute right-[8px] text-white"
        >
          <CirclePlus />
        </button>
      )}
      {!isNew && focused && (
        <button
          name="action"
          value="edit"
          type="submit"
          className="absolute right-[8px] text-white"
          onMouseDown={preventFocus}
        >
          <CircleCheck />
        </button>
      )}
    </>
  );
}

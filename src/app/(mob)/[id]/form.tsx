"use client";

import {
  activeParticipantAtom,
  readableTime,
  timerAtom,
} from "@/components/timer";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils";
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
      ? "bg-zinc-600 dark:bg-zinc-600"
      : "bg-zinc-900 dark:bg-zinc-900";

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

      <div
        className={`absolute right-[8px] flex ${
          focused ? "[&>button]:opacity-100" : "[&>button]:opacity-60"
        } [&>button]:hover:opacity-100`}
      >
        {!isNew && (
          <InputButton value="delete" className="mr-1">
            <Trash size={20} />
          </InputButton>
        )}
        {isNew && focused && (
          <InputButton value="add">
            <CirclePlus />
          </InputButton>
        )}
        {!isNew && focused && (
          <InputButton value="edit">
            <CircleCheck />
          </InputButton>
        )}
      </div>
    </>
  );
}

function InputButton({
  children,
  value,
  className,
}: {
  children: React.ReactNode;
  value: "add" | "edit" | "delete";
  className?: string;
}) {
  const preventFocus = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <button
      name="action"
      value={value}
      type="submit"
      onMouseDown={preventFocus}
      className={cn(className, "text-white")}
    >
      {children}
    </button>
  );
}

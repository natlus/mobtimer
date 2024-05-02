import { Button } from "@/components/ui/button";
import { createMobSession } from "./actions";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form action={createMobSession}>
        <Button type="submit">Create new mob session</Button>
      </form>
    </main>
  );
}

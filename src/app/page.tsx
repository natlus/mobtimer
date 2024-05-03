import { Button } from "@/components/ui/button";
import { createMobSession } from "./actions";

export default function CreateMobPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form action={createMobSession}>
        <Button variant="outline" type="submit" size="lg" className="text-lg">
          Create new mob session
        </Button>
      </form>
    </main>
  );
}

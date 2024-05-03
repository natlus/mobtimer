import { getMobs } from "@/server/queries";

export async function GET(
  req: Request,
  { params }: { params: { ids: string } }
) {
  const ids = params.ids.split(",").map((id) => id);

  const data = await getMobs(ids);

  return Response.json(data);
}

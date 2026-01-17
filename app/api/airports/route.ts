import { NextRequest } from "next/server";
import airports from "@/data/airports.json"


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("query") || "").toLowerCase();

  const results = airports.filter(
    (a) =>
      a.city.toLowerCase().includes(q) ||
      a.airport.toLowerCase().includes(q) ||
      a.iata.toLowerCase().includes(q),
  );

  return Response.json({ data: results });
}

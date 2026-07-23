import { NextResponse } from "next/server";
import { loadProductivityData } from "@/lib/productivity-source";

export const dynamic = "force-dynamic";

export async function GET() {
  const source = await loadProductivityData();
  return NextResponse.json(source);
}

import { NextResponse } from "next/server";
import { supabase } from "@/infrastructure/database/supabase";

const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export async function GET() {
  try {
    const [
      { count: totalMessages },
      { count: orderMessages },
      { count: otherMessages },
      { data: conversations },
    ] = await Promise.all([
      supabase.from("messages").select("*", { count: "exact", head: true }),
      supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("intent", "ORDER"),
      supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("intent", "OTHER"),
      supabase
        .from("conversations")
        .select("created_at")
        .gte(
          "created_at",
          (() => {
            const d = new Date();
            d.setDate(d.getDate() - 6);
            d.setHours(0, 0, 0, 0);
            return d.toISOString();
          })()
        ),
    ]);

    const chartData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().slice(0, 10);
      const count = (conversations ?? []).filter((c) =>
        c.created_at.startsWith(dateStr)
      ).length;
      return { day: DAY_NAMES[date.getDay()], atendimentos: count };
    });

    return NextResponse.json({
      totalMessages: totalMessages ?? 0,
      orderMessages: orderMessages ?? 0,
      otherMessages: otherMessages ?? 0,
      chartData,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

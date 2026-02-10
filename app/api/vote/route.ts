import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export async function POST(req: Request) {
    const { stage, choice } = await req.json();

    const db = await getDb();

    await db.collection("responses").updateOne(
        { _id: stage },
        { $inc: { [choice]: 1 } },
        { upsert: true }
    );

    const doc = await db.collection("responses").findOne({ _id: stage });

    return NextResponse.json(doc);
}

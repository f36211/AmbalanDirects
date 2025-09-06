import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const DB_NAME = "DestyLikeDB";
const COLLECTION_NAME = "Redirects";

// GET all links
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const links = await db.collection(COLLECTION_NAME).find({}).sort({ order: 1 }).toArray();
    return NextResponse.json(links);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to fetch links" }, { status: 500 });
  }
}

// POST a new link
export async function POST(request: Request) {
  try {
    const { Name, Links } = await request.json();
    if (!Name || !Links) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const result = await db.collection(COLLECTION_NAME).insertOne({ Name, Links });
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to create link" }, { status: 500 });
  }
}

// DELETE a link
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ error: "Missing link ID" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        
        const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Link not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Link deleted successfully" });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Unable to delete link" }, { status: 500 });
    }
}

// PUT (update) a link
export async function PUT(request: Request) {
  try {
    const { id, Name, Links } = await request.json();
    if (!id || !Name || !Links) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const result = await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(id) },
      { $set: { Name, Links } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Link updated successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to update link" }, { status: 500 });
  }
}



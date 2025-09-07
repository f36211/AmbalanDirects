import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Collection, ObjectId } from 'mongodb';

// --- Configuration ---
// The database name is now correctly inferred directly from your MONGO_URL.
const COLLECTION_NAME = "Redirects";

// --- Type Definition ---
// This defines the structure of a Link document in our database.
interface Link {
  _id?: ObjectId; // Optional because it's not present before insertion
  Name: string;
  Links: string;
  order: number;
  createdAt: Date;
}

// --- Database Connection Helper ---
// This helper now uses the default database from the connection string.
async function getLinksCollection(): Promise<Collection<Link>> {
  const client = await clientPromise;
  // By not passing a name to client.db(), it uses the database specified in your MONGO_URL.
  const db = client.db();
  return db.collection<Link>(COLLECTION_NAME);
}

// --- API Handlers ---

// GET all links
export async function GET() {
  try {
    const linksCollection = await getLinksCollection();
    const links = await linksCollection.find({}).sort({ order: 1 }).toArray();
    return NextResponse.json(links);
  } catch (e) {
    // Provide more detailed error logging on the server.
    console.error("API GET Error:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "Unable to fetch links", error: errorMessage },
      { status: 500 }
    );
  }
}

// POST a new link
export async function POST(request: Request) {
  try {
    const { Name, Links } = await request.json();
    if (!Name || !Links) {
      return NextResponse.json({ message: "Missing required fields: Name and Links" }, { status: 400 });
    }

    const linksCollection = await getLinksCollection();

    // Automatically determine the order for the new link.
    const count = await linksCollection.countDocuments();

    const newLink: Link = {
      Name,
      Links,
      order: count, // Append to the end of the list
      createdAt: new Date(),
    };

    const result = await linksCollection.insertOne(newLink);

    // Return the newly created document with a 201 status code.
    return NextResponse.json({ ...newLink, _id: result.insertedId }, { status: 201 });
  } catch (e) {
    console.error("API POST Error:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return NextResponse.json({ message: "Unable to create link", error: errorMessage }, { status: 500 });
  }
}

// PATCH (update) an existing link
export async function PATCH(request: Request) {
  try {
    const { id, Name, Links } = await request.json();
    if (!id) {
      return NextResponse.json({ message: "Missing required field: id" }, { status: 400 });
    }

    // Construct the update object to only set fields that are provided.
    const fieldsToUpdate: Partial<Pick<Link, 'Name' | 'Links'>> = {};
    if (Name) fieldsToUpdate.Name = Name;
    if (Links) fieldsToUpdate.Links = Links;

    if (Object.keys(fieldsToUpdate).length === 0) {
        return NextResponse.json({ message: "No fields to update provided." }, { status: 400 });
    }

    const linksCollection = await getLinksCollection();
    const result = await linksCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: fieldsToUpdate }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Link not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Link updated successfully" });
  } catch (e) {
    console.error("API PATCH Error:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return NextResponse.json({ message: "Unable to update link", error: errorMessage }, { status: 500 });
  }
}

// DELETE a link
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ message: "Missing required field: id" }, { status: 400 });
    }

    const linksCollection = await getLinksCollection();
    const result = await linksCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Link not found" }, { status: 404 });
    }

    // It's good practice to refetch and reorder all remaining links after a deletion.
    const remainingLinks = await linksCollection.find({}).sort({ order: 'asc' }).toArray();
    const bulkOps = remainingLinks.map((link, index) => ({
        updateOne: {
            filter: { _id: link._id },
            update: { $set: { order: index } }
        }
    }));

    if (bulkOps.length > 0) {
        await linksCollection.bulkWrite(bulkOps);
    }

    return NextResponse.json({ message: "Link deleted and list reordered successfully" });
  } catch (e) {
    console.error("API DELETE Error:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return NextResponse.json({ message: "Unable to delete link", error: errorMessage }, { status: 500 });
  }
}


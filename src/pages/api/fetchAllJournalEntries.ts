import clientPromise from "../../mongodb/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db();
    const journalEntriesCollection = db.collection(
      `USERS_${userId}_JOURNAL_ENTRIES`
    );

    const journalEntries = await journalEntriesCollection
      .find({})
      .sort({ updatedAt: -1 })
      .toArray();

    res.status(200).json({
      message: "Journal entries successfully fetched",
      journalEntries,
    });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({
      message: "An error occurred while fetching journal entries",
      error: e.message,
    });
  }
};

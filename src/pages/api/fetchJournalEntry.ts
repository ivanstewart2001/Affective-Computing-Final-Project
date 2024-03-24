import clientPromise from "../../mongodb/client";
import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, journalEntryId } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db();
    const journalEntries = db.collection(`USERS_${userId}_JOURNAL_ENTRIES`);

    const journalEntry = await journalEntries.findOne({
      _id: new mongoose.Types.ObjectId(journalEntryId),
      userId,
    });

    res.status(200).json({
      message: "Journal entry successfully read",
      journalEntry,
    });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({
      message: "An error occurred while reading the journal entry",
      error: e.message,
    });
  }
};

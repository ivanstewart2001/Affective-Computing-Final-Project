import clientPromise from "../../mongodb/client";
import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, journalEntryId } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db();
    const journalEntries = db.collection(`USERS_${userId}_JOURNAL_ENTRIES`);

    const deletedJournalEntry = await journalEntries.deleteOne({
      _id: new mongoose.Types.ObjectId(journalEntryId),
    });

    if (deletedJournalEntry.deletedCount === 1) {
      res.status(200).json({
        message: "Journal entry successfully deleted",
        journalEntryId,
      });
    } else {
      res.status(404).json({
        message: "Journal entry not found",
      });
    }
  } catch (e: any) {
    console.error(e);
    res.status(500).json({
      message: "An error occurred while deleting the journal entry",
      error: e.message,
    });
  }
};

import clientPromise from "../../mongodb/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { text, userId, prompt } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db();
    const journalEntries = db.collection(`USERS_${userId}_JOURNAL_ENTRIES`);

    const journalEntry = {
      text,
      userId,
      updatedAt: new Date().getTime(),
      prompt,
    };
    await journalEntries.insertOne(journalEntry);

    res.status(200).json({
      message: "Journal entry successfully created",
    });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({
      message: "An error occurred while creating the journal entry",
      error: e.message,
    });
  }
};

import clientPromise from "../../mongodb/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, page, preSurvey, postSurvey } = req.body;

  try {
    if (!userId) {
      throw new Error("Missing user ID");
    }

    const client = await clientPromise;
    const db = client.db();
    const progressReport = db.collection(`USERS_${userId}_PROGRESS_REPORT`);

    const documents = await progressReport
      .find()
      .sort({ timestamp: -1 })
      .toArray();

    res.status(200).json({
      message: "Successfully fetched progress report data",
      result: documents,
    });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({
      message: "",
      error: e.message,
    });
  }
};

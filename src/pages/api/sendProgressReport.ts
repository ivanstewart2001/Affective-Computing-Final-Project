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

    const data = {
      page,
      preSurvey,
      postSurvey,
      timeStamp: new Date(),
    };
    await progressReport.insertOne(data);

    res.status(200).json({
      message: "",
    });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({
      message: "",
      error: e.message,
    });
  }
};

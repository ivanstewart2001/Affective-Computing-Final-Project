import clientPromise from "../../mongodb/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    userId,
    gender,
    age,
    dominantEmotion,
    angry,
    disgust,
    fear,
    happy,
    sad,
    surprise,
    neutral,
    arousal,
    valence,
    attention,
    timeStamp,
  } = req.body;

  try {
    if (!userId) {
      throw new Error("Missing user ID");
    }

    const client = await clientPromise;
    const db = client.db();
    const emotions = db.collection(`USERS_${userId}_EMOTIONS`);

    const data = {
      gender,
      age,
      dominantEmotion,
      angry,
      disgust,
      fear,
      happy,
      sad,
      surprise,
      neutral,
      arousal,
      valence,
      attention,
      timeStamp: new Date(timeStamp),
    };
    await emotions.insertOne(data);

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

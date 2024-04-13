import clientPromise from "../../mongodb/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.body;

  try {
    if (!userId) {
      throw new Error("Missing user ID");
    }

    const client = await clientPromise;
    const db = client.db();
    const emotions = db.collection(`USERS_${userId}_EMOTIONS`);

    const pipeline = [
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$timeStamp",
            },
          },
          dominantEmotion: { $push: "$dominantEmotion" },
          angry: { $avg: "$angry" },
          disgust: { $avg: "$disgust" },
          fear: { $avg: "$fear" },
          happy: { $avg: "$happy" },
          sad: { $avg: "$sad" },
          surprise: { $avg: "$surprise" },
          neutral: { $avg: "$neutral" },
          arousal: { $avg: "$arousal" },
          valence: { $avg: "$valence" },
          attention: { $avg: "$attention" },
        },
      },
    ];

    const result = await emotions.aggregate(pipeline).toArray();

    res.status(200).json({
      message: "Successfully fetched emotion data",
      result,
    });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({
      message: "",
      error: e.message,
    });
  }
};

import { parseCookies } from "nookies";
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
    const timeOnApp = db.collection(`USERS_${userId}_TIME_ON_APP`);

    const cookies = parseCookies({ req });

    const session = {
      loginTime: new Date(Number(cookies.loginTime)),
      logoutTime: new Date(),
    };

    await timeOnApp.insertOne(session);

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

import clientPromise from "../../mongodb/client";
import { NextApiRequest, NextApiResponse } from "next";
import * as Realm from "realm-web";
import mongoose from "mongoose";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;

    if (!REALM_APP_ID) {
      throw new Error(
        'Invalid/Missing environment variable: "NEXT_PUBLIC_REALM_APP_ID"'
      );
    }

    const app = new Realm.App({
      id: REALM_APP_ID,
    });

    await app.emailPasswordAuth.registerUser({
      email,
      password,
    });

    const credentials = Realm.Credentials.emailPassword(email, password);
    const loggedInUser = await app.logIn(credentials);

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("USERS");

    const user = {
      _id: new mongoose.Types.ObjectId(loggedInUser.id),
      email,
      firstName,
      lastName,
    };
    users.insertOne(user);

    await app.currentUser?.logOut();

    res.status(200).json({
      message: "User successfully registered",
      userId: loggedInUser.id,
    });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({
      message: "An error occurred during registration",
      error: e.message,
    });
  }
};

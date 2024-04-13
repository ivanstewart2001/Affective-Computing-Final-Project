import clientPromise from "../../mongodb/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, dateType } = req.body;

  try {
    if (!userId) {
      throw new Error("Missing user ID");
    }

    const client = await clientPromise;
    const db = client.db();
    const timeOnApp = db.collection(`USERS_${userId}_TIME_ON_APP`);

    if (dateType === "WEEK") {
      const today = new Date();
      const startOfWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay()
      );
      const endOfWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + (6 - today.getDay())
      );

      const result = await timeOnApp
        .aggregate([
          {
            $match: {
              loginTime: { $gte: startOfWeek, $lte: endOfWeek },
            },
          },
          {
            $group: {
              _id: { $dayOfWeek: "$loginTime" },
              totalMinutes: {
                $sum: {
                  $divide: [
                    { $subtract: ["$logoutTime", "$loginTime"] },
                    60000,
                  ],
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              dayOfWeek: "$_id",
              totalMinutes: 1,
            },
          },
        ])
        .toArray();

      const daysOfWeek = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      const timeOnAppData: { [key: string]: number }[] = [];

      for (let i = 0; i < 7; i++) {
        const dayData = result.find(({ dayOfWeek }) => dayOfWeek === i + 1);
        timeOnAppData.push({
          [daysOfWeek[i]]: dayData ? dayData.totalMinutes : 0,
        });
      }

      res.status(200).json({
        message: "Time on app data retrieved successfully",
        timeOnAppData,
      });
    } else if (dateType === "MONTH") {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const result = await timeOnApp
        .aggregate([
          {
            $match: {
              loginTime: { $gte: startOfMonth, $lte: endOfMonth },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$loginTime",
                },
              },
              totalMinutes: {
                $sum: {
                  $divide: [
                    { $subtract: ["$logoutTime", "$loginTime"] },
                    60000,
                  ],
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              date: "$_id",
              totalMinutes: 1,
            },
          },
        ])
        .toArray();

      const timeOnAppData: { [key: string]: number }[] = [];

      for (let i = 1; i <= endOfMonth.getDate(); i++) {
        const paddedMonth = String(today.getMonth() + 1).padStart(2, "0");
        const paddedDay = String(i).padStart(2, "0");
        const dateData = result.find(
          ({ date }) =>
            date === `${today.getFullYear()}-${paddedMonth}-${paddedDay}`
        );
        timeOnAppData.push({
          [`${paddedMonth}/${paddedDay}/${today.getFullYear()}`]: dateData
            ? dateData.totalMinutes
            : 0,
        });
      }

      res.status(200).json({
        message: "Time on app data retrieved successfully",
        timeOnAppData,
      });
    }
  } catch (e: any) {
    console.error(e);
    res.status(500).json({
      message: "",
      error: e.message,
    });
  }
};

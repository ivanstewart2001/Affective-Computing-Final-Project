import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/custom-components/Header";
import { routeValidation } from "@/utils/routeValidation";
import toastUtil from "@/utils/toastUtil";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation } from "react-query";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

function UpdateJournalPage(props: any) {
  const router = useRouter();

  return (
    <>
      <Header />

      <div className="flex flex-col mt-4 p-10">
        <div className="flex flex-row justify-between mb-10">
          <h1 className="text-4xl">Journal Entry</h1>

          <Button onClick={() => router.push("/anger/journal")}>Back</Button>
        </div>

        <div className="mb-4">
          <h1 className="text-xl">
            Prompt: {props.journalEntry.prompt || "No prompt"}
          </h1>

          <p>
            Last Updated:{" "}
            {new Date(props.journalEntry.updatedAt).toLocaleString()}
          </p>
        </div>

        <Textarea
          className="mb-4"
          value={props.journalEntry.text}
          disabled={true}
        />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = routeValidation(
  async (context: any) => {
    const accessToken = JSON.parse((context as any).accessToken);
    const userId = JSON.parse((context as any).userId);
    const journalEntryId = context.query.journalEntryId;

    const productionUrl =
      "https://affective-computing-final-project.vercel.app";
    const developmentUrl = "http://localhost:3000";

    const BASE_URL =
      process.env.NODE_ENV === "development" ? developmentUrl : productionUrl;

    const response = await fetch(`${BASE_URL}/api/fetchJournalEntry`, {
      method: "POST",
      body: JSON.stringify({
        userId,
        journalEntryId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        props: {
          accessToken,
          userId,
          journalEntry: {},
        },
      };
    }

    return {
      props: {
        accessToken,
        userId,
        journalEntry: data.journalEntry,
      },
    };
  }
);

export default UpdateJournalPage;

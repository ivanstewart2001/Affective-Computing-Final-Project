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
  const { toast } = useToast();

  const [text, setText] = useState(props.journalEntry.text);

  const mutation = useMutation(
    async () => {
      const response = await fetch("/api/updateJournalEntry", {
        method: "POST",
        body: JSON.stringify({
          userId: props.userId,
          journalEntryId: props.journalEntry._id,
          updatedText: text,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("An error occurred while updating journal entry");
      }

      return await response.json();
    },
    {
      onError: (err: Error) => {
        toastUtil({
          timeoutMs: 3000,
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          toast,
          description: err.message,
        });
      },
      onSuccess: async () => {
        setText("");

        toastUtil({
          timeoutMs: 3000,
          variant: "default",
          title: "Success!",
          toast,
          description: "Journal Entry updated successfully",
          func: () => {
            router.push("/anger/journal");
          },
        });
      },
    }
  );

  function handleSubmit() {
    if (!props.userId) {
      toastUtil({
        timeoutMs: 3000,
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        toast,
        description: "User ID not found",
      });
      return;
    }

    if (!text) {
      toastUtil({
        timeoutMs: 3000,
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        toast,
        description: "Please enter some text",
      });
      return;
    }

    mutation.mutate();
  }

  return (
    <>
      <Header />

      <div className="flex flex-col mt-4 p-10">
        <div className="flex flex-row justify-between mb-10">
          <h1 className="text-4xl">Update Journal Entry</h1>

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
          onChange={(e) => setText(e.target.value)}
          className="mb-4"
          disabled={mutation.isLoading}
          value={text}
        />

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            className=" w-fit"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Loading" : "Submit"}
          </Button>
        </div>
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

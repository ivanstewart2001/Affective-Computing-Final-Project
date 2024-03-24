import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { useMutation } from "react-query";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

function JournalHomePage(props: any) {
  const router = useRouter();
  const { toast } = useToast();

  const [journalEntries, setJournalEntries] = useState(props.journalEntries);

  const mutation = useMutation(
    async (entryId: string) => {
      const response = await fetch("/api/deleteJournalEntry", {
        method: "POST",
        body: JSON.stringify({
          userId: props.userId,
          journalEntryId: entryId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("An error occurred while deleting journal entry");
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
      onSuccess: async (deletedJournalEntry: any) => {
        toastUtil({
          timeoutMs: 3000,
          variant: "default",
          title: "Success!",
          toast,
          description: "Journal Entry deleted successfully",
          func: () => {
            setJournalEntries((prevArray: any) =>
              prevArray.filter(
                (item: any) => item._id !== deletedJournalEntry.journalEntryId
              )
            );
          },
        });
      },
    }
  );

  function JournalEntry({ entry }: { entry: any }) {
    return (
      <Card className="mb-2">
        <CardHeader>
          <CardTitle className="truncate">{entry.prompt}</CardTitle>
          <CardDescription>
            {new Date(entry.updatedAt).toLocaleString()}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="truncate">{entry.text}</p>
        </CardContent>

        <CardFooter className="space-x-4">
          <Button
            onClick={() =>
              router.push(`/anger/journal/${entry._id}/viewJournalEntry`)
            }
            variant="secondary"
          >
            View
          </Button>

          <Button
            onClick={() =>
              router.push(`/anger/journal/${entry._id}/updateJournalEntry`)
            }
          >
            Edit
          </Button>

          <Button
            onClick={() => mutation.mutate(entry._id)}
            variant="destructive"
          >
            Delete
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <>
      <Header />

      <div className="flex flex-col mt-4 p-10">
        <div className="flex flex-row justify-between mb-10">
          <h1 className="text-4xl">Journal Entries</h1>

          <Button
            onClick={() => router.push("/anger/journal/createJournalEntry")}
          >
            Create New Journal Entry
          </Button>
        </div>

        <div>
          {journalEntries && journalEntries.length > 0 ? (
            journalEntries.map((entry: any) => (
              <JournalEntry key={entry._id} entry={entry} />
            ))
          ) : (
            <p>No journal entries found.</p>
          )}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = routeValidation(
  async (context: any) => {
    const accessToken = JSON.parse((context as any).accessToken);
    const userId = JSON.parse((context as any).userId);

    const productionUrl =
      "https://affective-computing-final-project.vercel.app";
    const developmentUrl = "http://localhost:3000";

    const BASE_URL =
      process.env.NODE_ENV === "development" ? developmentUrl : productionUrl;

    const response = await fetch(`${BASE_URL}/api/fetchAllJournalEntries`, {
      method: "POST",
      body: JSON.stringify({
        userId,
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
          journalEntries: [],
        },
      };
    }

    return {
      props: {
        accessToken,
        userId,
        journalEntries: data.journalEntries,
      },
    };
  }
);

export default JournalHomePage;

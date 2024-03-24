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
import { ANGER_JOURNAL_PROMPTS } from "@/utils/angerJournalPrompts";

function CreateJournalPage(props: any) {
  const router = useRouter();
  const { toast } = useToast();

  const [text, setText] = useState("");
  const [promptIndex, setPromptIndex] = useState(
    Math.floor(Math.random() * ANGER_JOURNAL_PROMPTS.length)
  );

  const mutation = useMutation(
    async () => {
      const response = await fetch("/api/createJournalEntry", {
        method: "POST",
        body: JSON.stringify({
          userId: props.userId,
          text,
          prompt: ANGER_JOURNAL_PROMPTS[promptIndex],
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("An error occurred while creating journal entry");
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
          description: "Journal Entry created successfully",
          func: () => {
            router.push("/anger/journal");
          },
        });
      },
    }
  );

  function getNewPromptIndex() {
    let newIndex = Math.floor(Math.random() * ANGER_JOURNAL_PROMPTS.length);
    while (newIndex === promptIndex) {
      newIndex = Math.floor(Math.random() * ANGER_JOURNAL_PROMPTS.length);
    }

    setPromptIndex(newIndex);
  }

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
          <h1 className="text-4xl">Create Journal Entry</h1>

          <Button onClick={() => router.push("/anger/journal")}>Back</Button>
        </div>

        <div className="space-y-4 mb-4">
          <h1 className="text-xl">
            Prompt: {ANGER_JOURNAL_PROMPTS[promptIndex]}
          </h1>
          <Button onClick={getNewPromptIndex}>New Prompt</Button>
        </div>

        <Textarea
          onChange={(e) => setText(e.target.value)}
          className="mb-4"
          disabled={mutation.isLoading}
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

    return {
      props: {
        accessToken,
        userId,
      },
    };
  }
);

export default CreateJournalPage;

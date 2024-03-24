import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/custom-components/Header";
import { useRouter } from "next/router";

function AngerHomePage() {
  const router = useRouter();

  return (
    <>
      <Header />

      <div className="flex flex-col justify-center items-center h-screen space-y-8">
        <h1 className="text-4xl">Pick an activity</h1>

        <div className="flex flex-row space-x-8">
          <Card className="flex flex-col w-96 h-fit justify-center items-center">
            <CardHeader>
              <CardTitle>Journaling</CardTitle>

              <CardDescription>
                Journaling is your personal space to unleash, understand, and
                conquer your anger. Whether it&apos;s a fleeting frustration or
                a simmering rage, this journaling experience provides a safe
                haven to express and explore your emotions.
                <br />
                <br />
                Let the pages become your sounding board, as you pour out your
                thoughts and feelings without judgment. With guided prompts and
                reflective exercises, Journaling empowers you to delve deep,
                gain insights, and find healthier ways to manage and channel
                your anger.
                <br />
                <br />
                It&apos;s time to turn the page on anger and write your own
                story of resilience and growth.
              </CardDescription>
            </CardHeader>

            <CardFooter>
              <Button onClick={() => router.push("/anger/journal")}>
                Select
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col w-96 h-fit justify-center items-center">
            <CardHeader>
              <CardTitle>Anger Relief Games</CardTitle>

              <CardDescription>TODO</CardDescription>
            </CardHeader>

            <CardFooter>
              <Button onClick={() => router.push("/stress/breathing-exercise")}>
                Select
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}

export default AngerHomePage;

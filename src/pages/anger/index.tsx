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

      <div className="m-4">
        <Button onClick={() => router.back()}>{"<"} Back</Button>
      </div>

      <div className="flex flex-col justify-center items-center h-screen space-y-8">
        <h1 className="text-4xl">Pick an activity</h1>

        <div className="flex flex-row space-x-8">
          <Card className="flex flex-col w-96 justify-center items-center">
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

          <Card className="flex flex-col w-96 justify-center items-center">
            <CardHeader>
              <CardTitle>Anger Relief Games</CardTitle>

              <CardDescription>
                Anger Relief Games offers a virtual sanctuary for individuals
                seeking solace from the tumultuous waves of anger. Dive into a
                world where frustration transforms into opportunity, and
                challenges become pathways to serenity.
                <br />
                <br />
                With a plethora of engaging games and activities, each
                meticulously crafted to soothe the soul and calm the mind, Anger
                Relief Games provides a safe space for cathartic release and
                transformative growth. Our platform offers an array of immersive
                experiences tailored to meet you where you are on your journey
                to emotional well-being.
                <br />
                <br />
                Say goodbye to pent-up anger and hello to a newfound sense of
                inner peace with Anger Relief Games.
              </CardDescription>
            </CardHeader>

            <CardFooter>
              <Button onClick={() => router.push("/anger/games")}>
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

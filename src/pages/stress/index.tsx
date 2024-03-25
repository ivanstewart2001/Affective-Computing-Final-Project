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

function StressHomePage() {
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
          <Card className="flex flex-col w-96 h-fit justify-center items-center">
            <CardHeader>
              <CardTitle>Guided Meditation</CardTitle>

              <CardDescription>
                Embark on a guided journey through tranquil landscapes of the
                mind. Our Guided Meditation Exercise is a soothing audio voyage
                designed to transport you away from the tumults of daily life
                into a state of peaceful reflection.
                <br />
                <br />
                As you follow the gentle voice of our guide, you&apos;ll be led
                through a series of visualizations and mindfulness techniques
                that aim to release tension, enhance inner calm, and restore
                balance. This meditation is perfect for beginners and seasoned
                practitioners alike, providing a moment of quietude in your busy
                day.
                <br />
                <br />
                Allow yourself this time to reconnect with your inner peace.
                Select this exercise, close your eyes, and let the journey
                begin.
              </CardDescription>
            </CardHeader>

            <CardFooter>
              <Button onClick={() => router.push("/stress/guided-meditation")}>
                Select
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col w-96 h-fit justify-center items-center">
            <CardHeader>
              <CardTitle>Breathing Exercise</CardTitle>

              <CardDescription>
                In the midst of chaos, a single breath can be a powerful anchor.
                Our Breath of Calm exercise is designed to bring you back to
                your center through the simple, yet profound act of focused
                breathing.
                <br />
                <br />
                Over the course of a few minutes, you&apos;ll be guided through
                a series of deep, rhythmic breaths that aim to slow down the
                mind, relax the body, and reduce stress. This exercise is an
                excellent tool for anyone looking to find a quick respite from
                the stresses of everyday life or to enhance their overall
                well-being.
                <br />
                <br />
                Whether you&apos;re at home, at work, or on the go, take a
                moment to immerse yourself in this practice. Begin this exercise
                now, and let each breath guide you towards tranquility.
              </CardDescription>
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

export default StressHomePage;

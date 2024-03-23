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

function HomePage() {
  const router = useRouter();

  return (
    <>
      <Header />

      <div className="flex flex-col justify-center items-center h-screen space-y-8">
        <h1 className="text-4xl">
          What emotion are you currently experiencing?
        </h1>

        <div className="flex flex-row space-x-8">
          <Card className="flex flex-col w-96 h-fit justify-center items-center">
            <CardHeader>
              <CardTitle>Anger</CardTitle>

              <CardDescription>
                If you&apos;re feeling the heat of anger boiling within,
                you&apos;re not alone. This space is designed for you to explore
                that fiery emotion.
                <br />
                <br />
                Whether it&apos;s a spark or a blaze, we&apos;re here to help
                you understand and navigate through your anger. Tap into
                resources, exercises, and reflections tailored to cool down the
                flames and find your calm.
                <br />
                <br />
                Let&apos;s transform that energy into something positive
                together. Select this box to begin.
              </CardDescription>
            </CardHeader>

            <CardFooter>
              <Button onClick={() => router.push("/anger")}>Select</Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col w-96 h-fit justify-center items-center">
            <CardHeader>
              <CardTitle>Stress</CardTitle>

              <CardDescription>
                Feeling like you&apos;re carrying the weight of the world?
                Stress can be overwhelming, but this is your sanctuary to unload
                and unwind.
                <br />
                <br />
                We&apos;ve gathered tools and techniques aimed at diffusing
                stress, allowing you to breathe easier and regain clarity.
                Whether it&apos;s work, relationships, or just the daily grind
                getting to you, we&apos;re here to support your journey towards
                peace and balance.
                <br />
                <br />
                Choose this box to start your path to relief.
              </CardDescription>
            </CardHeader>

            <CardFooter>
              <Button onClick={() => router.push("/stress")}>Select</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}

export default HomePage;

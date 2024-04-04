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
              <CardTitle>Break Room</CardTitle>

              <CardDescription>
                The Break Room is your digital haven for relaxation and
                rejuvenation, offering a serene escape from the stresses of
                daily life. Immerse yourself in tranquil activities like guided
                meditation and creative expression, or connect with others in
                virtual lounges for support and camaraderie. Step into a
                peaceful oasis where you can unwind, recharge, and find moments
                of tranquility amidst the hustle and bustle of the world.
              </CardDescription>
            </CardHeader>

            <CardFooter>
              <Button onClick={() => router.push("/anger/games/breakRoom")}>
                Select
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col w-96 justify-center items-center">
            <CardHeader>
              <CardTitle>Another Anger Relief Games</CardTitle>

              <CardDescription>TODO</CardDescription>
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

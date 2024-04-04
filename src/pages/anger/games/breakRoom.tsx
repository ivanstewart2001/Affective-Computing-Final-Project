import { Button } from "@/components/ui/button";
import Header from "@/custom-components/Header";
import { useRouter } from "next/router";

export default function BreakRoom() {
  const router = useRouter();

  return (
    <>
      <Header />

      <div className="m-4">
        <Button onClick={() => router.back()}>{"<"} Back</Button>
      </div>

      <div className="flex flex-col ml-32 mr-32 justify-center items-center h-[80vh] border-2">
        <iframe
          className="w-full h-full"
          src="https://rjingwi.github.io/TherHappy-Breakroom/"
        ></iframe>
      </div>
    </>
  );
}

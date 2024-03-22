import { useRouter } from "next/router";

function HomePage() {
  const router = useRouter();

  return (
    <div>
      <h1>What emotion are you currently experiencing?</h1>

      <div>
        <div onClick={() => router.push("/anger")}>Anger</div>

        <div onClick={() => router.push("/stress")}>Stress</div>
      </div>
    </div>
  );
}

export default HomePage;

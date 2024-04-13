import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useRef, useState } from "react";
import { useExternalScript } from "../helpers/ai-sdk/externalScriptsLoader";
import { getAiSdkControls } from "../helpers/ai-sdk/loader";
import { useRouter } from "next/router";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // const [gender, setGender] = useState("");
  const gender = useRef("");
  const age = useRef(0);
  const dominantEmotion = useRef("");

  const angry = useRef(0);
  const disgust = useRef(0);
  const fear = useRef(0);
  const happy = useRef(0);
  const sad = useRef(0);
  const surprise = useRef(0);
  const neutral = useRef(0);

  const arousal = useRef(0);
  const valence = useRef(0);
  const attention = useRef(0);

  const mphToolsState = useExternalScript(
    "https://sdk.morphcast.com/mphtools/v1.0/mphtools.js"
  );
  const aiSdkState = useExternalScript(
    "https://ai-sdk.morphcast.com/v1.16/ai-sdk.js"
  );
  const videoEl = useRef<HTMLElement | null>(null);

  useEffect(() => {
    async function getAiSdk() {
      if (aiSdkState === "ready" && mphToolsState === "ready") {
        const { source, start } = await getAiSdkControls();
        await source.useCamera({
          toVideoElement: document.getElementById("videoEl"),
        });
        await start();
      }
    }

    if (
      router.pathname.includes("home") ||
      router.pathname.includes("stress") ||
      router.pathname.includes("anger")
    ) {
      videoEl.current = document.getElementById("videoEl");
      getAiSdk();
    }
  }, [aiSdkState, mphToolsState]);

  useEffect(() => {
    if (
      router.pathname.includes("home") ||
      router.pathname.includes("stress") ||
      router.pathname.includes("anger")
    ) {
      // Function to start tracking and stop after 30 seconds
      const trackAndStop = () => {
        trackData();
        setTimeout(removeAllEventListeners, 30 * 1000);
      };

      // Run trackAndStop once immediately
      trackAndStop();

      // Then run it every 5 minutes
      const intervalId = setInterval(trackAndStop, 5 * 60 * 1000);

      localStorage.setItem("intervalId", intervalId.toString());
    }

    const intervalId = parseInt(localStorage.getItem("intervalId") || "0");
    // Clear interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  function trackData() {
    console.log("TRACKING DATA");

    trackGender();
    trackAge();
    trackDominantEmotion();
    trackAllEmotions();
    trackEngagement();
  }

  function trackGender() {
    const genderHandler = (evt: any) => {
      if (gender.current === "") {
        gender.current = evt.detail.output.mostConfident || "";
      }
    };

    window.addEventListener("CY_FACE_GENDER_RESULT", genderHandler);
  }

  function trackAge() {
    window.addEventListener("CY_FACE_AGE_RESULT", (evt: any) => {
      if (age.current === 0) {
        const ageComp = Math.floor(evt.detail.output.numericAge) || 0;
        age.current = ageComp;
      }
    });
  }

  function trackDominantEmotion() {
    window.addEventListener("CY_FACE_EMOTION_RESULT", (evt: any) => {
      if (dominantEmotion.current === "") {
        dominantEmotion.current = evt.detail.output.dominantEmotion || "";
      }
    });
  }

  function trackAllEmotions() {
    window.addEventListener("CY_FACE_EMOTION_RESULT", (evt: any) => {
      if (!angry.current) {
        // console.log("Angry", evt.detail.output.emotion.Angry * 100);
        angry.current = evt.detail.output.emotion.Angry * 100 || 0;
      }

      if (!disgust.current) {
        // console.log("Disgust", evt.detail.output.emotion.Disgust * 100);
        disgust.current = evt.detail.output.emotion.Disgust * 100 || 0;
      }

      if (!fear.current) {
        // console.log("Fear", evt.detail.output.emotion.Fear * 100);
        fear.current = evt.detail.output.emotion.Fear * 100 || 0;
      }

      if (!happy.current) {
        // console.log("Happy", evt.detail.output.emotion.Happy * 100);
        happy.current = evt.detail.output.emotion.Happy * 100 || 0;
      }

      if (!sad.current) {
        // console.log("Sad", evt.detail.output.emotion.Sad * 100);
        sad.current = evt.detail.output.emotion.Sad * 100 || 0;
      }

      if (!surprise.current) {
        // console.log("Surprise", evt.detail.output.emotion.Surprise * 100);
        surprise.current = evt.detail.output.emotion.Surprise * 100 || 0;
      }

      if (!neutral.current) {
        // console.log("Neutral", evt.detail.output.emotion.Neutral * 100);
        neutral.current = evt.detail.output.emotion.Neutral * 100 || 0;
      }
    });
  }

  function trackEngagement() {
    window.addEventListener("CY_FACE_AROUSAL_VALENCE_RESULT", (evt: any) => {
      if (!arousal.current) {
        // console.log("Arousal", Math.abs(evt.detail.output.arousal * 100) || 0);
        arousal.current = Math.abs(evt.detail.output.arousal * 100) || 0;
      }

      if (!valence.current) {
        // console.log("Valence", Math.abs(evt.detail.output.valence * 100) || 0);
        valence.current = Math.abs(evt.detail.output.valence * 100) || 0;
      }
    });

    window.addEventListener("CY_FACE_ATTENTION_RESULT", (evt: any) => {
      if (!attention.current) {
        // console.log("Attention", evt.detail.output.attention * 100 || 0);
        attention.current = evt.detail.output.attention * 100 || 0;
      }
    });
  }

  function removeAllEventListeners() {
    console.log("REMOVE ALL EVENT LISTENERS", {
      gender: gender.current,
      age: age.current,
      dominantEmotion: dominantEmotion.current,
      angry: angry.current,
      disgust: disgust.current,
      fear: fear.current,
      happy: happy.current,
      sad: sad.current,
      surprise: surprise.current,
      neutral: neutral.current,
      arousal: arousal.current,
      valence: valence.current,
      attention: attention.current,
    });

    let userId = "";

    const prefix = `realm-web:app(${process.env.NEXT_PUBLIC_REALM_APP_ID})`;
    Object.keys(localStorage)
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => {
        const match = key.match(/user\((.*?)\):accessToken/);
        if (key.includes("accessToken") && match) {
          userId = match[1];
        }
      });

    fetch("/api/sendEmotionData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gender: gender.current,
        age: age.current,
        dominantEmotion: dominantEmotion.current,
        angry: angry.current,
        disgust: disgust.current,
        fear: fear.current,
        happy: happy.current,
        sad: sad.current,
        surprise: surprise.current,
        neutral: neutral.current,
        arousal: arousal.current,
        valence: valence.current,
        attention: attention.current,
        userId,
        timeStamp: new Date().getTime(),
      }),
    });

    window.removeEventListener("CY_FACE_GENDER_RESULT", () => {
      gender.current = "";
    });

    window.removeEventListener("CY_FACE_AGE_RESULT", () => {
      age.current = 0;
    });

    window.removeEventListener("CY_FACE_EMOTION_RESULT", () => {
      angry.current = 0;
      disgust.current = 0;
      fear.current = 0;
      happy.current = 0;
      sad.current = 0;
      surprise.current = 0;
      neutral.current = 0;
      dominantEmotion.current = "";
    });

    window.removeEventListener("CY_FACE_EMOTION_RESULT", () => {
      angry.current = 0;
      disgust.current = 0;
      fear.current = 0;
      happy.current = 0;
      sad.current = 0;
      surprise.current = 0;
      neutral.current = 0;
      dominantEmotion.current = "";
    });

    window.removeEventListener("CY_FACE_AROUSAL_VALENCE_RESULT", () => {
      arousal.current = 0;
      valence.current = 0;
    });

    window.removeEventListener("CY_FACE_ATTENTION_RESULT", () => {
      attention.current = 0;
    });
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <Toaster />
    </QueryClientProvider>
  );
}

import { Button } from "@/components/ui/button";
import ActivityWrapperWithTimer from "@/custom-components/ActivityWrapperWithTimer";
import Header from "@/custom-components/Header";
import { STRESS_SURVEY_QUESTIONS } from "@/utils/survey-questions/stress";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

const millisecondsPerStep = 15000;
const steps = [
  "Take a moment to find a comfortable sitting or lying position. Close your eyes gently and bring your attention to your breath.",
  "Inhale deeply through your nose, filling your lungs with air. Feel your chest and abdomen expand as you breathe in.",
  "Hold your breath for a moment at the top of your inhale. Allow yourself to fully experience the sensation of being filled with air.",
  "Exhale slowly and completely through your mouth, emptying your lungs of air. Feel your chest and abdomen contract as you breathe out.",
  "Pause for a moment at the bottom of your exhale. Notice the stillness and calmness that follows each breath.",
  "Repeat the cycle of deep inhales, brief holds, slow exhales, and pauses. Focus on the rhythm of your breath and let go of any tension or distractions.",
  "After several cycles of deep breathing, gradually bring your awareness back to your surroundings. Take a moment to notice how you feel after completing the exercise.",
];
// 20*7 = 140 seconds
const numberOfSeconds = (millisecondsPerStep / 1000) * steps.length;
const videoId = "vNeRn90QjyA";
const videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;

function BreathingExercise() {
  const router = useRouter();

  const [timer, setTimer] = useState(numberOfSeconds); // Initial timer value: 105 seconds
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const timeoutIds = useRef<NodeJS.Timeout[]>([]); // Store all timeout IDs

  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);
  const [backgroundAudio, setBackgroundAudio] =
    useState<HTMLAudioElement | null>(null);

  const [preSurveyCompleted, setPreSurveyCompleted] = useState(false);
  const [postSurveyCompleted, setPostSurveyCompleted] = useState(false);

  const [ended, setEnded] = useState(false);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // it's no longer the first render
      return;
    }

    return () => {
      if (!isFirstRender.current) {
        console.log("Unmounting breathing exercise component");

        resetMeditation();
      }
    };
  }, []);

  function startMeditation() {
    const backgroundAudioFile = "/assets/audio/ocean-waves.mp3";
    const audio = new Audio(backgroundAudioFile);
    audio.loop = true;
    audio.volume = 0.5;

    setBackgroundAudio(audio);

    audio.play();

    const id = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);
    setIntervalId(id);

    const currentSynth = window.speechSynthesis;
    setSynth(currentSynth);

    const utterance = new SpeechSynthesisUtterance();

    // Speak the meditation steps
    steps.forEach((step, index) => {
      const tid = setTimeout(() => {
        utterance.rate = 0.8;
        utterance.text = step;

        currentSynth.speak(utterance);
      }, index * millisecondsPerStep); // Speak each step every 15 seconds

      timeoutIds.current.push(tid);
    });
  }

  if (timer === 0) {
    console.log("Breathing exercise session completed.");
    resetMeditationIntervals();
  }

  function resetMeditationIntervals() {
    if (intervalId) {
      clearInterval(intervalId); // Clear the interval
    }

    if (synth) {
      console.log("Cancelling speech synthesis");

      if (synth.speaking) {
        // only if speaking
        console.log("Cancelling speech synthesis");
        synth.pause(); // pause first
        synth.cancel();
      } else {
        synth.cancel();
      }
    }

    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];

    if (backgroundAudio) {
      backgroundAudio.pause();
    }
  }

  function resetMeditation() {
    resetMeditationIntervals();

    setTimer(numberOfSeconds); // Reset the timer
    setIntervalId(null);
    setSynth(null);
    setBackgroundAudio(null);

    setEnded(true);
  }

  return (
    <>
      <Header />

      <div className="m-4">
        <Button onClick={() => router.back()}>{"<"} Back</Button>
      </div>

      <ActivityWrapperWithTimer
        title="Breathing Exercise"
        subTitle="Click the start button to begin the breathing exercise session."
        startFunction={startMeditation}
        endFunction={resetMeditation}
        startCondition={timer === numberOfSeconds}
        finishedCondition={timer === 0}
        timer={timer}
        preSurveyCompleted={preSurveyCompleted}
        postSurveyCompleted={postSurveyCompleted}
        setPostSurveyCompleted={setPostSurveyCompleted}
        setPreSurveyCompleted={setPreSurveyCompleted}
        ended={ended}
        surveyData={STRESS_SURVEY_QUESTIONS}
        setEnded={setEnded}
      >
        {timer === 0 ? (
          <p>Meditation session completed.</p>
        ) : timer <= numberOfSeconds && preSurveyCompleted ? (
          <iframe
            width="560"
            height="315"
            src={videoSrc}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : null}
      </ActivityWrapperWithTimer>
    </>
  );
}

export default BreathingExercise;

import ActivityWrapperWithTimer from "@/custom-components/ActivityWrapperWithTimer";
import React, { useEffect, useRef, useState } from "react";

// 15*7 = 105 seconds
const numberOfSeconds = 105;
const steps = [
  "Close your eyes and take a deep breath in, filling your lungs with fresh air.",
  "As you exhale, release any tension or stress from your body.",
  "Continue to breathe deeply and slowly, letting go of any thoughts or worries.",
  "Imagine yourself in a peaceful place, surrounded by tranquility and serenity.",
  "Feel a sense of calmness and relaxation washing over you with each breath.",
  "Stay in this state of relaxation for the next 15 seconds.",
  "When you're ready, gently open your eyes and return to the present moment.",
];
const videoId = "vNeRn90QjyA";
const videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;

function GuidedMeditation() {
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
        console.log("Unmounting guided meditation component");

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
      }, index * 15000); // Speak each step every 15 seconds

      timeoutIds.current.push(tid);
    });
  }

  if (timer === 0) {
    console.log("Meditation session completed.");
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
    <ActivityWrapperWithTimer
      title="Guided Meditation"
      subTitle="Click the start button to begin the guided meditation session."
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
  );
}

export default GuidedMeditation;

import ActivityWrapperWithTimer from "@/custom-components/ActivityWrapperWithTimer";
import Header from "@/custom-components/Header";
import { STRESS_SURVEY_QUESTIONS } from "@/utils/survey-questions/stress";
import React, { useEffect, useRef, useState } from "react";

const millisecondsPerStep = 20000;
const steps = [
  "Begin by setting your intention for this meditation. Take a moment to reflect on what you hope to gain from this experience and what you'd like to focus on.",
  "Imagine yourself standing barefoot on a lush green meadow. Feel the soft grass beneath your feet and the warm sun on your skin. With each breath, feel yourself becoming more rooted and grounded in the present moment.",
  "Visualize a serene pathway leading you deeper into the heart of a tranquil forest. As you walk along the path, notice the sights, sounds, and smells of nature surrounding you. Allow yourself to let go of any tension or stress with each step you take.",
  "Find a comfortable spot in the forest to rest and observe your surroundings. Listen to the gentle rustle of leaves, the chirping of birds, and the babbling of a nearby stream. Feel a sense of peace and connection with the natural world around you.",
  "Imagine yourself holding a small bundle of worries and concerns in your hands. With each breath, visualize releasing these burdens into a nearby river, watching them float away downstream. Feel a sense of lightness and relief as you let go of what no longer serves you.",
  "Visualize yourself arriving at a tranquil sanctuary deep within the forest. This sanctuary is a place of inner peace and serenity, where you can retreat whenever you need to find balance and clarity. Take a moment to explore this sacred space and make it your own.",
  "Reflect on the journey you've taken during this meditation. Express gratitude for the opportunity to connect with yourself and the natural world. Notice any insights or revelations that have emerged during the practice.",
  "Slowly begin to bring your awareness back to the present moment. Wiggle your fingers and toes, take a deep breath, and gently open your eyes. Carry the sense of peace and tranquility you've cultivated with you as you go about your day.",
];
// 20*8 = 160 seconds
const numberOfSeconds = (millisecondsPerStep / 1000) * steps.length;
const videoId = "UV0mhY2Dxr0";
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
    const backgroundAudioFile = "/assets/audio/birds-chirping.mp3";
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
    <>
      <Header />

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

export default GuidedMeditation;

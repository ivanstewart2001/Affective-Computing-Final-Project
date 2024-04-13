import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/router";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

interface ActivityWrapperProps {
  title: string;
  subTitle: string;
  startFunction: () => void;
  endFunction: () => void;
  startCondition: boolean;
  finishedCondition: boolean;
  timer: number;
  setPreSurveyCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setPostSurveyCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  preSurveyCompleted: boolean;
  postSurveyCompleted: boolean;
  ended: boolean;
  setEnded: React.Dispatch<React.SetStateAction<boolean>>;
  surveyData: string[];
  children: React.ReactNode;
}

function ActivityWrapperWithTimer({
  title,
  subTitle,
  children,
  startFunction,
  endFunction,
  startCondition,
  timer,
  finishedCondition,
  setPostSurveyCompleted,
  setPreSurveyCompleted,
  postSurveyCompleted,
  preSurveyCompleted,
  ended,
  surveyData,
  setEnded,
}: ActivityWrapperProps) {
  const router = useRouter();

  const [startClicked, setStartClicked] = useState(false);
  const [preSurveyFinalResult, setPreSurveyFinalResult] = useState(0);
  const [postSurveyFinalResult, setPostSurveyFinalResult] = useState(0);

  function PreSurvey() {
    let result1 = 1;
    let result2 = 1;
    let result3 = 1;

    function Questions() {
      function QuestionOne() {
        return (
          <div className="flex flex-col space-y-4 items-center">
            <h1 className="text-lg">{surveyData[0]}</h1>

            <RadioGroup
              defaultValue="1"
              className="flex flex-row w-full justify-between"
              onValueChange={(value) => {
                result1 = Number(value);
              }}
            >
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="1" id="option-one" />
                <Label htmlFor="option-one">1</Label>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="2" id="option-two" />
                <Label htmlFor="option-two">2</Label>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="3" id="option-three" />
                <Label htmlFor="option-three">3</Label>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="4" id="option-four" />
                <Label htmlFor="option-four">4</Label>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="5" id="option-five" />
                <Label htmlFor="option-five">5</Label>
              </div>
            </RadioGroup>

            <div className="flex flex-row justify-between w-full">
              <p>Not Calm</p>
              <p>Very Calm</p>
            </div>
          </div>
        );
      }

      function QuestionTwo() {
        return (
          <div className="flex flex-col space-y-4 items-center">
            <h1 className="text-lg">{surveyData[1]}</h1>

            <RadioGroup
              defaultValue="1"
              className="flex flex-row w-full justify-between"
              onValueChange={(value) => {
                result2 = Number(value);
              }}
            >
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="1" id="option-one" />
                <Label htmlFor="option-one">1</Label>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="2" id="option-two" />
                <Label htmlFor="option-two">2</Label>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="3" id="option-three" />
                <Label htmlFor="option-three">3</Label>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="4" id="option-four" />
                <Label htmlFor="option-four">4</Label>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="5" id="option-five" />
                <Label htmlFor="option-five">5</Label>
              </div>
            </RadioGroup>

            <div className="flex flex-row justify-between w-full">
              <p>Not Overwhelmed</p>
              <p>Very Overwelmed</p>
            </div>
          </div>
        );
      }

      function QuestionThree() {
        return (
          <div className="flex flex-col space-y-4 items-center">
            <h1 className="text-lg">{surveyData[2]}</h1>

            <RadioGroup
              defaultValue="1"
              className="flex flex-row w-full justify-between"
              onValueChange={(value) => {
                result3 = Number(value);
              }}
            >
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="1" id="option-one" />
                <Label htmlFor="option-one">1</Label>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="2" id="option-two" />
                <Label htmlFor="option-two">2</Label>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="3" id="option-three" />
                <Label htmlFor="option-three">3</Label>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="4" id="option-four" />
                <Label htmlFor="option-four">4</Label>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="5" id="option-five" />
                <Label htmlFor="option-five">5</Label>
              </div>
            </RadioGroup>

            <div className="flex flex-row justify-between w-full">
              <p>Not Anxious</p>
              <p>Very Anxious</p>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          <QuestionOne />
          <hr />
          <QuestionTwo />
          <hr />
          <QuestionThree />
        </div>
      );
    }

    return (
      <Dialog open={!preSurveyCompleted}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Pre Survey</DialogTitle>
          </DialogHeader>

          <Questions />

          <DialogFooter>
            <Button
              onClick={() => {
                setPreSurveyCompleted(true);
                startFunction();
                setStartClicked(false);
                setEnded(false);

                const finalResult = ((result1 + result2 + result3) / 3).toFixed(
                  2
                );
                console.log("Pre Survey Final Result: ", finalResult);
                setPreSurveyFinalResult(Number(finalResult));
              }}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  function PostSurvey() {
    let result1 = 1;
    let result2 = 1;
    let result3 = 1;

    function Questions() {
      function QuestionOne() {
        return (
          <div className="flex flex-col space-y-4 items-center">
            <h1 className="text-lg">{surveyData[0]}</h1>

            <RadioGroup
              defaultValue="1"
              className="flex flex-row w-full justify-between"
              onValueChange={(value) => {
                result1 = Number(value);
              }}
            >
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="1" id="option-one" />
                <Label htmlFor="option-one">1</Label>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="2" id="option-two" />
                <Label htmlFor="option-two">2</Label>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="3" id="option-three" />
                <Label htmlFor="option-three">3</Label>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="4" id="option-four" />
                <Label htmlFor="option-four">4</Label>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="5" id="option-five" />
                <Label htmlFor="option-five">5</Label>
              </div>
            </RadioGroup>

            <div className="flex flex-row justify-between w-full">
              <p>Not Calm</p>
              <p>Very Calm</p>
            </div>
          </div>
        );
      }

      function QuestionTwo() {
        return (
          <div className="flex flex-col space-y-4 items-center">
            <h1 className="text-lg">{surveyData[1]}</h1>

            <RadioGroup
              defaultValue="1"
              className="flex flex-row w-full justify-between"
              onValueChange={(value) => {
                result2 = Number(value);
              }}
            >
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="1" id="option-one" />
                <Label htmlFor="option-one">1</Label>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="2" id="option-two" />
                <Label htmlFor="option-two">2</Label>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="3" id="option-three" />
                <Label htmlFor="option-three">3</Label>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="4" id="option-four" />
                <Label htmlFor="option-four">4</Label>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="5" id="option-five" />
                <Label htmlFor="option-five">5</Label>
              </div>
            </RadioGroup>

            <div className="flex flex-row justify-between w-full">
              <p>Not Overwhelmed</p>
              <p>Very Overwelmed</p>
            </div>
          </div>
        );
      }

      function QuestionThree() {
        return (
          <div className="flex flex-col space-y-4 items-center">
            <h1 className="text-lg">{surveyData[2]}</h1>

            <RadioGroup
              defaultValue="1"
              className="flex flex-row w-full justify-between"
              onValueChange={(value) => {
                result3 = Number(value);
              }}
            >
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="1" id="option-one" />
                <Label htmlFor="option-one">1</Label>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="2" id="option-two" />
                <Label htmlFor="option-two">2</Label>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="3" id="option-three" />
                <Label htmlFor="option-three">3</Label>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="4" id="option-four" />
                <Label htmlFor="option-four">4</Label>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="5" id="option-five" />
                <Label htmlFor="option-five">5</Label>
              </div>
            </RadioGroup>

            <div className="flex flex-row justify-between w-full">
              <p>Not Anxious</p>
              <p>Very Anxious</p>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          <QuestionOne />
          <hr />
          <QuestionTwo />
          <hr />
          <QuestionThree />
        </div>
      );
    }

    return (
      <Dialog open={preSurveyCompleted && (ended || timer === 0)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Post Survey</DialogTitle>
          </DialogHeader>

          <Questions />

          <DialogFooter>
            <Button
              onClick={async () => {
                setPreSurveyCompleted(false);

                const finalResult = ((result1 + result2 + result3) / 3).toFixed(
                  2
                );

                console.log("Post Survey Final Result: ", finalResult);
                setPostSurveyFinalResult(Number(finalResult));

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

                await fetch("/api/sendProgressReport", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    userId,
                    page: router.pathname.includes("breathing")
                      ? "BREATHING"
                      : "MEDITATION",
                    preSurvey: preSurveyFinalResult,
                    postSurvey: postSurveyFinalResult,
                  }),
                });
              }}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      {!preSurveyCompleted && startClicked ? <PreSurvey /> : null}
      {preSurveyCompleted && (ended || timer === 0) ? <PostSurvey /> : null}

      <Card className="flex flex-col w-fit h-fit justify-center text-center items-center">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{subTitle}</CardDescription>

          <div className="flex justify-between items-center">
            <p>Timer: {timer} seconds</p>

            {!startCondition ? (
              <Button className="w-fit" onClick={endFunction}>
                {finishedCondition ? "Reset" : "Stop"}
              </Button>
            ) : null}
          </div>
        </CardHeader>

        <CardContent>
          {startCondition ? (
            <div className="space-x-4">
              <Button onClick={() => router.back()}>Back</Button>
              <Button
                onClick={() => {
                  setStartClicked(true);
                }}
              >
                Start
              </Button>
            </div>
          ) : (
            <div>{children}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ActivityWrapperWithTimer;

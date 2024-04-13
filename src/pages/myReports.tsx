import { Button } from "@/components/ui/button";
import Header from "@/custom-components/Header";
import { useRouter } from "next/router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, getMonth } from "date-fns";
import { Label } from "@/components/ui/label";
import NoResultsFound from "@/custom_components/NotFound";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import toastUtil from "@/utils/toastUtil";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "react-query";
import { GetServerSideProps } from "next";
import { routeValidation } from "@/utils/routeValidation";

function TimeOnApp(props: { graphData: Array<any> }) {
  const { toast } = useToast();

  const [dateType, setDateType] = useState<"WEEK" | "MONTH">("WEEK");

  const [graphData, setGraphData] = useState(props.graphData || []);

  const fetchGraphDataMutation = useMutation(
    async () => {
      const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;

      if (!REALM_APP_ID) {
        throw new Error(
          'Invalid/Missing environment variable: "NEXT_PUBLIC_REALM_APP_ID"'
        );
      }

      let userId = "";

      const prefix = `realm-web:app(${REALM_APP_ID})`;
      Object.keys(localStorage)
        .filter((key) => key.startsWith(prefix))
        .forEach((key) => {
          const match = key.match(/user\((.*?)\):accessToken/);
          if (key.includes("accessToken") && match) {
            userId = match[1];
          }
        });

      const res = await fetch("/api/getTimeOnAppData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          dateType,
        }),
      });

      return res.json();
    },
    {
      onError: (err: Error) => {
        toastUtil({
          timeoutMs: 3000,
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          toast,
          description: err.message,
        });
      },
      onSuccess: async (data) => {
        console.log(data);
        setGraphData(data.timeOnAppData);
      },
    }
  );

  const data = graphData.map((count) => {
    const weekDay = Object.keys(count)[0];
    const countValue = count[weekDay];

    return {
      name: weekDay,
      count: countValue,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time on App</CardTitle>

        <CardDescription className="flex flex-row items-center justify-end">
          <div className="m-2">
            <Label
              htmlFor="denomination"
              className="flex flex-row justify-between mb-2"
            >
              Date Type
            </Label>

            <Select
              value={dateType}
              onValueChange={(e: any) => setDateType(e as any)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>

              <SelectContent className="h-1/2">
                <SelectGroup>
                  {["Week", "Month"].map((val, index) => {
                    return (
                      <SelectItem value={val.toUpperCase()} key={index}>
                        {val}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="m-2">
            <Button
              disabled={fetchGraphDataMutation.isLoading}
              onClick={() => fetchGraphDataMutation.mutate()}
            >
              Submit
            </Button>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="w-full h-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" aspect={3}>
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              {/* name here means the key name from the data */}
              <XAxis dataKey="name" />
              <YAxis
                label={{
                  value: "minutes",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <NoResultsFound />
        )}
      </CardContent>
    </Card>
  );
}

function Emotions(props: { emotionData: Array<any> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Emotions</CardTitle>
      </CardHeader>

      <CardContent>
        {props.emotionData.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {props.emotionData
              .sort((a, b) => {
                return new Date(b._id).getTime() - new Date(a._id).getTime();
              })
              .map((emotion, index) => {
                const dominantEmotion = Array.from(
                  new Set(emotion.dominantEmotion.flat())
                ).join(", ");

                return (
                  <div key={index} className="border-2 rounded-md p-4">
                    <p className="text-xl font-bold">Date: {emotion._id}</p>
                    <p>Dominant Emotion: {dominantEmotion as any}</p>
                    <p>Angry: {Number(emotion.angry).toFixed(2)}</p>
                    <p>Disgust: {Number(emotion.disgust).toFixed(2)}</p>
                    <p>Fear: {Number(emotion.fear).toFixed(2)}</p>
                    <p>Happy: {Number(emotion.happy).toFixed(2)}</p>
                    <p>Sad: {Number(emotion.sad).toFixed(2)}</p>
                    <p>Surprise: {Number(emotion.surprise).toFixed(2)}</p>
                    <p>Neutral: {Number(emotion.neutral).toFixed(2)}</p>
                    <p>Arousal: {Number(emotion.arousal).toFixed(2)}</p>
                    <p>Valence: {Number(emotion.valence).toFixed(2)}</p>
                  </div>
                );
              })}
          </div>
        ) : (
          <NoResultsFound />
        )}
      </CardContent>
    </Card>
  );
}

function Overview(props: { graphData: Array<any>; emotionData: Array<any> }) {
  return (
    <div className="space-y-10">
      <TimeOnApp graphData={props.graphData} />

      <Emotions emotionData={props.emotionData} />
    </div>
  );
}

function ProgressReports(props: { progressReport: Array<any> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Reports</CardTitle>

        <CardDescription className="space-y-2">
          <p>
            Progress reports are a way to track your progress over time. You can
            compare your pre-survey and post-survey scores to see how
            you&apos;ve improved.
          </p>

          <div className="flex flex-row space-x-2">
            <p className="bg-green-200 w-fit p-2 rounded-md">Improvement</p>
            <p className="bg-yellow-200 w-fit p-2 rounded-md">No Change</p>
            <p className="bg-red-200 w-fit p-2 rounded-md">Decline</p>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent>
        {props.progressReport.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {props.progressReport.map((progressReport, index) => {
              return (
                <div
                  key={index}
                  className={`border-2 rounded-md p-4 ${
                    progressReport.preSurvey < progressReport.postSurvey
                      ? "bg-green-200"
                      : progressReport.preSurvey > progressReport.postSurvey
                      ? "bg-red-200"
                      : "bg-yellow-200"
                  }`}
                >
                  <p className="text-xl font-bold">
                    Date:{" "}
                    {new Date(progressReport.timeStamp).toLocaleDateString(
                      "en-CA"
                    )}
                  </p>
                  <p>Type: {progressReport.page}</p>
                  <p>Pre Survey: {progressReport.preSurvey}</p>
                  <p>Post Survey: {progressReport.postSurvey}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <NoResultsFound />
        )}
      </CardContent>
    </Card>
  );
}

function MyReportsPage(props: {
  graphData: Array<any>;
  emotionData: Array<any>;
  progressReport: Array<any>;
}) {
  const router = useRouter();

  return (
    <>
      <Header />

      <div className="m-4">
        <Button onClick={() => router.back()}>{"<"} Back</Button>
      </div>

      <div className="ml-20 mr-20">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progressReports">Progress Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="h-full">
            <Overview
              graphData={props.graphData}
              emotionData={props.emotionData}
            />
          </TabsContent>

          <TabsContent value="progressReports">
            <ProgressReports progressReport={props.progressReport} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = routeValidation(
  async (context: any) => {
    const userId = JSON.parse((context as any).userId);

    const START_URL =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_FRONTEND_URL
        : "http://localhost:3000";

    const graphDataRequest = await fetch(`${START_URL}/api/getTimeOnAppData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        dateType: "WEEK",
      }),
    });
    const graphData = await graphDataRequest.json();

    const emotionDataRequest = await fetch(`${START_URL}/api/getEmotionData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
      }),
    });
    const emotionData = await emotionDataRequest.json();

    const progressReportRequest = await fetch(
      `${START_URL}/api/getProgressReport`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      }
    );
    const progressReport = await progressReportRequest.json();

    return {
      props: {
        graphData: graphData.timeOnAppData || [],
        emotionData: emotionData.result || [],
        progressReport: progressReport.result || [],
      },
    };
  }
);

export default MyReportsPage;

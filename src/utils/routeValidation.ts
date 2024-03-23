import nookies from "nookies";
import { NextResponse, NextRequest } from "next/server";

export function routeValidation(getServerSideProps: any) {
  return async (context: any) => {
    try {
      const requestedUrl = context.req.url;
      const queryObject = context.query;
      const resolvedUrl = context.resolvedUrl;

      const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;

      const prefix = `realm-web:app(${REALM_APP_ID})`;
      let userId = "";
      let accessToken = "";

      Object.keys(nookies.get(context))
        .filter((key) => key.startsWith(prefix))
        .forEach((key) => {
          const match = key.match(/user\((.*?)\):accessToken/);
          if (key.includes("accessToken") && match) {
            userId = match[1];
            accessToken = nookies.get(context)[key];
          }
        });

      let data;

      if (!userId || !accessToken) {
        throw new Error("Current user not defined");
      }

      //   if (Object.keys(data as any).length === 0) {
      //     throw new Error("Current user not found");
      //   }

      //   const fetchUserData = data as fetchUserReturnType;
      //   const previousUrl = context.req.headers.referer;

      context.accessToken = JSON.stringify(accessToken);
      context.userId = JSON.stringify(userId);

      return await getServerSideProps(context); // Continue on to call `getServerSideProps` logic
    } catch (error: any) {
      nookies.set(context, "ERROR_MESSAGE", error.message, {
        httpOnly: false,
        path: "/",
      });

      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
        // `as never` is required for correct type inference
        // by InferGetServerSidePropsType below
        props: {} as never,
      };
    }
  };
}

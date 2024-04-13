import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Realm from "realm-web";
import nookies from "nookies";
import { getAiSdkControls } from "../../helpers/ai-sdk/loader";

function Header() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  async function stopVideo() {
    const { stop } = await getAiSdkControls();
    stop();
  }

  useEffect(() => {
    const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;

    if (!REALM_APP_ID) {
      throw new Error(
        'Invalid/Missing environment variable: "NEXT_PUBLIC_REALM_APP_ID"'
      );
    }

    const app = new Realm.App({
      id: REALM_APP_ID,
    });

    const user = app.currentUser;

    if (user) {
      setAccessToken(user.accessToken);
    }
  }, []);

  async function logout() {
    try {
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

      await fetch("/api/timeOnApp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });

      const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;

      if (!REALM_APP_ID) {
        throw new Error(
          'Invalid/Missing environment variable: "NEXT_PUBLIC_REALM_APP_ID"'
        );
      }

      const intervalId = parseInt(localStorage.getItem("intervalId") || "0");
      clearInterval(intervalId);
      stopVideo();

      const app = new Realm.App({
        id: REALM_APP_ID,
      });

      app.currentUser?.logOut();

      localStorage.clear();

      Object.keys(localStorage)
        .filter((key) => key.startsWith(prefix))
        .forEach((key) => {
          localStorage.removeItem(key);
        });

      const allCookies = nookies.get(null);

      for (const name in allCookies) {
        nookies.destroy(null, name);
      }

      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link
            href={accessToken ? "/home" : "/"}
            className="text-xl font-bold text-gray-800"
          >
            TherHappy
          </Link>
          <ul className="flex space-x-4">
            {
              //if accessToken user is logged in
              accessToken ? (
                <>
                  <li>
                    <button
                      onClick={() => router.push("/myReports")}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      My Reports
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/login"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signUp"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      SignUp
                    </Link>
                  </li>
                </>
              )
            }
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;

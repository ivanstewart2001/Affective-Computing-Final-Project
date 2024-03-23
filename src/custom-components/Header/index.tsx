import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Realm from "realm-web";
import nookies from "nookies";

function Header() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);

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

  function logout() {
    try {
      const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;

      if (!REALM_APP_ID) {
        throw new Error(
          'Invalid/Missing environment variable: "NEXT_PUBLIC_REALM_APP_ID"'
        );
      }

      const app = new Realm.App({
        id: REALM_APP_ID,
      });

      app.currentUser?.logOut();

      localStorage.clear();

      const prefix = `realm-web:app(${REALM_APP_ID})`; // replace with your prefix
      Object.keys(localStorage)
        .filter((key) => key.startsWith(prefix))
        .forEach((key) => {
          localStorage.removeItem(key);
        });

      const cookies = nookies.get(null);

      for (const name in cookies) {
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
          <Link href="/" className="text-xl font-bold text-gray-800">
            TherHappy
          </Link>
          <ul className="flex space-x-4">
            {
              //if accessToken user is logged in
              accessToken ? (
                <li>
                  <button
                    onClick={logout}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Logout
                  </button>
                </li>
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

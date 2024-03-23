import React, { useState } from "react";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import Header from "@/custom-components/Header";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import toastUtil from "@/utils/toastUtil";
import { useToast } from "@/components/ui/use-toast";
import * as Realm from "realm-web";
import nookies from "nookies";

function LoginPage() {
  const router = useRouter();

  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation(
    async () => {
      const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;

      if (!REALM_APP_ID) {
        throw new Error(
          'Invalid/Missing environment variable: "NEXT_PUBLIC_REALM_APP_ID"'
        );
      }

      const app = new Realm.App({
        id: REALM_APP_ID,
      });

      const credentials = Realm.Credentials.emailPassword(email, password);
      await app.logIn(credentials);

      const prefix = `realm-web:app(${REALM_APP_ID})`;
      Object.keys(localStorage)
        .filter((key) => key.startsWith(prefix))
        .forEach((key) => {
          const value = localStorage.getItem(key);

          if (value) {
            nookies.set(null, key, value, {
              httpOnly: false,
              path: "/",
            });
          }
        });
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
      onSuccess: async () => {
        setEmail("");
        setPassword("");

        router.push("/home");
      },
    }
  );

  // Function to handle form submission
  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!email || !password) {
      toastUtil({
        timeoutMs: 3000,
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        toast,
        description: "Please enter your email and password",
      });
      return;
    }

    loginMutation.mutate();
  };

  return (
    <>
      <Header />

      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Log in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;

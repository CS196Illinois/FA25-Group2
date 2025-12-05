import { useState } from "react";
import { useRouter } from "next/router";
import { Input, Button, Tabs, Tab } from "@heroui/react";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import axios from "axios";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [signInError, setSignInError] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("signin");
  const router = useRouter();

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setSignInError("");

    if (!username || !password) {
      setSignInError("Username and password are required");
      return;
    }

    if (selectedTab == "signup") {
      if (!email) {
        setSignInError("Email is required");
        return;
      }

      if (!emailRegex.test(email)) {
        setSignInError("Please enter a valid email address");
        return;
      }
    }

    setLoading(true);

    try {
      const result = await axios.get("/api/signin", {
        params: { username, password }
      });

      if (result.status == 200) {
        const token = result.data.token;
        window.localStorage.setItem("authToken", token);
        window.localStorage.setItem("username", username);
        router.push("/marketplace");
      } else {

        if (result.status === 401) {
          setSignInError("Incorrect email or password. Please try again.");
        } else {
          setSignInError(
            result.data.error || "Something went wrong. Please try again later.",
          );
        }
      }
    } catch (_) {
      setSignInError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setSignUpError("");
    setSignUpSuccess("");

    if (!email || !password) {
      setSignUpError("Email and password are required");

      return;
    }

    if (!emailRegex.test(email)) {
      setSignUpError("Please enter a valid email address");

      return;
    }

    setLoading(true);

    try {
      const result = await axios.post("/api/signup", { 
        username, email, password
      });

      if (result.status == 200) {
        const token = result.data.token;
        window.localStorage.setItem("authToken", token);
        window.localStorage.setItem("username", username);
        setSignUpSuccess(
          "Sign up successful! Please check your email to verify your account.",
        );
        setTimeout(() => {
          setSelectedTab("signin");
          setSignUpSuccess("");
        }, 3000);
      } else {
        if (result.status === 400) {
          setSignUpError("Please provide an '@illinois.edu' email.");
        }
        const data = result.data;

        setSignUpError(data.error || "Something went wrong");

        if (result.status === 400) {
          setSignUpError("Please provide an '@illinois.edu' email.");
        }
      }
    } catch (error) {
      console.log(error)
      setSignUpError(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Sign in or create an account.</h1>
        </div>

        <div className="w-full max-w-xs">
          <Tabs
            fullWidth
            aria-label="Authentication"
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key)}
          >
            <Tab key="signin" title="Sign In">
              <form
                className="flex flex-col gap-4 mt-4"
                onSubmit={handleSignInSubmit}
              >
                <Input
                  fullWidth
                  disabled={loading}
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  fullWidth
                  disabled={loading}
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button color="primary" disabled={loading} type="submit">
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
                {signInError && <p className="text-danger">{signInError}</p>}
              </form>
            </Tab>
            <Tab key="signup" title="Sign Up">
              <form
                className="flex flex-col gap-4 mt-4"
                onSubmit={handleSignUpSubmit}
              >
                <Input
                  fullWidth
                  disabled={loading}
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  fullWidth
                  disabled={loading}
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  fullWidth
                  disabled={loading}
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button color="primary" disabled={loading} type="submit">
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
                {signUpError && <p className="text-danger">{signUpError}</p>}
                {signUpSuccess && (
                  <p className="text-success">{signUpSuccess}</p>
                )}
              </form>
            </Tab>
          </Tabs>
        </div>
      </section>
    </DefaultLayout>
  );
}
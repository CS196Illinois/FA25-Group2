import { useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");

      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");

      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/");
      } else {
        const data = await res.json();

        if (res.status === 401) {
          setError("Incorrect email or password. Please try again.");
        } else {
          setError(
            data.error || "Something went wrong. Please try again later.",
          );
        }
      }
    } catch (e) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Sign In</h1>
          <h2 className={subtitle({ class: "mt-4" })}>Welcome back.</h2>
        </div>

        <form
          className="flex flex-col gap-4 w-full max-w-xs"
          onSubmit={handleSubmit}
        >
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
            {loading ? "Signing In..." : "Sign In"}
          </Button>
          {error && <p className="text-danger">{error}</p>}
        </form>

        <div className="mt-4 text-center">
          <p>
            Don&apos;t have an account?{" "}
            <NextLink
              className={linkStyles({ color: "primary" })}
              href="/signup"
            >
              Sign Up
            </NextLink>
          </p>
        </div>
      </section>
    </DefaultLayout>
  );
}

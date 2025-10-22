import { useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Email and password are required");

      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        setSuccess(
          "Sign up successful! Please check your email to verify your account.",
        );
        setTimeout(() => {
          router.push("/signin");
        }, 3000);
      } else {
        const data = await res.json();

        setError(data.error || "Something went wrong");
      }
    } catch (_e) {
      setError("Something went wrong");
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Sign Up</h1>
          <h2 className={subtitle({ class: "mt-4" })}>
            Create an account to get started.
          </h2>
        </div>

        <form
          className="flex flex-col gap-4 w-full max-w-xs"
          onSubmit={handleSubmit}
        >
          <Input
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button color="primary" type="submit">
            Sign Up
          </Button>
          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}
        </form>

        <div className="mt-4 text-center">
          <p>
            Already have an account?{" "}
            <NextLink
              className={linkStyles({ color: "primary" })}
              href="/signin"
            >
              Sign In
            </NextLink>
          </p>
        </div>
      </section>
    </DefaultLayout>
  );
}

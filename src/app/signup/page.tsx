"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signin, signup } from "@/services/auth/auth.service";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = React.useState("demo@example.com");
  const [password, setPassword] = React.useState("demopass");
  const [givenName, setGivenName] = React.useState("Max");
  const [familyName, setFamilyName] = React.useState("Robinson");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // signup
    const signupResults = await signup({
      email,
      password,
      givenName,
      familyName,
    });

    console.log("signupResults", signupResults);

    const { email: signupEmail, message } = signupResults;

    if (!signupEmail) {
      alert(message);
      return;
    }

    alert(
      "Signup successful, Signing-in automatically for now, Later check your email to verify your account.",
    );

    // signin
    const signinResults = await signin({ email: signupEmail, password });

    const {
      expires_in,
      access_token,
      refresh_token,
      message: signinMessage,
    } = signinResults;

    console.log("/login response:", signinResults);

    if (!access_token || !refresh_token || !expires_in) {
      // Show an error message to the user
      alert(signinMessage || "access_token is missing");
      throw new Error(signinMessage || "access_token is missing");
    }
    // if the login is successful, store the token in the context
    login(
      { email, givenName, familyName },
      { expires_in, access_token, refresh_token },
    );
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">S'inscrire</CardTitle>
          <CardDescription>
            Entrez vos informations pour créer un compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">Prénom</Label>
                  <Input
                    id="first-name"
                    placeholder="Max"
                    required
                    value={givenName}
                    onChange={(e) => setGivenName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Nom</Label>
                  <Input
                    id="last-name"
                    placeholder="Robinson"
                    required
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Créer un compte
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Vous avez déjà un compte?{" "}
            <Link href="/login" className="underline">
              Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

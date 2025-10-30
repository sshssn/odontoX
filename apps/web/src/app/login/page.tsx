"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string, demoPassword: string) => {
    setIsLoading(true);
    setError("");
    setEmail(demoEmail);
    setPassword(demoPassword);

    try {
      const result = await signIn("credentials", {
        email: demoEmail,
        password: demoPassword,
        redirect: false,
      });

      if (result?.error) {
        setError(`Failed to login as ${demoEmail}`);
      } else if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo width={200} height={50} />
          <p className="text-sm text-muted-foreground">Dental Practice Management</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
            <CardDescription>
              Enter your email and password to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              {error && (
                <div className="text-sm text-destructive">{error}</div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Quick Test Login</CardTitle>
            <CardDescription className="text-xs">
              Click any role to instantly login and test the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin("superadmin@demo.com", "admin123")}
              disabled={isLoading}
              className="justify-start text-xs"
            >
              <span className="mr-2">👑</span> Super Admin
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin("orgadmin@demo.com", "admin123")}
              disabled={isLoading}
              className="justify-start text-xs"
            >
              <span className="mr-2">🏢</span> Org Admin
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin("dentist@demo.com", "dentist123")}
              disabled={isLoading}
              className="justify-start text-xs"
            >
              <span className="mr-2">🦷</span> Dentist
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin("reception@demo.com", "reception123")}
              disabled={isLoading}
              className="justify-start text-xs"
            >
              <span className="mr-2">📋</span> Reception
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin("billing@demo.com", "billing123")}
              disabled={isLoading}
              className="justify-start text-xs"
            >
              <span className="mr-2">💰</span> Billing
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin("patient@demo.com", "patient123")}
              disabled={isLoading}
              className="justify-start text-xs"
            >
              <span className="mr-2">👤</span> Patient
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

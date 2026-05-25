import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Mail, Lock, ArrowRight, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/utils/storage";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Login — Skill Gap Analyzer" }, { name: "description", content: "Sign in or continue as guest." }],
  }),
  component: Login,
});

function Login() {
  const { login, guest } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    login(email);
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  };

  const handleGuest = () => {
    guest();
    toast.success("Continuing as guest");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center px-4 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-mesh" />
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/30 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

      <div className="absolute top-5 right-5 z-10"><ThemeToggle /></div>

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">SkillGap</span>
        </Link>

        <div className="glass rounded-2xl p-8 shadow-card">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to analyze your skill gaps.</p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" className="pl-9" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-9" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-hero text-primary-foreground shadow-glow hover:opacity-90">
              Sign in <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button onClick={handleGuest} variant="outline" className="w-full glass gap-2">
            <UserCircle className="h-4 w-4" /> Continue as Guest
          </Button>

          <p className="mt-6 text-xs text-center text-muted-foreground">
            Demo only — no real authentication. Data stays in your browser.
          </p>
        </div>
      </div>
    </div>
  );
}

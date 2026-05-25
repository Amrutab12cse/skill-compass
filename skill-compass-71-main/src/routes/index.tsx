import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, BarChart3, GraduationCap, FileUp, Brain, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skill Gap Analyzer — Find your next skill" },
      { name: "description", content: "Compare your current skills with the requirements of top tech roles and get a personalized learning plan." },
      { property: "og:title", content: "Skill Gap Analyzer" },
      { property: "og:description", content: "AI-themed skill gap analysis with charts, recommendations, and a glass UI." },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: Brain, title: "Smart Matching", desc: "Instantly compare your skills to a role's requirements." },
  { icon: BarChart3, title: "Visual Insights", desc: "Charts, progress bars, and clear strengths/weaknesses." },
  { icon: GraduationCap, title: "Learning Plan", desc: "Curated resources for every missing skill." },
  { icon: FileUp, title: "Resume Parse", desc: "Drop a resume and see extracted skills (demo)." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated blobs */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-mesh" />
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute top-40 -right-32 h-96 w-96 rounded-full bg-accent/30 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />

      <header className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">SkillGap</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
        </div>
      </header>

      <section className="relative z-10 px-6 lg:px-12 pt-12 lg:pt-20 pb-24 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm mb-6 animate-fade-in-up">
          <Zap className="h-3.5 w-3.5 text-primary" /> AI-powered skill insights
        </div>
        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight animate-fade-in-up">
          Bridge your <span className="text-gradient">skill gap</span>
          <br /> to your dream role.
        </h1>
        <p className="mt-6 text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          Pick a career role, list your skills, and get an instant match score with a personalized learning roadmap — built with a clean, modern UI.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <Link to="/login">
            <Button size="lg" className="bg-gradient-hero text-primary-foreground shadow-glow hover:opacity-90 h-12 px-8 text-base">
              Start Analysis <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <a href="#features">
            <Button size="lg" variant="outline" className="h-12 px-8 text-base glass">
              Learn more
            </Button>
          </a>
        </div>

        {/* Floating preview card */}
        <div className="mt-20 max-w-3xl mx-auto animate-float">
          <div className="glass rounded-2xl p-6 shadow-card text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="font-semibold">AI/ML Engineer Match</span>
              </div>
              <span className="text-2xl font-bold text-gradient">62%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gradient-hero rounded-full" style={{ width: "62%" }} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Python ✓", "ML ✓", "TensorFlow ✗", "PyTorch ✗"].map((t) => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-muted/70">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 px-6 lg:px-12 pb-24 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold">Everything you need to grow</h2>
          <p className="text-muted-foreground mt-2">A focused toolkit for self-directed learners.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass rounded-2xl p-6 shadow-card hover:shadow-glow transition-all hover:-translate-y-1">
              <div className="h-11 w-11 rounded-xl bg-gradient-hero flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-border py-8 text-center text-sm text-muted-foreground">
        Built with React, TanStack Router, Tailwind & Recharts — frontend only demo.
      </footer>
    </div>
  );
}

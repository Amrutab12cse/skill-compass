import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { loadAnalysis, type AnalysisResult } from "@/utils/analyze";
import { GraduationCap, ExternalLink, BookOpen, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/recommendations")({
  head: () => ({ meta: [{ title: "Recommendations — Skill Gap Analyzer" }] }),
  component: Recommendations,
});

function Recommendations() {
  const [a, setA] = useState<AnalysisResult | null>(null);
  useEffect(() => setA(loadAnalysis()), []);

  if (!a) {
    return (
      <AppShell>
        <div className="glass rounded-2xl p-12 shadow-card text-center animate-fade-in-up">
          <GraduationCap className="h-10 w-10 mx-auto text-primary mb-3" />
          <h2 className="text-xl font-bold">No recommendations yet</h2>
          <p className="text-muted-foreground mt-2">Run an analysis to generate a personalized learning plan.</p>
          <Link to="/analysis" className="inline-block mt-4">
            <Button className="bg-gradient-hero text-primary-foreground shadow-glow">
              Start analysis <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6 lg:p-8 shadow-card animate-fade-in-up">
          <p className="text-sm text-muted-foreground">Learning plan for</p>
          <h2 className="text-2xl lg:text-3xl font-bold">{a.role.emoji} {a.role.name}</h2>
          <p className="text-muted-foreground mt-2">
            {a.missing.length === 0
              ? "🎉 You already cover all required skills. Explore advanced topics next."
              : `Focus on these ${a.missing.length} skill${a.missing.length > 1 ? "s" : ""} to close the gap.`}
          </p>
        </div>

        {a.recommendations.length === 0 ? (
          <div className="glass rounded-2xl p-8 shadow-card text-center">
            <p>All caught up! ✨</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {a.recommendations.map((rec, idx) => (
              <div
                key={rec.skill}
                className="glass rounded-2xl p-6 shadow-card hover:shadow-glow transition-all hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Skill</div>
                    <h3 className="text-lg font-bold">{rec.skill}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow shrink-0">
                    <BookOpen className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>
                <ul className="mt-4 space-y-2">
                  {rec.items.map((it) => (
                    <li key={it.url}>
                      <a
                        href={it.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-muted/50 hover:bg-muted transition group"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{it.title}</div>
                          <div className="text-xs text-muted-foreground">{it.resource}</div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

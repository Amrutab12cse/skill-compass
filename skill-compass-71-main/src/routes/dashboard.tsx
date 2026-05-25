import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, AlertCircle, GraduationCap, TrendingUp, Sparkles } from "lucide-react";
import { loadAnalysis, type AnalysisResult } from "@/utils/analyze";
import { useAuth } from "@/utils/storage";
import { POLLS } from "@/data/roles";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Skill Gap Analyzer" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [poll, setPoll] = useState(POLLS[0]);
  const [voted, setVoted] = useState<string | null>(null);

  useEffect(() => setAnalysis(loadAnalysis()), []);

  const totalVotes = poll.options.reduce((s, o) => s + o.votes, 0);
  const vote = (label: string) => {
    if (voted) return;
    setPoll({
      ...poll,
      options: poll.options.map((o) => (o.label === label ? { ...o, votes: o.votes + 1 } : o)),
    });
    setVoted(label);
  };

  const pieData = analysis
    ? [
        { name: "Matched", value: analysis.matching.length, color: "oklch(0.65 0.18 155)" },
        { name: "Missing", value: analysis.missing.length, color: "oklch(0.6 0.24 25)" },
      ]
    : [];

  return (
    <AppShell>
      <div className="space-y-6 relative">
        {/* Welcome */}
        <div className="glass rounded-2xl p-6 lg:p-8 shadow-card animate-fade-in-up">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" /> Welcome back
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold mt-1">
            Hi {user?.guest ? "Guest" : user?.email?.split("@")[0] ?? "there"} 👋
          </h2>
          <p className="text-muted-foreground mt-1">Here's your skill journey at a glance.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/analysis">
              <Button className="bg-gradient-hero text-primary-foreground shadow-glow hover:opacity-90">
                New analysis <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/resume">
              <Button variant="outline" className="glass">Upload resume</Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard
            icon={Target}
            label="Match percentage"
            value={analysis ? `${analysis.matchPercentage}%` : "—"}
            sub={analysis ? analysis.role.name : "Run an analysis"}
            tone="primary"
          />
          <StatCard
            icon={AlertCircle}
            label="Missing skills"
            value={analysis ? String(analysis.missing.length) : "—"}
            sub={analysis ? "Identified gaps" : "No data yet"}
            tone="destructive"
          />
          <StatCard
            icon={GraduationCap}
            label="Recommendations"
            value={analysis ? String(analysis.recommendations.reduce((s, r) => s + r.items.length, 0)) : "—"}
            sub="Curated resources"
            tone="success"
          />
        </div>

        {/* Chart + Poll */}
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" /> Skill coverage
                </h3>
                <p className="text-xs text-muted-foreground">Matched vs missing skills</p>
              </div>
            </div>
            {analysis && analysis.role.skills.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={4}>
                      {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "var(--popover)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-muted-foreground">
                <Target className="h-10 w-10 mb-2 opacity-40" />
                <p className="text-sm">Run your first analysis to see the chart.</p>
                <Link to="/analysis" className="mt-3">
                  <Button size="sm">Start now</Button>
                </Link>
              </div>
            )}
          </div>

          <div className="glass rounded-2xl p-6 shadow-card">
            <h3 className="font-semibold">📊 Community Poll</h3>
            <p className="text-sm text-muted-foreground mt-1">{poll.question}</p>
            <div className="mt-4 space-y-3">
              {poll.options.map((o) => {
                const pct = totalVotes ? Math.round((o.votes / totalVotes) * 100) : 0;
                const selected = voted === o.label;
                return (
                  <button
                    key={o.label}
                    onClick={() => vote(o.label)}
                    disabled={!!voted}
                    className="w-full text-left group"
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span className={selected ? "font-semibold text-primary" : ""}>
                        {o.label} {selected && "✓"}
                      </span>
                      <span className="text-muted-foreground">{pct}% · {o.votes}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          selected ? "bg-gradient-hero" : "bg-primary/40 group-hover:bg-primary/60"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
            {voted && <p className="mt-4 text-xs text-muted-foreground">Thanks for voting! 🎉</p>}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({
  icon: Icon, label, value, sub, tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; sub: string;
  tone: "primary" | "destructive" | "success";
}) {
  const toneClass = {
    primary: "from-primary to-accent",
    destructive: "from-destructive to-warning",
    success: "from-success to-accent",
  }[tone];
  return (
    <div className="glass rounded-2xl p-6 shadow-card hover:shadow-glow transition-all hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{sub}</p>
        </div>
        <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${toneClass} flex items-center justify-center shadow-glow`}>
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ROLES } from "@/data/roles";
import { analyzeSkills, persistAnalysis, persistRoleId, persistSkills, loadSkills, loadRoleId, loadAnalysis, type AnalysisResult } from "@/utils/analyze";
import { X, Plus, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/analysis")({
  head: () => ({ meta: [{ title: "Skill Analysis — Skill Gap Analyzer" }] }),
  component: AnalysisPage,
});

function AnalysisPage() {
  const [roleId, setRoleId] = useState<string>(ROLES[0].id);
  const [skills, setSkills] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const stored = loadSkills();
    const role = loadRoleId();
    if (stored.length) setSkills(stored);
    if (role) setRoleId(role);
    setResult(loadAnalysis());
  }, []);

  const role = ROLES.find((r) => r.id === roleId)!;

  const addSkill = (val?: string) => {
    const v = (val ?? input).trim();
    if (!v) return;
    const parts = v.split(",").map((s) => s.trim()).filter(Boolean);
    const next = Array.from(new Set([...skills, ...parts]));
    setSkills(next);
    persistSkills(next);
    setInput("");
  };
  const removeSkill = (s: string) => {
    const next = skills.filter((x) => x !== s);
    setSkills(next);
    persistSkills(next);
  };

  const runAnalysis = () => {
    if (skills.length === 0) {
      toast.error("Add at least one skill first");
      return;
    }
    setAnalyzing(true);
    persistRoleId(roleId);
    setTimeout(() => {
      const r = analyzeSkills(role, skills);
      setResult(r);
      persistAnalysis(r);
      setAnalyzing(false);
      toast.success(`Match: ${r.matchPercentage}%`);
    }, 900);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Inputs */}
        <div className="glass rounded-2xl p-6 lg:p-8 shadow-card animate-fade-in-up">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> Analyze your skills
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Choose a target role and add the skills you already have.</p>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <Label>Target career role</Label>
              <Select value={roleId} onValueChange={setRoleId}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      <span className="mr-2">{r.emoji}</span> {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{role.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {role.skills.map((s) => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">{s}</span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Your skills</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Python, React, SQL"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(); }
                  }}
                  className="h-11"
                />
                <Button onClick={() => addSkill()} variant="outline" className="h-11"><Plus className="h-4 w-4" /></Button>
              </div>
              <p className="text-xs text-muted-foreground">Press Enter or comma to add. Click a chip to remove.</p>
              <div className="mt-3 flex flex-wrap gap-2 min-h-10">
                {skills.length === 0 && <span className="text-xs text-muted-foreground italic">No skills added yet.</span>}
                {skills.map((s) => (
                  <button
                    key={s}
                    onClick={() => removeSkill(s)}
                    className="text-xs pl-3 pr-2 py-1 rounded-full bg-gradient-hero text-primary-foreground inline-flex items-center gap-1 hover:opacity-90 transition"
                  >
                    {s} <X className="h-3 w-3" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={runAnalysis}
              disabled={analyzing}
              size="lg"
              className="bg-gradient-hero text-primary-foreground shadow-glow hover:opacity-90"
            >
              {analyzing ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing…</>) : (<>Analyze <ArrowRight className="ml-2 h-4 w-4" /></>)}
            </Button>
          </div>
        </div>

        {/* Results */}
        {analyzing && (
          <div className="glass rounded-2xl p-12 shadow-card flex flex-col items-center text-center animate-fade-in-up">
            <div className="h-14 w-14 rounded-full bg-gradient-hero flex items-center justify-center shadow-glow animate-pulse">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <p className="mt-4 font-semibold">Crunching the numbers…</p>
            <p className="text-sm text-muted-foreground">Comparing your skills with {role.name}</p>
          </div>
        )}

        {!analyzing && result && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Match score */}
            <div className="glass rounded-2xl p-6 lg:p-8 shadow-card">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Skill match for {result.role.emoji} {result.role.name}</p>
                  <p className="text-5xl font-bold text-gradient mt-1">{result.matchPercentage}%</p>
                </div>
                <div className="text-sm text-right">
                  <p>{result.matching.length} matched · {result.missing.length} missing</p>
                  <p className="text-muted-foreground">{result.role.skills.length} skills required</p>
                </div>
              </div>
              <Progress value={result.matchPercentage} className="mt-4 h-3" />

              <div className="mt-6 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.role.skills.map((s) => ({
                    skill: s,
                    has: result.matching.includes(s) ? 1 : 0,
                  }))}>
                    <XAxis dataKey="skill" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} interval={0} angle={-20} textAnchor="end" height={60} />
                    <YAxis hide domain={[0, 1]} />
                    <Tooltip
                      contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }}
                      formatter={(v: number) => (v ? "Have ✓" : "Missing ✗")}
                    />
                    <Bar dataKey="has" radius={[8, 8, 0, 0]}>
                      {result.role.skills.map((s, i) => (
                        <Cell key={i} fill={result.matching.includes(s) ? "oklch(0.65 0.18 155)" : "oklch(0.6 0.24 25 / 0.35)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Strengths & weaknesses */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass rounded-2xl p-6 shadow-card">
                <h3 className="font-semibold flex items-center gap-2 text-success">
                  <CheckCircle2 className="h-5 w-5" /> Strengths
                </h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {result.strengths.map((s, i) => <li key={i} className="flex gap-2"><span>✓</span>{s}</li>)}
                </ul>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {result.matching.map((s) => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-success/15 text-success font-medium">{s}</span>
                  ))}
                </div>
              </div>
              <div className="glass rounded-2xl p-6 shadow-card">
                <h3 className="font-semibold flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" /> Weaknesses
                </h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {result.weaknesses.map((s, i) => <li key={i} className="flex gap-2"><span>!</span>{s}</li>)}
                </ul>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {result.missing.map((s) => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-destructive/15 text-destructive font-medium">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/recommendations">
                <Button className="bg-gradient-hero text-primary-foreground shadow-glow">
                  See learning plan <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

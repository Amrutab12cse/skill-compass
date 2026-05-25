import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, CheckCircle2, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { persistSkills, loadSkills } from "@/utils/analyze";
import { toast } from "sonner";

export const Route = createFileRoute("/resume")({
  head: () => ({ meta: [{ title: "Resume Upload — Skill Gap Analyzer" }] }),
  component: ResumePage,
});

const DUMMY_SKILLS = ["Python", "React", "SQL", "Git", "JavaScript", "HTML", "CSS", "REST APIs"];

function ResumePage() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File | null | undefined) => {
    if (!f) return;
    setFile(f);
    setLoading(true);
    setExtracted([]);
    setTimeout(() => {
      // Dummy extraction — picks a randomized subset
      const shuffled = [...DUMMY_SKILLS].sort(() => Math.random() - 0.5).slice(0, 5);
      setExtracted(shuffled);
      setLoading(false);
      toast.success(`Extracted ${shuffled.length} skills from resume`);
    }, 1200);
  };

  const addToProfile = () => {
    const existing = loadSkills();
    const next = Array.from(new Set([...existing, ...extracted]));
    persistSkills(next);
    toast.success("Skills added to your profile");
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6 lg:p-8 shadow-card animate-fade-in-up">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> Upload your resume
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Drop a PDF or DOC file — we'll detect your skills (demo).</p>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            className={`mt-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer p-12 text-center ${
              dragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50"
            }`}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-hero flex items-center justify-center shadow-glow mb-4 animate-float">
              <UploadCloud className="h-8 w-8 text-primary-foreground" />
            </div>
            <p className="font-semibold">Drag & drop or click to browse</p>
            <p className="text-sm text-muted-foreground mt-1">PDF, DOC, DOCX or TXT · Max 5MB</p>
            <Button className="mt-4 bg-gradient-hero text-primary-foreground shadow-glow">Choose file</Button>
          </div>

          {file && (
            <div className="mt-4 glass rounded-xl p-4 flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              {loading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <CheckCircle2 className="h-5 w-5 text-success" />}
            </div>
          )}
        </div>

        {extracted.length > 0 && (
          <div className="glass rounded-2xl p-6 lg:p-8 shadow-card animate-fade-in-up">
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Extracted skills
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Demo output — replace with real parsing in production.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {extracted.map((s) => (
                <span key={s} className="text-sm px-3 py-1.5 rounded-full bg-gradient-hero text-primary-foreground shadow-glow">
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2 justify-end">
              <Button variant="outline" onClick={addToProfile}>Add to my skills</Button>
              <Link to="/analysis">
                <Button className="bg-gradient-hero text-primary-foreground shadow-glow">
                  Continue to analysis <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

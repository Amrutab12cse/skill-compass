import { LEARNING_SUGGESTIONS, DEFAULT_SUGGESTION, type Role } from "@/data/roles";

const normalize = (s: string) => s.trim().toLowerCase();

export type AnalysisResult = {
  role: Role;
  userSkills: string[];
  matching: string[];
  missing: string[];
  matchPercentage: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: { skill: string; items: { title: string; resource: string; url: string }[] }[];
};

export function analyzeSkills(role: Role, userSkillsInput: string[]): AnalysisResult {
  const userSkills = userSkillsInput.map((s) => s.trim()).filter(Boolean);
  const userSet = new Set(userSkills.map(normalize));
  const required = role.skills;

  const matching = required.filter((r) => userSet.has(normalize(r)));
  const missing = required.filter((r) => !userSet.has(normalize(r)));
  const matchPercentage = required.length === 0 ? 0 : Math.round((matching.length / required.length) * 100);

  const strengths =
    matching.length === 0
      ? ["Fresh start — every skill you add will count."]
      : [
          `You already cover ${matching.length} of ${required.length} core skills.`,
          matching.length >= required.length / 2 ? "Strong foundation for this role." : "Solid starting point to build on.",
        ];

  const weaknesses =
    missing.length === 0
      ? ["No gaps detected. Consider advanced specializations."]
      : [
          `${missing.length} key ${missing.length === 1 ? "skill is" : "skills are"} missing for this role.`,
          missing.length > required.length / 2 ? "Focus on fundamentals first." : "A few targeted topics will close the gap.",
        ];

  const recommendations = missing.map((skill) => ({
    skill,
    items: LEARNING_SUGGESTIONS[normalize(skill)] ?? DEFAULT_SUGGESTION(skill),
  }));

  return { role, userSkills, matching, missing, matchPercentage, strengths, weaknesses, recommendations };
}

const KEY = "sga:analysis";
const SKILLS_KEY = "sga:skills";
const ROLE_KEY = "sga:role";

export const persistAnalysis = (r: AnalysisResult) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(r));
};
export const loadAnalysis = (): AnalysisResult | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as AnalysisResult) : null;
};
export const persistSkills = (skills: string[]) => localStorage.setItem(SKILLS_KEY, JSON.stringify(skills));
export const loadSkills = (): string[] => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(SKILLS_KEY);
  return raw ? JSON.parse(raw) : [];
};
export const persistRoleId = (id: string) => localStorage.setItem(ROLE_KEY, id);
export const loadRoleId = (): string | null => (typeof window === "undefined" ? null : localStorage.getItem(ROLE_KEY));

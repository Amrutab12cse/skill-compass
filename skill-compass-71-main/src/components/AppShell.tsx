import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, BarChart3, GraduationCap, FileUp, Sparkles, LogOut, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useAuth } from "@/utils/storage";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analysis", label: "Skill Analysis", icon: BarChart3 },
  { to: "/recommendations", label: "Recommendations", icon: GraduationCap },
  { to: "/resume", label: "Resume Upload", icon: FileUp },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen flex w-full bg-background relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 bg-gradient-mesh opacity-50" />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-40 h-screen w-64 glass border-r border-sidebar-border transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
          <div className="h-9 w-9 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">SkillGap</span>
        </div>
        <nav className="p-4 space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = path === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  active
                    ? "bg-gradient-hero text-primary-foreground shadow-glow"
                    : "text-sidebar-foreground hover:bg-sidebar-border/50",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <div className="glass rounded-lg p-3 text-xs">
            <div className="font-medium truncate">{user?.email ?? "Not signed in"}</div>
            <div className="text-muted-foreground">{user?.guest ? "Guest session" : "Signed in"}</div>
          </div>
          <Button onClick={handleLogout} variant="ghost" className="w-full mt-2 justify-start gap-2 text-sm">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>

      {open && (
        <div onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-background/60 lg:hidden" />
      )}

      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="sticky top-0 z-20 h-16 glass border-b border-border flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen((o) => !o)}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="font-semibold capitalize">
              {NAV.find((n) => n.to === path)?.label ?? "Skill Gap Analyzer"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 relative">{children}</main>
      </div>
    </div>
  );
}

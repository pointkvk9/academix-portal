import { useEffect, useState } from "react";
import { Shield, Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export function GovtHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Exam Portal", path: "/exam" },
    { label: "Donate", path: "/donate" },
    { label: "Membership", path: "/membership" },
    { label: "Login", path: "/auth" },
  ];

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="govt-header py-3 px-4 shadow-lg">
      <div className="container mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent/20 border-2 border-accent cursor-pointer flex-shrink-0" onClick={() => navigate("/")}>
            <Shield className="w-5 h-5 md:w-6 md:h-6 text-accent" />
          </div>
          <div className="min-w-0 flex-1 cursor-pointer" onClick={() => navigate("/")}>
            <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-wide text-govt-header-foreground leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              K.V.K SANSTHA
            </h1>
            <p className="text-[10px] md:text-[11px] text-govt-header-foreground/70 tracking-wider hidden sm:block">
              Empowering Communities Through Financial Inclusion & Education
            </p>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-primary-foreground/15 text-accent"
                      : "text-govt-header-foreground/80 hover:text-accent hover:bg-primary-foreground/10"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          <div className="hidden md:flex flex-col items-end text-[10px] text-govt-header-foreground/60">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Portal Active
            </div>
            <span>www.kvksanstha.in</span>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center rounded-md border border-primary-foreground/20 bg-primary-foreground/10 p-2 text-govt-header-foreground transition-colors hover:bg-primary-foreground/15"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="mt-3 lg:hidden">
            <nav className="grid gap-2 rounded-lg border border-primary-foreground/15 bg-primary-foreground/10 p-2 backdrop-blur-sm">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className={`rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary-foreground/15 text-accent"
                        : "text-govt-header-foreground hover:bg-primary-foreground/10"
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

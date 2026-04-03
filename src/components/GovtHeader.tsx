import { Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function GovtHeader() {
  const navigate = useNavigate();

  return (
    <header className="govt-header py-3 px-4 shadow-lg">
      <div className="container mx-auto flex items-center gap-3">
        {/* Back / Forward Navigation */}
        <div className="flex items-center gap-1">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-primary-foreground/70 hover:text-primary-foreground" title="Go Back">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => navigate(1)} className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-primary-foreground/70 hover:text-primary-foreground" title="Go Forward">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent/20 border-2 border-accent cursor-pointer" onClick={() => navigate("/")}>
          <Shield className="w-5 h-5 md:w-6 md:h-6 text-accent" />
        </div>
        <div className="flex-1 cursor-pointer" onClick={() => navigate("/")}>
          <h1 className="text-base md:text-lg font-bold tracking-wide text-govt-header-foreground leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            K.V.K SANSTHA
          </h1>
          <p className="text-[10px] md:text-[11px] text-govt-header-foreground/70 tracking-wider hidden sm:block">
            Empowering Communities Through Financial Inclusion & Education
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {[
            { label: "Home", path: "/" },
            { label: "Exam Portal", path: "/exam" },
            { label: "Donate", path: "/donate" },
            { label: "Membership", path: "/membership" },
            { label: "Login", path: "/auth" },
          ].map(link => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="px-3 py-1.5 text-xs font-medium text-govt-header-foreground/80 hover:text-accent hover:bg-white/10 rounded-md transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex flex-col items-end text-[10px] text-govt-header-foreground/60">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Portal Active
          </div>
          <span>www.kvksanstha.in</span>
        </div>
      </div>
    </header>
  );
}

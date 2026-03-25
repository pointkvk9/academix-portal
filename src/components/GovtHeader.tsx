import { Shield } from "lucide-react";

export function GovtHeader() {
  return (
    <header className="govt-header py-3 px-4 shadow-lg">
      <div className="container mx-auto flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 border-2 border-accent">
          <Shield className="w-6 h-6 text-accent" />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold tracking-wide text-govt-header-foreground leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            K.V.K SANSTHA
          </h1>
          <p className="text-[11px] text-govt-header-foreground/70 tracking-wider">
            Empowering Communities Through Financial Inclusion & Education
          </p>
        </div>
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

import { Shield } from "lucide-react";

export function GovtHeader() {
  return (
    <header className="govt-header py-3 px-4 shadow-md">
      <div className="container mx-auto flex items-center gap-3">
        <div className="flex items-center justify-center w-11 h-11 rounded-full bg-primary-foreground/15 border border-primary-foreground/20">
          <Shield className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold tracking-wide text-govt-header-foreground leading-tight">
            National Examination Portal
          </h1>
          <p className="text-[11px] text-govt-header-foreground/60 tracking-wider uppercase">
            Government of India — Online Examination Management System
          </p>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-[10px] text-govt-header-foreground/50">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          Portal Active
        </div>
      </div>
    </header>
  );
}

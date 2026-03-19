import { Shield } from "lucide-react";

export function GovtHeader() {
  return (
    <header className="govt-header py-3 px-4 shadow-md">
      <div className="container mx-auto flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-foreground/20">
          <Shield className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-wide text-govt-header-foreground">
            National Examination Portal
          </h1>
          <p className="text-xs text-govt-header-foreground/70">
            Online Examination Management System
          </p>
        </div>
      </div>
    </header>
  );
}

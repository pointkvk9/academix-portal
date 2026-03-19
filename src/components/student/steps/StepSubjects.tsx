import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Props {
  subjects?: string[]; // ✔ optional बना दिया
  selected?: string[]; // ✔ optional
  onNext: (data: string[]) => void;
  onBack: () => void;
}

export function StepSubjects({
  subjects = [], // ✔ default empty array
  selected = [], // ✔ default empty array
  onNext,
  onBack,
}: Props) {
  const [checked, setChecked] = useState<string[]>(selected);

  const toggle = (subject: string) => {
    setChecked((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checked.length === 0) {
      toast.error("Please select at least one subject");
      return;
    }
    onNext(checked);
  };

  // ✔ safe subjects (invalid values हटाए)
  const safeSubjects = subjects.filter(
    (s): s is string => typeof s === "string" && s.trim() !== ""
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {safeSubjects.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No subjects defined for this exam. You can skip this step.
          </p>
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              ← Back
            </Button>
            <Button type="button" onClick={() => onNext([])}>
              Skip & Continue →
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Select the subjects you want to appear for:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {safeSubjects.map((subject, i) => (
              <div
                key={`${subject}-${i}`} // ✔ unique key
                className="flex items-center space-x-3 p-3 rounded-md border bg-card hover:bg-muted/50 cursor-pointer"
                onClick={() => toggle(subject)}
              >
                <Checkbox
                  checked={checked.includes(subject)}
                  onCheckedChange={() => toggle(subject)}
                  onClick={(e) => e.stopPropagation()} // ✔ double click fix
                />
                <Label className="cursor-pointer font-normal">
                  {subject}
                </Label>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            {checked.length} subject(s) selected
          </p>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              ← Back
            </Button>
            <Button type="submit">Save & Continue →</Button>
          </div>
        </>
      )}
    </form>
  );
}

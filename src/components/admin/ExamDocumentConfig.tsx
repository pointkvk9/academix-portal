import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, X, FileText } from "lucide-react";

interface DocConfig {
  key: string;
  label: string;
  accept: string;
  required: boolean;
}

interface Props {
  documents: DocConfig[];
  onChange: (docs: DocConfig[]) => void;
}

export function ExamDocumentConfig({ documents, onChange }: Props) {
  const addDocument = () => {
    onChange([...documents, { key: `doc_${Date.now()}`, label: "", accept: "image/*,.pdf", required: false }]);
  };

  const updateDoc = (index: number, field: string, value: any) => {
    const updated = [...documents];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "label") {
      updated[index].key = value.toLowerCase().replace(/[^a-z0-9]/g, "_");
    }
    onChange(updated);
  };

  const removeDoc = (index: number) => {
    onChange(documents.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-primary flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" /> Required Documents Configuration
        </Label>
        <Button type="button" variant="outline" size="sm" onClick={addDocument}>
          <Plus className="h-3 w-3 mr-1" /> Add Document
        </Button>
      </div>
      <p className="text-[10px] text-muted-foreground">Configure which documents students must upload in their application form</p>
      
      <div className="space-y-2">
        {documents.map((doc, i) => (
          <div key={i} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
            <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
            <Input 
              value={doc.label} 
              onChange={(e) => updateDoc(i, "label", e.target.value)}
              placeholder="Document name (e.g. Class 10 Marksheet)"
              className="flex-1 h-8 text-xs"
            />
            <select 
              value={doc.accept}
              onChange={(e) => updateDoc(i, "accept", e.target.value)}
              className="h-8 text-xs border rounded px-2 bg-background"
            >
              <option value="image/*">Images only</option>
              <option value="image/*,.pdf">Images & PDF</option>
              <option value=".pdf">PDF only</option>
            </select>
            <div className="flex items-center gap-1">
              <Switch 
                checked={doc.required} 
                onCheckedChange={(v) => updateDoc(i, "required", v)}
              />
              <span className="text-[10px] text-muted-foreground">Required</span>
            </div>
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeDoc(i)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

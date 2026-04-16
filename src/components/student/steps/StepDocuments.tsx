import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, CheckCircle } from "lucide-react";

interface DocConfig {
  key: string;
  label: string;
  accept: string;
  required: boolean;
}

interface Props {
  data: any;
  applicationId: string;
  examGroup?: string;
  lastClassPassed?: string;
  requiredDocuments?: DocConfig[];
  onNext: (data: any) => void;
  onBack: () => void;
}

const defaultDocs: DocConfig[] = [
  { key: "photo", label: "Passport Size Photo", accept: "image/*", required: true },
  { key: "signature", label: "Signature", accept: "image/*", required: true },
  { key: "id_proof", label: "ID Proof (Aadhar/Voter ID)", accept: "image/*,.pdf", required: false },
  { key: "marksheet", label: "Previous Class Marksheet", accept: "image/*,.pdf", required: true },
];

export function StepDocuments({ data, applicationId, examGroup, lastClassPassed, requiredDocuments, onNext, onBack }: Props) {
  const { user } = useAuth();
  const [docs, setDocs] = useState<any>(data || {});
  const [uploading, setUploading] = useState<string | null>(null);

  // Use exam-configured documents or fall back to defaults
  const documentTypes = (requiredDocuments && requiredDocuments.length > 0) ? requiredDocuments : defaultDocs.map(d => {
    // Dynamic marksheet label based on group
    if (d.key === "marksheet") {
      let label = "Previous Class Marksheet";
      if (examGroup === "group3") label = "Class 10 Marksheet";
      else if (lastClassPassed) label = `Class ${lastClassPassed} Marksheet`;
      return { ...d, label: d.required ? `${label} *` : label };
    }
    return { ...d, label: d.required ? `${d.label} *` : d.label };
  });

  const handleUpload = async (key: string, file: File) => {
    if (!user) return;
    setUploading(key);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${applicationId}/${key}.${ext}`;
    
    const { error } = await supabase.storage.from("documents").upload(path, file, { upsert: true });
    if (error) {
      toast.error(`Upload failed: ${error.message}`);
    } else {
      setDocs({ ...docs, [key]: path });
      toast.success("Uploaded successfully!");
    }
    setUploading(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredKeys = documentTypes.filter(d => d.required).map(d => d.key);
    const missing = requiredKeys.filter(k => !docs[k]);
    if (missing.length > 0) {
      toast.error("Please upload all required (*) documents");
      return;
    }
    onNext(docs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">Upload the required documents. Max file size: 2MB each.</p>
      {examGroup && (
        <div className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
          {examGroup === "group3"
            ? "Group 3 candidates must upload their Class 10 marksheet."
            : `Upload the marksheet of the last class passed${lastClassPassed ? ` (Class ${lastClassPassed})` : ""}.`}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentTypes.map((docType) => (
          <div key={docType.key} className="space-y-2 p-4 border rounded-md bg-card">
            <Label>{docType.required ? `${docType.label} *` : docType.label}</Label>
            {docs[docType.key] ? (
              <div className="flex items-center gap-2 text-sm text-success">
                <CheckCircle className="h-4 w-4" />
                <span>Uploaded</span>
              </div>
            ) : null}
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept={docType.accept}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 2 * 1024 * 1024) {
                      toast.error("File size must be less than 2MB");
                      return;
                    }
                    handleUpload(docType.key, file);
                  }
                }}
                disabled={uploading === docType.key}
              />
            </div>
            {uploading === docType.key && <p className="text-xs text-muted-foreground">Uploading...</p>}
          </div>
        ))}
      </div>
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>← Back</Button>
        <Button type="submit">Save & Continue →</Button>
      </div>
    </form>
  );
}

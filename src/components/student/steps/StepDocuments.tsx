import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, CheckCircle } from "lucide-react";

interface Props {
  data: any;
  applicationId: string;
  examGroup?: string;
  lastClassPassed?: string;
  onNext: (data: any) => void;
  onBack: () => void;
}

export function StepDocuments({ data, applicationId, examGroup, lastClassPassed, onNext, onBack }: Props) {
  const { user } = useAuth();
  const [docs, setDocs] = useState<any>(data || {});
  const [uploading, setUploading] = useState<string | null>(null);

  const getMarksheetLabel = () => {
    if (examGroup === "group3") return "Class 10 Marksheet *";
    if (lastClassPassed) return `Class ${lastClassPassed} Marksheet *`;
    return "Previous Class Marksheet *";
  };

  const documentTypes = [
    { key: "photo", label: "Passport Size Photo *", accept: "image/*" },
    { key: "signature", label: "Signature *", accept: "image/*" },
    { key: "id_proof", label: "ID Proof (Aadhar/Voter ID)", accept: "image/*,.pdf" },
    { key: "marksheet", label: getMarksheetLabel(), accept: "image/*,.pdf" },
  ];

  const handleUpload = async (key: string, file: File) => {
    if (!user) return;
    setUploading(key);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${applicationId}/${key}.${ext}`;
    
    const { error } = await supabase.storage.from("documents").upload(path, file, { upsert: true });
    if (error) {
      toast.error(`Upload failed: ${error.message}`);
    } else {
      const { data: urlData } = supabase.storage.from("documents").getPublicUrl(path);
      setDocs({ ...docs, [key]: path });
      toast.success(`${key} uploaded successfully!`);
    }
    setUploading(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docs.photo || !docs.signature || !docs.marksheet) {
      toast.error("Photo, signature and required marksheet are mandatory");
      return;
    }
    onNext(docs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">Upload the required documents. Max file size: 2MB each.</p>
      <div className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
        {examGroup === "group3"
          ? "Group 3 candidates must upload their Class 10 marksheet."
          : `Upload the marksheet of the last class passed${lastClassPassed ? ` (Class ${lastClassPassed})` : ""}.`}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentTypes.map((docType) => (
          <div key={docType.key} className="space-y-2 p-4 border rounded-md bg-card">
            <Label>{docType.label}</Label>
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

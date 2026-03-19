import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Shield } from "lucide-react";

interface AdmitCardViewProps {
  admitCards: any[];
  profile: any;
}

export function AdmitCardView({ admitCards, profile }: AdmitCardViewProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownload = (cardId: string) => {
    const card = document.getElementById(`admit-card-${cardId}`);
    if (!card) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Admit Card</title>
      <style>
        body { font-family: 'Noto Sans', Arial, sans-serif; margin: 0; padding: 20px; }
        .card { border: 2px solid #1e3a5f; padding: 20px; max-width: 700px; margin: auto; }
        .header { background: #1e3a5f; color: white; padding: 12px; text-align: center; margin: -20px -20px 15px; }
        .header h2 { margin: 0; font-size: 18px; }
        .header p { margin: 4px 0 0; font-size: 12px; opacity: 0.8; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 6px 8px; font-size: 13px; border: 1px solid #ddd; }
        td:first-child { font-weight: 600; width: 40%; background: #f5f5f5; }
        .important { margin-top: 15px; padding: 10px; background: #fff3cd; border: 1px solid #ffc107; font-size: 11px; }
        @media print { body { margin: 0; } }
      </style></head><body>
      ${card.innerHTML}
      <script>window.print();</script>
      </body></html>
    `);
    printWindow.document.close();
  };

  if (admitCards.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No admit cards available yet. Please check back after your application is processed.</p>;
  }

  return (
    <div className="space-y-6">
      {admitCards.map((card) => (
        <div key={card.id}>
          <div className="flex justify-end mb-2">
            <Button variant="outline" size="sm" onClick={() => handleDownload(card.id)}>
              <Download className="h-4 w-4 mr-1" /> Download / Print
            </Button>
          </div>
          <div id={`admit-card-${card.id}`}>
            <div className="card border-2 border-primary rounded-lg overflow-hidden max-w-2xl mx-auto">
              <div className="header bg-primary text-primary-foreground p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Shield className="h-5 w-5" />
                  <h2 className="text-lg font-bold">ADMIT CARD</h2>
                </div>
                <p className="text-sm opacity-80">National Examination Portal</p>
              </div>
              <div className="p-4">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b"><td className="py-2 font-semibold w-2/5 bg-muted/50 px-3">Roll Number</td><td className="py-2 px-3 font-bold text-primary">{card.roll_number}</td></tr>
                    <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3">Candidate Name</td><td className="py-2 px-3">{profile?.full_name}</td></tr>
                    <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3">Examination</td><td className="py-2 px-3">{(card.exams as any)?.title}</td></tr>
                    <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3">Exam Date</td><td className="py-2 px-3">{(card.exams as any)?.exam_date || "TBD"}</td></tr>
                    <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3">Center Name</td><td className="py-2 px-3">{(card.exam_centers as any)?.center_name}</td></tr>
                    <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3">Center Code</td><td className="py-2 px-3">{(card.exam_centers as any)?.center_code || "—"}</td></tr>
                    <tr><td className="py-2 font-semibold bg-muted/50 px-3">Center Address</td><td className="py-2 px-3">{(card.exam_centers as any)?.address}, {(card.exam_centers as any)?.city}, {(card.exam_centers as any)?.state}</td></tr>
                  </tbody>
                </table>
                <div className="important mt-4 p-3 bg-warning/10 border border-warning/30 rounded text-xs">
                  <p className="font-semibold mb-1">Important Instructions:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Carry this admit card along with a valid photo ID to the examination center.</li>
                    <li>Report at least 30 minutes before the exam start time.</li>
                    <li>Electronic devices are not allowed inside the examination hall.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

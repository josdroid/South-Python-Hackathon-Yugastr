import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Star, FileText, BookOpen, ClipboardList, FolderOpen, Layers, PenTool } from "lucide-react";
import { incrementDownloads } from "@/lib/supabase-helpers";

const typeIcons: Record<string, any> = {
  notes: FileText,
  question_paper: ClipboardList,
  study_material: BookOpen,
  reference_book: Layers,
  project_report: FolderOpen,
  assignment: PenTool,
};

const typeLabels: Record<string, string> = {
  notes: "Notes",
  question_paper: "Question Paper",
  study_material: "Study Material",
  reference_book: "Reference Book",
  project_report: "Project Report",
  assignment: "Assignment",
};

interface ResourceCardProps {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  semester: number;
  resource_type: string;
  file_url: string;
  downloads: number;
  avg_rating: number;
  rating_count: number;
  created_at: string;
  contributor?: string;
}

export default function ResourceCard({
  id, title, description, subject, semester, resource_type,
  file_url, downloads, avg_rating, rating_count, contributor, created_at,
}: ResourceCardProps) {
  const Icon = typeIcons[resource_type] || FileText;

  const handleDownload = async () => {
    await incrementDownloads(id);
    window.open(file_url, '_blank');
  };

  return (
    <Card className="group cursor-pointer border border-border bg-card shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-1">
      <CardContent className="p-5">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <Badge variant="secondary" className="text-xs font-medium">
            Sem {semester}
          </Badge>
        </div>

        <h3 className="mb-1 font-display text-lg font-semibold leading-tight text-foreground line-clamp-2">
          {title}
        </h3>
        <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
          {description || "No description provided"}
        </p>

        <div className="mb-3 flex flex-wrap gap-1.5">
          <Badge variant="outline" className="text-xs">{subject}</Badge>
          <Badge variant="outline" className="text-xs">{typeLabels[resource_type]}</Badge>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-accent" />
              {Number(avg_rating).toFixed(1)} ({rating_count})
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-3.5 w-3.5" />
              {downloads}
            </span>
          </div>
          <button
            onClick={handleDownload}
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Download
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

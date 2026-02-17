import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { uploadFile } from "@/lib/supabase-helpers";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload as UploadIcon, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const resourceTypes = [
  { value: "notes", label: "Notes" },
  { value: "question_paper", label: "Question Paper" },
  { value: "study_material", label: "Study Material" },
  { value: "reference_book", label: "Reference Book" },
  { value: "project_report", label: "Project Report" },
  { value: "assignment", label: "Assignment" },
];

export default function UploadPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("");
  const [resourceType, setResourceType] = useState("");

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !resourceType || !semester) return;

    setLoading(true);
    try {
      const fileUrl = await uploadFile(file, user.id);

      const { error } = await supabase.from("resources").insert({
        user_id: user.id,
        title,
        description,
        subject,
        semester: parseInt(semester),
        resource_type: resourceType,
        file_url: fileUrl,
        file_name: file.name,
      });

      if (error) throw error;

      toast({ title: "Uploaded!", description: "Your resource has been shared with the community." });
      navigate("/browse");
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Card className="shadow-elevated">
          <CardHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <UploadIcon className="h-6 w-6" />
            </div>
            <CardTitle className="text-center font-display text-2xl">Upload Resource</CardTitle>
            <CardDescription className="text-center">Share your notes and materials with fellow students</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Data Structures Complete Notes" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of the resource..." rows={3} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Data Structures" required />
                </div>
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select value={semester} onValueChange={setSemester}>
                    <SelectTrigger><SelectValue placeholder="Select semester" /></SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 8 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>Semester {i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Resource Type</Label>
                <Select value={resourceType} onValueChange={setResourceType}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {resourceTypes.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>File</Label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50 px-6 py-8 transition-colors hover:border-primary hover:bg-muted">
                  <FileUp className="mb-2 h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {file ? file.name : "Click to select a file"}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">PDF, DOC, PPT, images, etc.</span>
                  <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} required />
                </label>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Uploading..." : "Share Resource"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

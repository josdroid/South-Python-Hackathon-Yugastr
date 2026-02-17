import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import ResourceCard from "@/components/ResourceCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";

const resourceTypes = [
  { value: "all", label: "All Types" },
  { value: "notes", label: "Notes" },
  { value: "question_paper", label: "Question Papers" },
  { value: "study_material", label: "Study Material" },
  { value: "reference_book", label: "Reference Books" },
  { value: "project_report", label: "Project Reports" },
  { value: "assignment", label: "Assignments" },
];

const semesters = [
  { value: "all", label: "All Semesters" },
  ...Array.from({ length: 8 }, (_, i) => ({ value: String(i + 1), label: `Semester ${i + 1}` })),
];

export default function Browse() {
  const [resources, setResources] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [semFilter, setSemFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, [typeFilter, semFilter]);

  const fetchResources = async () => {
    setLoading(true);
    let query = supabase.from("resources").select("*").order("created_at", { ascending: false });

    if (typeFilter !== "all") query = query.eq("resource_type", typeFilter);
    if (semFilter !== "all") query = query.eq("semester", parseInt(semFilter));

    const { data } = await query;
    setResources(data || []);
    setLoading(false);
  };

  const filtered = resources.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Browse Resources</h1>
          <p className="mt-1 text-muted-foreground">Discover study materials shared by your peers</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {resourceTypes.map(t => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={semFilter} onValueChange={setSemFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {semesters.map(s => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(r => (
              <ResourceCard key={r.id} {...r} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <SlidersHorizontal className="mb-3 h-12 w-12 text-muted-foreground/50" />
            <h3 className="font-display text-xl font-semibold text-foreground">No resources found</h3>
            <p className="mt-1 text-muted-foreground">Try adjusting your filters or be the first to upload!</p>
          </div>
        )}
      </div>
    </div>
  );
}

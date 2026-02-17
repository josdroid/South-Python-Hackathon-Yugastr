import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import ResourceCard from "@/components/ResourceCard";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Upload, Star } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    const [profileRes, resourcesRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("resources").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);
    setProfile(profileRes.data);
    setResources(resourcesRes.data || []);
  };

  if (!user || !profile) return null;

  const totalDownloads = resources.reduce((sum, r) => sum + r.downloads, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8 shadow-card">
          <CardContent className="flex flex-col items-center gap-4 p-8 sm:flex-row sm:items-start">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              {profile.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="font-display text-2xl font-bold text-foreground">
                {profile.full_name || "Student"}
              </h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-xl font-bold text-accent">
                  <Trophy className="h-5 w-5" />
                  {profile.points}
                </div>
                <div className="text-xs text-muted-foreground">Points</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-xl font-bold text-primary">
                  <Upload className="h-5 w-5" />
                  {resources.length}
                </div>
                <div className="text-xs text-muted-foreground">Uploads</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-xl font-bold text-teal">
                  <Star className="h-5 w-5" />
                  {totalDownloads}
                </div>
                <div className="text-xs text-muted-foreground">Downloads</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Resources */}
        <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Your Uploads</h2>
        {resources.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map(r => (
              <ResourceCard key={r.id} {...r} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            You haven't uploaded any resources yet.
          </div>
        )}
      </div>
    </div>
  );
}

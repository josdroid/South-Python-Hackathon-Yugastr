import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { BookOpen, Upload, Users, Search, Star, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Share Resources",
    description: "Upload notes, question papers, and study materials to help your peers succeed.",
  },
  {
    icon: Search,
    title: "Discover Materials",
    description: "Search and filter resources by subject, semester, and type to find what you need.",
  },
  {
    icon: Star,
    title: "Rate & Review",
    description: "Rate resources to help the best content rise to the top for everyone.",
  },
  {
    icon: Users,
    title: "Earn Recognition",
    description: "Get points for every contribution. The more you share, the more you're recognized.",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent)]" />
        <div className="container relative mx-auto px-4 py-24 text-center sm:py-32">
          <div className="animate-fade-up">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="mx-auto max-w-3xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
             Acafile — Academic Resource Sharing
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
              Share notes, question papers, and study materials with your campus community. Learn together, grow together.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/browse">
                <Button size="lg" className="gap-2 bg-white text-primary hover:bg-white/90 font-semibold px-8">
                  Browse Resources
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="gap-2 border-white/30 text-white hover:bg-white/10 px-8">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground">How It Works</h2>
          <p className="mt-2 text-muted-foreground">A simple platform for collaborative learning</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="animate-fade-up rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-elevated"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-muted/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground">Ready to share your knowledge?</h2>
          <p className="mt-2 text-muted-foreground">Join the Acafile community and start contributing today.</p>
          <Link to="/auth">
            <Button size="lg" className="mt-6 px-8">
              Create Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

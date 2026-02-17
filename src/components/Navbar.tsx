import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { BookOpen, Upload, LogOut, User } from "lucide-react";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
          <BookOpen className="h-6 w-6" />
          Acafile
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/browse">
            <Button variant="ghost" size="sm">Browse</Button>
          </Link>

          {user ? (
            <>
              <Link to="/upload">
                <Button size="sm" className="gap-1.5">
                  <Upload className="h-4 w-4" />
                  Upload
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => signOut()}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

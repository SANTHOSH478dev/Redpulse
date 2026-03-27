import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{name: string} | null>(null);

  useEffect(() => {
    const checkUser = () => {
      try {
        const data = localStorage.getItem("redpulse_user");
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed.user) setUser(parsed.user);
        } else {
          setUser(null);
        }
      } catch (e) {}
    };
    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("redpulse_user");
    setUser(null);
    setLocation("/");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/donors", label: "Find Donors" },
    { href: "/donors/register", label: "Donate Now" },
    { href: "/requests", label: "Request Blood" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-primary shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors text-white text-xl">
              🩸
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-foreground">RedPulse</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-semibold transition-colors hover:text-primary",
                    location === link.href ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-border">
              {user ? (
                <>
                  <span className="text-sm font-semibold text-foreground">Welcome, {user.name}</span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <Link href="/login">
                  <Button variant="outline">Login</Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-border/40 px-4 py-4 space-y-4 shadow-lg absolute w-full">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "block py-2 text-base font-semibold",
                location === link.href ? "text-primary" : "text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-3 border-t border-border/50">
            {user ? (
              <>
                <span className="block py-2 text-base font-semibold text-foreground">Welcome, {user.name}</span>
                <Button variant="outline" className="w-full justify-center" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>Logout</Button>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center">Login</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

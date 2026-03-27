import { Heart } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-primary" fill="currentColor" />
              <span className="font-display font-bold text-lg tracking-tight">LifeDrop</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Connecting blood donors with those in need. Every drop counts, and your donation can save up to three lives.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/donors" className="hover:text-primary transition-colors">Find Donors</Link></li>
              <li><Link href="/requests" className="hover:text-primary transition-colors">Blood Requests</Link></li>
              <li><Link href="/donors/register" className="hover:text-primary transition-colors">Register as Donor</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Emergency: 911</li>
              <li>Support: help@lifedrop.example.com</li>
              <li>Phone: +1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} LifeDrop Network. All rights reserved.</p>
          <p className="flex items-center gap-1">Made with <Heart className="w-4 h-4 text-primary" /> for humanity.</p>
        </div>
      </div>
    </footer>
  );
}

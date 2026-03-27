import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-white border-t-4 border-primary mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white text-sm">
                🩸
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-foreground">RedPulse</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Connecting blood donors with those in need. Every drop counts, and your donation can save up to three lives. Join our life-saving community today.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/donors" className="hover:text-primary transition-colors">Find Donors</Link></li>
              <li><Link href="/requests" className="hover:text-primary transition-colors">Blood Requests</Link></li>
              <li><Link href="/donors/register" className="hover:text-primary transition-colors">Donate Now</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog & Awareness</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 RedPulse | Blood Donation Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">Made with ❤️ for humanity.</p>
        </div>
      </div>
    </footer>
  );
}

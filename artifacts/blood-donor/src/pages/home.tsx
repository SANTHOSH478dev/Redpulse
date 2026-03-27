import { motion } from "framer-motion";
import { Link } from "wouter";
import { Activity, Droplet, Heart, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetStats } from "@workspace/api-client-react";

export default function Home() {
  const { data: stats, isLoading: isStatsLoading } = useGetStats();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-16 md:pt-24 pb-32">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Abstract medical background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
              <Heart className="w-4 h-4" fill="currentColor" />
              <span>Be the reason someone smiles today</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-foreground">
              Save a Life, <br className="hidden md:block" />
              <span className="red-gradient-text">Give Blood.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              Every two seconds, someone needs blood. Join our community of everyday heroes. Register as a donor today or find the blood you need for your loved ones.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/donors/register">
                <Button size="lg" className="w-full sm:w-auto px-8">
                  Register as Donor
                </Button>
              </Link>
              <Link href="/requests/new">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 bg-white/50 backdrop-blur-sm">
                  Request Blood
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard 
              icon={<Users />}
              value={isStatsLoading ? "..." : stats?.totalDonors.toString() || "0"}
              label="Registered Donors"
            />
            <StatCard 
              icon={<Shield />}
              value={isStatsLoading ? "..." : stats?.availableDonors.toString() || "0"}
              label="Available Now"
            />
            <StatCard 
              icon={<Activity />}
              value={isStatsLoading ? "..." : stats?.totalRequests.toString() || "0"}
              label="Lives Impacted"
            />
            <StatCard 
              icon={<Droplet />}
              value={isStatsLoading ? "..." : stats?.openRequests.toString() || "0"}
              label="Urgent Requests"
              highlight
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How LifeDrop Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Connecting donors with recipients quickly and securely.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6 text-primary">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">1. Register Profile</h3>
              <p className="text-muted-foreground">Sign up with your blood type and location. It takes less than 2 minutes.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6 text-primary">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">2. Get Notified</h3>
              <p className="text-muted-foreground">Receive alerts when someone in your area urgently needs your blood type.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6 text-primary">
                <Heart className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Donate & Save</h3>
              <p className="text-muted-foreground">Visit the hospital, donate blood, and give the gift of life to someone in need.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, value, label, highlight = false }: { icon: React.ReactNode, value: string, label: string, highlight?: boolean }) {
  return (
    <div className={`p-6 rounded-2xl border ${highlight ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white border-border/50 text-foreground'} text-center transition-transform hover:-translate-y-1`}>
      <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 ${highlight ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
        {icon}
      </div>
      <div className="text-3xl font-bold font-display mb-1">{value}</div>
      <div className={`text-sm font-medium ${highlight ? 'text-white/80' : 'text-muted-foreground'}`}>{label}</div>
    </div>
  );
}

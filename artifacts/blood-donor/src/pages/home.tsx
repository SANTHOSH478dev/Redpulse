import { motion } from "framer-motion";
import { Link } from "wouter";
import { Activity, Droplet, Heart, Shield, Users, ArrowRight, CheckCircle2, ChevronDown, Phone, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetStats } from "@workspace/api-client-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

export default function Home() {
  const { data: stats, isLoading: isStatsLoading } = useGetStats();
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  return (
    <div className="w-full">
      {/* 1. HERO Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-rose-700 text-white pt-24 pb-32">
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-2xl text-center md:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md font-semibold text-sm mb-6 border border-white/30">
                <Heart className="w-4 h-4" fill="currentColor" />
                <span>🩸 RedPulse Network</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                Give Blood. <br className="hidden md:block" />
                Save Lives.
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed">
                Every drop counts. Join RedPulse, the fastest growing community of blood donors connecting those in need with those who can help in real-time.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <Link href="/donors/register">
                  <Button size="lg" className="w-full sm:w-auto px-8 bg-white text-primary hover:bg-white/90 text-lg h-14">
                    Become a Donor
                  </Button>
                </Link>
                <Link href="/donors">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 border-2 border-white/50 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm text-lg h-14">
                    Find Donors
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden md:flex justify-center"
            >
              <div className="text-[12rem] filter drop-shadow-2xl">
                🫀
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. HIGHLIGHTS (3 cards) */}
      <section className="py-12 bg-white relative -mt-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Search className="w-8 h-8"/>, title: "Quick Search", desc: "Find available donors in your city within seconds." },
              { icon: <Shield className="w-8 h-8"/>, title: "Verified Donors", desc: "Our donors are registered and ready to help." },
              { icon: <Activity className="w-8 h-8"/>, title: "24/7 Access", desc: "Access the platform anytime, anywhere for emergencies." }
            ].map((highlight, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-xl shadow-black/5 border border-border flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                  {highlight.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{highlight.title}</h3>
                <p className="text-muted-foreground">{highlight.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHY IT MATTERS & ELIGIBILITY */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Blood Donation Matters</h2>
              <p className="text-muted-foreground text-lg mb-8">
                A single drop of blood can make a huge difference. Blood cannot be manufactured; it can only come from generous donors.
              </p>
              <ul className="space-y-4">
                {[
                  "Emergency situations and accident victims",
                  "Patients undergoing major surgeries",
                  "Individuals fighting cancer and severe diseases"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/about">
                  <Button variant="link" className="text-primary p-0 h-auto font-bold text-base group">
                    Learn more about our mission <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-border">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Droplet className="w-5 h-5" />
                </div>
                Eligibility Basics
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                  <div className="text-2xl font-bold text-primary w-12 text-center">18+</div>
                  <div>
                    <h4 className="font-bold text-foreground">Age Requirement</h4>
                    <p className="text-sm text-muted-foreground">Must be between 18 and 65 years old</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                  <div className="text-2xl font-bold text-primary w-12 text-center">50<span className="text-sm">kg</span></div>
                  <div>
                    <h4 className="font-bold text-foreground">Weight Limit</h4>
                    <p className="text-sm text-muted-foreground">Must weigh at least 50kg (110 lbs)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                  <div className="text-2xl font-bold text-primary w-12 text-center">❤️</div>
                  <div>
                    <h4 className="font-bold text-foreground">Good Health</h4>
                    <p className="text-sm text-muted-foreground">Must be in general good health</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LIVE STATS */}
      <section className="py-20 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">RedPulse Impact</h2>
            <p className="text-muted-foreground mt-2">Real-time statistics from our platform</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <StatCard icon={<Users />} value={isStatsLoading ? "..." : stats?.totalDonors.toString() || "0"} label="Total Donors" />
            <StatCard icon={<Activity />} value={isStatsLoading ? "..." : stats?.totalRequests.toString() || "0"} label="Total Requests" />
            <StatCard icon={<CheckCircle2 />} value={isStatsLoading ? "..." : stats?.availableDonors.toString() || "0"} label="Available Now" />
            <StatCard icon={<Droplet />} value={isStatsLoading ? "..." : stats?.openRequests.toString() || "0"} label="Urgent Requests" highlight />
          </div>
          
          <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-8 text-center border-t border-border pt-10">
            <div>
              <div className="text-4xl font-extrabold text-foreground mb-1">18,000+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Lives Saved</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-border"></div>
            <div>
              <div className="text-4xl font-extrabold text-foreground mb-1">100+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-24 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stories of Hope</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="RedPulse helped us find blood within minutes during a critical surgery. Truly lifesaving platform."
              author="Dr. Sarah Jenkins"
              role="Hospital Staff"
            />
            <TestimonialCard 
              quote="The donor registration was easy and smooth. I get notified whenever someone nearby needs my blood type."
              author="Michael Chen"
              role="Volunteer Donor"
            />
            <TestimonialCard 
              quote="A clean and reliable platform. When my mother needed O- blood urgently, RedPulse connected us with 3 donors instantly."
              author="Emily Rodriguez"
              role="Patient Family"
            />
          </div>
        </div>
      </section>

      {/* 6. BLOOD COMPATIBILITY GUIDE */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Blood Compatibility Guide</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">See who you can donate to and who you can receive from.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <CompatibilityCard type="O+" givesTo={["O+", "A+", "B+", "AB+"]} />
            <CompatibilityCard type="A+" givesTo={["A+", "AB+"]} />
            <CompatibilityCard type="B+" givesTo={["B+", "AB+"]} />
            <CompatibilityCard type="AB+" givesTo={["AB+"]} />
          </div>
          <div className="text-center mt-10">
            <p className="text-sm text-muted-foreground">* This is a basic guide. Always consult medical professionals for exact matching.</p>
          </div>
        </div>
      </section>

      {/* 7. EMERGENCY SECTION */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertCircleIcon className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl font-extrabold mb-6">Need Blood Urgently?</h2>
          <p className="text-xl text-primary-foreground/90 mb-10">
            Don't panic. Our network has thousands of active donors ready to help in emergencies.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/donors">
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 px-8 text-lg">
                <Search className="mr-2 w-5 h-5" /> Search Donors
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 px-8 text-lg">
                <Phone className="mr-2 w-5 h-5" /> Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            <FaqItem 
              idx={0} open={faqOpen} setOpen={setFaqOpen}
              question="Is blood donation safe?"
              answer="Yes, blood donation is highly safe. Sterile, single-use equipment is used for each donor, making it impossible to catch any disease from donating."
            />
            <FaqItem 
              idx={1} open={faqOpen} setOpen={setFaqOpen}
              question="How often can I donate blood?"
              answer="You must wait at least 8 weeks (56 days) between donations of whole blood. For other types of donation, intervals may vary."
            />
            <FaqItem 
              idx={2} open={faqOpen} setOpen={setFaqOpen}
              question="Who can donate blood?"
              answer="Generally, individuals who are 18 years or older, weigh at least 50kg, and are in good health are eligible to donate."
            />
          </div>
        </div>
      </section>

      {/* 9. HOSPITAL PARTNERS (Marquee) */}
      <section className="py-16 bg-secondary/30 overflow-hidden border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <h3 className="text-lg font-bold text-muted-foreground uppercase tracking-widest">Trusted By Leading Hospitals</h3>
        </div>
        <div className="flex space-x-8 animate-[marquee_20s_linear_infinite] w-max items-center px-4">
          {["City Hospital (24x7)", "Care Medical Center", "LifeCare Hospital", "HealthPlus Institute", "General Medical College", "Apex Healthcare"].map((hospital, i) => (
            <div key={i} className="px-8 py-4 bg-white rounded-xl shadow-sm border border-border whitespace-nowrap font-semibold text-foreground flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-primary">🏥</div>
              {hospital}
            </div>
          ))}
          {/* Duplicate for seamless looping */}
          {["City Hospital (24x7)", "Care Medical Center", "LifeCare Hospital", "HealthPlus Institute", "General Medical College", "Apex Healthcare"].map((hospital, i) => (
            <div key={`dup-${i}`} className="px-8 py-4 bg-white rounded-xl shadow-sm border border-border whitespace-nowrap font-semibold text-foreground flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-primary">🏥</div>
              {hospital}
            </div>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
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

function TestimonialCard({ quote, author, role }: { quote: string, author: string, role: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-border flex flex-col justify-between relative">
      <div className="text-4xl text-primary/20 absolute top-6 left-6 font-serif">"</div>
      <p className="text-foreground/80 italic mb-8 relative z-10 pt-4 leading-relaxed">{quote}</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg uppercase">
          {author[0]}
        </div>
        <div>
          <div className="font-bold text-foreground">{author}</div>
          <div className="text-sm text-muted-foreground">{role}</div>
        </div>
      </div>
    </div>
  );
}

function CompatibilityCard({ type, givesTo }: { type: string, givesTo: string[] }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-border shadow-sm text-center group hover:border-primary/30 hover:shadow-md transition-all">
      <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors border-4 border-white shadow-inner">
        <span className="font-display font-bold text-3xl text-primary group-hover:text-white">{type}</span>
      </div>
      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Can Give To</h4>
      <div className="flex flex-wrap justify-center gap-2">
        {givesTo.map(t => (
          <span key={t} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-bold">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function FaqItem({ idx, open, setOpen, question, answer }: { idx: number, open: number | null, setOpen: (i: number | null) => void, question: string, answer: string }) {
  const isOpen = open === idx;
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={() => setOpen(isOpen ? null : idx)}
      className="bg-white border border-border rounded-xl overflow-hidden shadow-sm"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full p-6 text-left font-bold text-lg hover:bg-secondary/20 transition-colors">
        {question}
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
          {answer}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function AlertCircleIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

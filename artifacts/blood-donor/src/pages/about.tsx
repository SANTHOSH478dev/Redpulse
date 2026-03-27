import { Heart, Target, Lightbulb, Users } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-[80vh] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl">
            🩸
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 font-display">About RedPulse</h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            RedPulse is a modern, real-time blood donation platform designed to bridge the gap between blood donors and patients in urgent need. We believe that technology can be harnessed to save lives.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl border border-border shadow-sm text-center">
            <Target className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-3">Our Mission</h3>
            <p className="text-muted-foreground">To ensure nobody dies due to a shortage of blood by creating a seamless, accessible network of donors.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-border shadow-sm text-center">
            <Lightbulb className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-3">Our Vision</h3>
            <p className="text-muted-foreground">A world where finding a matching blood donor is a matter of seconds, not hours of stressful searching.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-border shadow-sm text-center">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-3">How It Works</h3>
            <p className="text-muted-foreground">We use smart filtering to match urgent blood requests with the nearest available compatible donors.</p>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-3xl p-8 md:p-12 text-center border border-border">
          <h3 className="text-2xl font-bold mb-2">Developed With Purpose</h3>
          <p className="text-muted-foreground mb-6">Built by a team of passionate developers aiming to make a social impact.</p>
          <div className="flex items-center justify-center gap-2 text-foreground font-semibold">
            RedPulse Development Team <Heart className="w-4 h-4 text-primary fill-primary" /> 2026
          </div>
        </div>

      </div>
    </div>
  );
}

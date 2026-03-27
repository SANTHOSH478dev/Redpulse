import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "wouter";
import {
  Calendar, Clock, MapPin, CheckCircle2,
  Loader2, ArrowLeft, AlertCircle, Phone,
  ClipboardList, Navigation, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";

const CENTER_INFO: Record<string, { address: string; phone: string; hours: string; directions: string }> = {
  "RedPulse Blood Bank – Coimbatore": {
    address: "123 Nehru Street, RS Puram, Coimbatore – 641002",
    phone: "+91-422-255-0000",
    hours: "Mon–Sat: 8 AM – 6 PM  |  Sun: 9 AM – 2 PM",
    directions: "Near RS Puram Post Office, opposite City Mall",
  },
  "Government Medical College Hospital": {
    address: "Avinashi Road, Coimbatore – 641018",
    phone: "+91-422-230-1234",
    hours: "24 × 7 Emergency Blood Bank",
    directions: "Adjacent to Emergency Block, Gate 3",
  },
  "Private Blood Donation Center": {
    address: "45 Race Course Road, Coimbatore – 641018",
    phone: "+91-422-242-9999",
    hours: "Mon–Sat: 7 AM – 8 PM",
    directions: "Ground floor, Medipoint Building",
  },
};

const CHECKLIST = [
  "Carry a valid government-issued photo ID (Aadhaar / Passport / Driving Licence)",
  "Drink at least 500 ml of water before arriving",
  "Eat a light meal 2–3 hours before donation",
  "Avoid fatty foods, alcohol, and smoking for 24 hours",
  "Wear comfortable clothing with sleeves that roll up easily",
  "Get a good night's sleep before the appointment",
];

export default function AppointmentStatus() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(10);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAppointment = async () => {
    try {
      const res = await fetch(`/api/appointments/${id}`);
      if (!res.ok) throw new Error("Appointment not found");
      const data = await res.json();
      setAppointment(data);

      if (data.status === "Approved") {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (countdownRef.current) clearInterval(countdownRef.current);
      }
    } catch (err: any) {
      setError(err.message);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();

    // Poll every 2 seconds to catch approval quickly
    intervalRef.current = setInterval(fetchAppointment, 2000);

    // Count down from 10 to show "approving in X sec"
    countdownRef.current = setInterval(() => {
      setCountdown(prev => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Loading appointment details…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-primary mb-4">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Appointment Not Found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find an appointment with that ID.</p>
        <Link href="/"><Button>Return Home</Button></Link>
      </div>
    );
  }

  const isApproved = appointment?.status === "Approved";
  const centerInfo = CENTER_INFO[appointment?.center] ?? null;

  return (
    <div className="min-h-screen bg-secondary/30 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Back link */}
        <Link href="/donors/register" className="inline-flex items-center text-muted-foreground hover:text-foreground font-medium transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Appointments
        </Link>

        {/* Status Banner */}
        <div className={`rounded-3xl overflow-hidden shadow-xl shadow-black/10 transition-all duration-700 ${
          isApproved
            ? "bg-gradient-to-br from-green-500 to-green-600"
            : "bg-gradient-to-br from-amber-400 to-orange-500"
        }`}>
          <div className="p-10 text-center text-white">
            {isApproved ? (
              <CheckCircle2 className="w-20 h-20 mx-auto mb-5 drop-shadow" />
            ) : (
              <Loader2 className="w-20 h-20 mx-auto mb-5 animate-spin drop-shadow" />
            )}
            <h1 className="text-4xl font-extrabold mb-3">
              {isApproved ? "Appointment Approved! ✅" : "Under Review…"}
            </h1>
            <p className="text-white/90 text-lg">
              {isApproved
                ? "Your slot is confirmed. We look forward to seeing you!"
                : `Approval usually takes less than 10 seconds. Please wait… (${countdown}s)`}
            </p>
          </div>

          {/* Approval progress bar */}
          {!isApproved && (
            <div className="bg-white/20 h-2">
              <div
                className="bg-white h-2 transition-all duration-1000"
                style={{ width: `${((10 - countdown) / 10) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Appointment Details Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-border overflow-hidden">
          <div className="px-8 py-5 border-b border-border bg-secondary/30">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              Appointment Details
            </h2>
          </div>
          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <DetailItem icon={<Calendar />} label="Date" value={appointment?.date} />
            <DetailItem icon={<Clock />} label="Time" value={appointment?.time} />
            <DetailItem icon={<MapPin />} label="Center" value={appointment?.center} full />
            <DetailItem
              icon={<Heart className="text-primary" />}
              label="Status"
              value={appointment?.status}
              valueClass={isApproved ? "text-green-600 font-bold" : "text-amber-600 font-bold"}
              full
            />
          </div>
          <div className="px-8 py-4 bg-secondary/20 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Booked by <span className="font-semibold text-foreground">{appointment?.donorName}</span>
              {" "}({appointment?.donorEmail})
            </p>
          </div>
        </div>

        {/* Center Info — only show once approved */}
        {isApproved && centerInfo && (
          <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-green-200 overflow-hidden">
            <div className="px-8 py-5 border-b border-green-100 bg-green-50">
              <h2 className="text-xl font-bold text-green-700 flex items-center gap-2">
                <Navigation className="w-5 h-5" />
                Visit Your Donation Center
              </h2>
              <p className="text-sm text-green-600 mt-1">
                Please arrive 10 minutes early and carry the items listed below.
              </p>
            </div>
            <div className="p-8 space-y-4">
              <InfoRow icon={<MapPin className="text-primary" />} label="Address" value={centerInfo.address} />
              <InfoRow icon={<Phone className="text-primary" />} label="Phone" value={centerInfo.phone} />
              <InfoRow icon={<Clock className="text-primary" />} label="Hours" value={centerInfo.hours} />
              <InfoRow icon={<Navigation className="text-primary" />} label="Directions" value={centerInfo.directions} />
            </div>
          </div>
        )}

        {/* Pre-donation Checklist — always visible */}
        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-border overflow-hidden">
          <div className="px-8 py-5 border-b border-border bg-secondary/30">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              Pre-Donation Checklist
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Follow these steps before visiting the center.
            </p>
          </div>
          <ul className="p-8 space-y-4">
            {CHECKLIST.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-foreground text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pb-8">
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full h-12">Back to Home</Button>
          </Link>
          <Link href="/donors" className="flex-1">
            <Button className="w-full h-12">Find More Donors</Button>
          </Link>
        </div>

      </div>
    </div>
  );
}

function DetailItem({
  icon, label, value, full, valueClass
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  full?: boolean;
  valueClass?: string;
}) {
  return (
    <div className={`flex items-start gap-4 ${full ? "sm:col-span-2" : ""}`}>
      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">{label}</div>
        <div className={`font-bold text-lg ${valueClass ?? "text-foreground"}`}>{value}</div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</div>
        <div className="text-foreground font-medium mt-0.5">{value}</div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { Calendar, Clock, MapPin, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppointmentStatus() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApt = async () => {
      try {
        const res = await fetch(`/api/appointments/${id}`);
        if (!res.ok) throw new Error("Appointment not found");
        const data = await res.json();
        setAppointment(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApt();

    // Poll every 3 seconds to check status update
    const interval = setInterval(fetchApt, 3000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Loading appointment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-primary mb-4 text-3xl">✖</div>
        <h2 className="text-2xl font-bold mb-2">Not Found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find an appointment with that ID.</p>
        <Link href="/"><Button>Return Home</Button></Link>
      </div>
    );
  }

  const isApproved = appointment?.status === "approved";

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-secondary/30">
      <div className="w-full max-w-md">
        <Link href="/donors/register" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        
        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-border overflow-hidden">
          <div className={`p-8 text-center text-white ${isApproved ? 'bg-green-500' : 'bg-yellow-500'}`}>
            {isApproved ? (
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4" />
            ) : (
              <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin" />
            )}
            <h1 className="text-3xl font-bold font-display mb-2">
              {isApproved ? 'Appointment Approved' : 'Under Review'}
            </h1>
            <p className="text-white/90">
              {isApproved 
                ? 'Your appointment is confirmed. See you soon!' 
                : 'Please wait while we confirm your time slot.'}
            </p>
          </div>

          <div className="p-8">
            <h3 className="font-bold text-lg mb-6 border-b border-border pb-2">Appointment Details</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-semibold">Date</div>
                  <div className="font-bold text-foreground text-lg">{appointment?.date}</div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-semibold">Time</div>
                  <div className="font-bold text-foreground text-lg">{appointment?.time}</div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-semibold">Location</div>
                  <div className="font-bold text-foreground">{appointment?.center}</div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-secondary/50 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">Donor:</span> {appointment?.donorName} ({appointment?.donorEmail})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

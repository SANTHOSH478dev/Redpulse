import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useCreateDonor } from "@workspace/api-client-react";
import { BLOOD_TYPES } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, Clock, MapPin } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  age: z.coerce.number().min(18, "Must be at least 18 years old").max(65, "Age limit is 65"),
  bloodType: z.string().min(1, "Blood type is required"),
  city: z.string().min(2, "City is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  lastDonation: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const appointmentCenters = [
  "RedPulse Blood Bank – Coimbatore",
  "Government Medical College Hospital",
  "Private Blood Donation Center"
];

export default function RegisterDonor() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createDonorMutation = useCreateDonor();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [aptDate, setAptDate] = useState("");
  const [aptTime, setAptTime] = useState("");
  const [aptCenter, setAptCenter] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("redpulse_user");
    if (userStr) {
      setIsLoggedIn(true);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await createDonorMutation.mutateAsync({ 
        data: {
          name: data.name,
          bloodType: data.bloodType,
          city: data.city,
          phone: data.phone,
          email: data.email,
          age: data.age,
          password: data.password,
          lastDonation: data.lastDonation || undefined
        } 
      });

      const authRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password
        })
      });

      if (!authRes.ok) throw new Error("Auth registration failed");

      const authData = await authRes.json();
      localStorage.setItem("redpulse_user", JSON.stringify(authData));
      window.dispatchEvent(new Event('storage'));

      toast({
        title: "Registration successful!",
        description: "Thank you for registering with RedPulse.",
      });
      setLocation("/donors");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!aptDate || !aptTime || !aptCenter) {
      toast({ title: "Please fill all appointment fields", variant: "destructive" });
      return;
    }

    try {
      setIsBooking(true);
      const userStr = localStorage.getItem("redpulse_user");
      const user = userStr ? JSON.parse(userStr).user : null;

      if (!user) throw new Error("Not logged in");

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorEmail: user.email,
          donorName: user.name,
          date: aptDate,
          time: aptTime,
          center: aptCenter
        })
      });

      if (!res.ok) throw new Error("Booking failed");
      
      const aptData = await res.json();
      toast({ title: "Appointment booked successfully!" });
      setLocation(`/appointment-status/${aptData.id}`);
    } catch(err) {
      toast({ title: "Failed to book appointment", variant: "destructive" });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12">
      
      {!isLoggedIn && (
        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 overflow-hidden border border-border">
          <div className="bg-primary px-8 py-12 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 text-white/10">
              <Heart className="w-64 h-64" fill="currentColor" />
            </div>
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Join the RedPulse Network</h1>
              <p className="text-primary-foreground/90 max-w-lg mx-auto text-lg">
                Your donation can save up to 3 lives. Register today.
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Full Name</label>
                  <Input placeholder="John Doe" {...register("name")} />
                  {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Age</label>
                  <Input type="number" placeholder="18" {...register("age")} />
                  {errors.age && <p className="text-destructive text-sm">{errors.age.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Blood Type</label>
                  <Select {...register("bloodType")}>
                    <option value="">Select Type</option>
                    {BLOOD_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Select>
                  {errors.bloodType && <p className="text-destructive text-sm">{errors.bloodType.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">City/Location</label>
                  <Input placeholder="New York, NY" {...register("city")} />
                  {errors.city && <p className="text-destructive text-sm">{errors.city.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Phone Number</label>
                  <Input type="tel" placeholder="+1 (555) 000-0000" {...register("phone")} />
                  {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Email Address</label>
                  <Input type="email" placeholder="john@example.com" {...register("email")} />
                  {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Password</label>
                  <Input type="password" placeholder="••••••••" {...register("password")} />
                  {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Confirm Password</label>
                  <Input type="password" placeholder="••••••••" {...register("confirmPassword")} />
                  {errors.confirmPassword && <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-foreground">Last Donation Date (Optional)</label>
                  <Input type="date" {...register("lastDonation")} />
                </div>
              </div>

              <div className="pt-6">
                <Button type="submit" size="lg" className="w-full h-14 text-lg" isLoading={createDonorMutation.isPending}>
                  Register & Create Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoggedIn && (
        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 overflow-hidden border border-border">
          <div className="p-8 border-b border-border bg-secondary/30">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Calendar className="text-primary w-6 h-6" />
              Book a Donation Appointment
            </h2>
            <p className="text-muted-foreground mt-2">Skip the queue by scheduling your visit to a RedPulse center.</p>
          </div>
          <div className="p-8">
            <form onSubmit={handleBookAppointment} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" /> Date
                  </label>
                  <Input 
                    type="date" 
                    value={aptDate}
                    onChange={(e) => setAptDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" /> Time
                  </label>
                  <Input 
                    type="time" 
                    value={aptTime}
                    onChange={(e) => setAptTime(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" /> Donation Center
                  </label>
                  <Select value={aptCenter} onChange={(e) => setAptCenter(e.target.value)} required>
                    <option value="">Select a center...</option>
                    {appointmentCenters.map(center => (
                      <option key={center} value={center}>{center}</option>
                    ))}
                  </Select>
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full h-14" disabled={isBooking}>
                {isBooking ? "Booking..." : "Confirm Appointment"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

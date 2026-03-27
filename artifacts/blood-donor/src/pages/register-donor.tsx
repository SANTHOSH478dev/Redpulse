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
import { Heart } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  bloodType: z.string().min(1, "Blood type is required"),
  city: z.string().min(2, "City is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  lastDonation: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterDonor() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createDonorMutation = useCreateDonor();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await createDonorMutation.mutateAsync({ data });
      toast({
        title: "Registration successful!",
        description: "Thank you for registering as a blood donor.",
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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="bg-white rounded-3xl shadow-xl shadow-black/5 overflow-hidden border border-border">
        <div className="bg-primary px-8 py-12 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 text-white/10">
            <Heart className="w-64 h-64" fill="currentColor" />
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Join the Donor Registry</h1>
            <p className="text-primary-foreground/90 max-w-lg mx-auto text-lg">
              Your donation can save up to 3 lives. Register today to be notified when someone needs your blood type.
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

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-foreground">Email Address</label>
                <Input type="email" placeholder="john@example.com" {...register("email")} />
                {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-foreground">Last Donation Date (Optional)</label>
                <Input type="date" {...register("lastDonation")} />
                <p className="text-xs text-muted-foreground">Helps us know when you're eligible to donate again (typically 56 days).</p>
              </div>
            </div>

            <div className="pt-6">
              <Button 
                type="submit" 
                size="lg" 
                className="w-full"
                isLoading={createDonorMutation.isPending}
              >
                Complete Registration
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

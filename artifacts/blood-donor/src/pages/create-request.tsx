import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useCreateBloodRequest } from "@workspace/api-client-react";
import { BLOOD_TYPES } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const requestSchema = z.object({
  patientName: z.string().min(2, "Patient name is required"),
  bloodType: z.string().min(1, "Blood type is required"),
  hospital: z.string().min(2, "Hospital name is required"),
  city: z.string().min(2, "City is required"),
  contactPhone: z.string().min(10, "Valid contact number required"),
  unitsNeeded: z.coerce.number().min(1, "At least 1 unit needed").max(20, "Cannot exceed 20 units"),
  urgency: z.enum(["low", "medium", "high", "critical"]),
  notes: z.string().optional(),
});

type RequestFormValues = z.infer<typeof requestSchema>;

export default function CreateRequest() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createMutation = useCreateBloodRequest();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      unitsNeeded: 1,
      urgency: "medium",
    }
  });

  const onSubmit = async (data: RequestFormValues) => {
    try {
      await createMutation.mutateAsync({ data });
      toast({
        title: "Request Created",
        description: "Your blood request has been published to the network.",
      });
      setLocation("/requests");
    } catch (error) {
      toast({
        title: "Failed to create request",
        description: "Please check the form and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="bg-white rounded-3xl shadow-2xl shadow-black/5 overflow-hidden border border-border">
        <div className="bg-gradient-to-r from-primary to-rose-600 px-8 py-10 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <AlertCircle className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Request Blood</h1>
            <p className="text-white/90 max-w-lg text-lg">
              Post an urgent need. We'll notify matching donors in your area immediately.
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-foreground">Patient Name or ID</label>
                <Input placeholder="John Doe" {...register("patientName")} />
                {errors.patientName && <p className="text-destructive text-sm">{errors.patientName.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Blood Type Needed</label>
                <Select {...register("bloodType")}>
                  <option value="">Select Type</option>
                  {BLOOD_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Select>
                {errors.bloodType && <p className="text-destructive text-sm">{errors.bloodType.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Units Needed</label>
                <Input type="number" min={1} max={20} {...register("unitsNeeded")} />
                {errors.unitsNeeded && <p className="text-destructive text-sm">{errors.unitsNeeded.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Urgency Level</label>
                <Select {...register("urgency")}>
                  <option value="critical">Emergency (Within 24 hours)</option>
                  <option value="high">Urgent (1-2 days)</option>
                  <option value="medium">Planned</option>
                  <option value="low">Low Priority</option>
                </Select>
                {errors.urgency && <p className="text-destructive text-sm">{errors.urgency.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Contact Phone</label>
                <Input type="tel" placeholder="+1 (555) 000-0000" {...register("contactPhone")} />
                {errors.contactPhone && <p className="text-destructive text-sm">{errors.contactPhone.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Hospital/Clinic Name</label>
                <Input placeholder="General Hospital" {...register("hospital")} />
                {errors.hospital && <p className="text-destructive text-sm">{errors.hospital.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">City/Location</label>
                <Input placeholder="New York, NY" {...register("city")} />
                {errors.city && <p className="text-destructive text-sm">{errors.city.message}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-foreground">Additional Notes (Optional)</label>
                <textarea 
                  className="flex w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all min-h-[100px]"
                  placeholder="Any specific instructions for donors..."
                  {...register("notes")}
                />
              </div>
            </div>

            <div className="pt-6">
              <Button 
                type="submit" 
                size="lg" 
                className="w-full shadow-lg shadow-primary/20 h-14 text-lg"
                isLoading={createMutation.isPending}
              >
                Post Blood Request
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

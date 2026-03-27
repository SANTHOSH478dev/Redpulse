import { useState } from "react";
import { Link } from "wouter";
import { useGetBloodRequests, useUpdateBloodRequest } from "@workspace/api-client-react";
import { BLOOD_TYPES } from "@/lib/utils";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building2, MapPin, Phone, AlertCircle, Plus, Info } from "lucide-react";
import { format } from "date-fns";

export default function Requests() {
  const [bloodType, setBloodType] = useState<string>("");
  const [urgency, setUrgency] = useState<string>("");
  const { toast } = useToast();

  const { data: requests, isLoading, refetch } = useGetBloodRequests({
    bloodType: bloodType || undefined,
    urgency: urgency || undefined,
  });

  const updateMutation = useUpdateBloodRequest();

  const handleFulfill = async (id: number) => {
    try {
      await updateMutation.mutateAsync({ id, data: { status: "fulfilled" } });
      toast({ title: "Status updated to fulfilled!", description: "Thank you for saving a life." });
      refetch();
    } catch (e) {
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch(urgency) {
      case 'critical': return <Badge className="bg-red-600 hover:bg-red-700 text-white border-0"><AlertCircle className="w-3 h-3 mr-1"/> Critical</Badge>;
      case 'high': return <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0">High</Badge>;
      case 'medium': return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-0">Medium</Badge>;
      case 'low': return <Badge className="bg-green-500 hover:bg-green-600 text-white border-0">Low</Badge>;
      default: return <Badge variant="secondary">{urgency}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-white py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Blood Requests</h1>
            <p className="text-primary-foreground/90 text-lg max-w-xl">
              Real-time feed of patients needing blood. Filter by your blood type and step up to help.
            </p>
          </div>
          <Link href="/requests/new">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg h-14 px-8 shadow-lg">
              <Plus className="w-5 h-5 mr-2" /> Post New Request
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10 relative z-10">
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 flex items-center gap-3 text-yellow-800 shadow-sm">
          <Info className="w-5 h-5 shrink-0" />
          <span className="font-medium text-sm md:text-base">Please submit requests only for genuine medical needs. Frivolous requests will be removed.</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Select 
            value={bloodType} 
            onChange={(e) => setBloodType(e.target.value)}
            className="w-full sm:w-[200px] bg-white h-12"
          >
            <option value="">All Blood Types</option>
            {BLOOD_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>
          <Select 
            value={urgency} 
            onChange={(e) => setUrgency(e.target.value)}
            className="w-full sm:w-[200px] bg-white h-12"
          >
            <option value="">All Urgency Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-border h-56 animate-pulse" />
            ))}
          </div>
        ) : requests?.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-border shadow-sm">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Info className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No Active Requests</h3>
            <p className="text-muted-foreground">There are currently no blood requests matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {requests?.map((request) => (
              <div 
                key={request.id} 
                className={`bg-white rounded-2xl overflow-hidden border ${request.status === 'fulfilled' ? 'border-border/50 bg-secondary/20 opacity-70 grayscale-[0.5]' : 'border-border shadow-md hover:shadow-lg transition-all'}`}
              >
                <div className="p-6 md:p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-5 items-start">
                      <div className="w-16 h-16 rounded-xl bg-primary text-white flex flex-col items-center justify-center shadow-inner shrink-0">
                        <span className="font-display font-bold text-2xl leading-none">{request.bloodType}</span>
                        <span className="text-[10px] uppercase font-bold mt-1 opacity-80">{request.unitsNeeded} Units</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-xl mb-2 text-foreground">{request.patientName}</h3>
                        <div className="flex items-center text-sm text-muted-foreground gap-2 mb-1.5">
                          <Building2 className="w-4 h-4 shrink-0 text-primary/60" />
                          <span className="font-medium">{request.hospital}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                          <MapPin className="w-4 h-4 shrink-0 text-primary/60" />
                          <span>{request.city}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {getUrgencyBadge(request.urgency)}
                      <span className="text-xs text-muted-foreground font-medium mt-1">
                        {format(new Date(request.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>

                  {request.notes && (
                    <div className="bg-secondary/50 rounded-xl p-4 text-sm text-foreground/80 mb-6 italic border-l-4 border-secondary-foreground/20">
                      "{request.notes}"
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/50">
                    <a href={`tel:${request.contactPhone}`} className="flex items-center gap-3 text-foreground font-bold hover:text-primary transition-colors w-full sm:w-auto p-3 sm:p-0 rounded-lg bg-secondary sm:bg-transparent justify-center sm:justify-start">
                      <div className="w-10 h-10 sm:w-8 sm:h-8 rounded-full bg-white sm:bg-primary/10 flex items-center justify-center text-primary shadow-sm sm:shadow-none">
                        <Phone className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                      </div>
                      {request.contactPhone}
                    </a>
                    
                    {request.status === 'open' ? (
                      <Button 
                        onClick={() => handleFulfill(request.id)}
                        disabled={updateMutation.isPending}
                        className="w-full sm:w-auto h-12 sm:h-10"
                      >
                        Mark as Fulfilled
                      </Button>
                    ) : (
                      <Badge className="bg-green-100 text-green-800 border-0 px-4 py-2 w-full sm:w-auto justify-center text-sm">Fulfilled</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

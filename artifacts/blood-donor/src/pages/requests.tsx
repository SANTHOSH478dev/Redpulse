import { useState } from "react";
import { Link } from "wouter";
import { useGetBloodRequests, useUpdateBloodRequest } from "@workspace/api-client-react";
import { BLOOD_TYPES } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building2, MapPin, Phone, AlertCircle, Search, Droplet, Plus, CheckCircle2 } from "lucide-react";
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
      toast({ title: "Status updated to fulfilled!" });
      refetch();
    } catch (e) {
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Blood Requests</h1>
          <p className="text-muted-foreground">Current urgent needs at hospitals and clinics.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          <Select 
            value={bloodType} 
            onChange={(e) => setBloodType(e.target.value)}
            className="w-full sm:w-[150px]"
          >
            <option value="">All Types</option>
            {BLOOD_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>
          <Select 
            value={urgency} 
            onChange={(e) => setUrgency(e.target.value)}
            className="w-full sm:w-[150px]"
          >
            <option value="">All Urgency</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
          <Link href="/requests/new" className="w-full sm:w-auto">
            <Button className="w-full gap-2">
              <Plus className="w-4 h-4" /> New Request
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-border h-56 animate-pulse" />
          ))}
        </div>
      ) : requests?.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-border">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">No Active Requests</h3>
          <p className="text-muted-foreground">There are currently no blood requests matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {requests?.map((request) => (
            <div 
              key={request.id} 
              className={`bg-white rounded-2xl overflow-hidden border border-border/60 shadow-sm transition-all duration-300 hover:shadow-xl ${request.status === 'fulfilled' ? 'opacity-60' : ''}`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex flex-col items-center justify-center border border-primary/20 shadow-sm shrink-0">
                      <span className="font-display font-bold text-xl leading-none">{request.bloodType}</span>
                      <span className="text-[10px] uppercase font-bold mt-0.5">{request.unitsNeeded} Units</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-1">{request.patientName}</h3>
                      <div className="flex items-center text-sm text-muted-foreground gap-1.5 mb-1">
                        <Building2 className="w-4 h-4 shrink-0" />
                        <span className="truncate">{request.hospital}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span>{request.city}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getUrgencyColor(request.urgency)} flex items-center gap-1.5`}>
                      <AlertCircle className="w-3.5 h-3.5" />
                      {request.urgency}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(request.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>

                {request.notes && (
                  <div className="bg-secondary/50 rounded-xl p-4 text-sm text-foreground/80 mb-6 italic border border-secondary">
                    "{request.notes}"
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/50">
                  <a href={`tel:${request.contactPhone}`} className="flex items-center gap-2 text-foreground font-semibold hover:text-primary transition-colors">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
                      <Phone className="w-4 h-4" />
                    </div>
                    {request.contactPhone}
                  </a>
                  
                  {request.status === 'open' ? (
                    <Button 
                      onClick={() => handleFulfill(request.id)}
                      disabled={updateMutation.isPending}
                    >
                      Mark as Fulfilled
                    </Button>
                  ) : (
                    <Badge variant="success" className="px-4 py-1.5 text-sm">Fulfilled</Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

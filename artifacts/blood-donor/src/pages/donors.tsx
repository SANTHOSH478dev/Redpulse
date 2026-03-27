import { useState } from "react";
import { useGetDonors } from "@workspace/api-client-react";
import { BLOOD_TYPES } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Search, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

export default function Donors() {
  const [bloodType, setBloodType] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [availability, setAvailability] = useState<string>("");

  const { data: donors, isLoading } = useGetDonors({
    bloodType: bloodType || undefined,
    city: city || undefined,
    available: availability || undefined,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Find Blood Donors</h1>
          <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
            Search our verified network of volunteer donors. Contact them directly to request a donation.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10 relative z-10">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-border mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex w-full md:w-auto gap-4 flex-col sm:flex-row">
            <Select 
              value={bloodType} 
              onChange={(e) => setBloodType(e.target.value)}
              className="w-full sm:w-[180px] h-12"
            >
              <option value="">Blood Type (All)</option>
              {BLOOD_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
            <Select 
              value={availability} 
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full sm:w-[180px] h-12"
            >
              <option value="">Availability (All)</option>
              <option value="true">Available Now</option>
              <option value="false">Unavailable</option>
            </Select>
            <div className="relative w-full sm:w-[250px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="Filter by city..." 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="pl-11 h-12"
              />
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => { setBloodType(""); setCity(""); setAvailability(""); }}
            className="h-12"
          >
            Clear Filters
          </Button>
        </div>

        <div className="bg-red-50 border-l-4 border-primary p-4 rounded-r-lg mb-8 flex items-start gap-3">
          <AlertTriangle className="text-primary w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-primary font-bold">Emergency Situation?</h4>
            <p className="text-sm text-red-900 mt-1">If you need blood immediately, please consider posting a Blood Request so matching donors can be notified automatically.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-border h-48 animate-pulse" />
            ))}
          </div>
        ) : donors?.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-border shadow-sm">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No donors found</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">We couldn't find any donors matching your current filters. Try expanding your search area or post a request instead.</p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => { setBloodType(""); setCity(""); }}>Clear Filters</Button>
              <Link href="/requests/new"><Button>Post Blood Request</Button></Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donors?.map((donor) => (
              <div key={donor.id} className="bg-white rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 z-0"></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-display font-bold text-2xl shadow-md border-4 border-red-100">
                      {donor.bloodType}
                    </div>
                    <div>
                      <div className="font-bold text-xl mb-1 text-foreground">{donor.name}</div>
                      <div className="flex items-center text-sm text-muted-foreground gap-1 font-medium">
                        <MapPin className="w-4 h-4 text-primary/70" />
                        {donor.city}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6 flex gap-2">
                  {donor.isAvailable ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 shadow-none">Available Now</Badge>
                  ) : (
                    <Badge variant="secondary" className="shadow-none">Unavailable</Badge>
                  )}
                </div>
                
                <div className="space-y-3 pt-4 border-t border-border/50">
                  <a href={`tel:${donor.phone}`} className="flex items-center gap-3 text-sm font-semibold text-foreground hover:text-primary transition-colors p-2 -mx-2 rounded-lg hover:bg-primary/5">
                    <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-primary">
                      <Phone className="w-4 h-4" />
                    </div>
                    {donor.phone}
                  </a>
                  <a href={`mailto:${donor.email}`} className="flex items-center gap-3 text-sm font-semibold text-foreground hover:text-primary transition-colors p-2 -mx-2 rounded-lg hover:bg-primary/5">
                    <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-primary">
                      <Mail className="w-4 h-4" />
                    </div>
                    {donor.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

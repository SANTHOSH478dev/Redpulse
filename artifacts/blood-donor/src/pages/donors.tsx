import { useState } from "react";
import { useGetDonors } from "@workspace/api-client-react";
import { BLOOD_TYPES } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Search, Droplet } from "lucide-react";

export default function Donors() {
  const [bloodType, setBloodType] = useState<string>("");
  const [city, setCity] = useState<string>("");

  const { data: donors, isLoading } = useGetDonors({
    bloodType: bloodType || undefined,
    city: city || undefined,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Donor Directory</h1>
          <p className="text-muted-foreground">Find and contact available blood donors in your area.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
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
          <div className="relative w-full sm:w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Filter by city..." 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-border h-48 animate-pulse flex flex-col justify-between">
              <div className="flex justify-between">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="w-12 h-6 bg-gray-200 rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : donors?.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-border">
          <Droplet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No donors found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => { setBloodType(""); setCity(""); }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donors?.map((donor) => (
            <div key={donor.id} className="bg-white rounded-2xl p-6 border border-border/60 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="font-bold text-xl mb-1 group-hover:text-primary transition-colors">{donor.name}</div>
                  <div className="flex items-center text-sm text-muted-foreground gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {donor.city}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-bold text-lg border border-primary/20 shadow-inner">
                    {donor.bloodType}
                  </div>
                  {donor.isAvailable ? (
                    <Badge variant="success">Available</Badge>
                  ) : (
                    <Badge variant="secondary">Unavailable</Badge>
                  )}
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-border/50">
                <a href={`tel:${donor.phone}`} className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors p-2 -mx-2 rounded-lg hover:bg-primary/5">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
                    <Phone className="w-4 h-4" />
                  </div>
                  {donor.phone}
                </a>
                <a href={`mailto:${donor.email}`} className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors p-2 -mx-2 rounded-lg hover:bg-primary/5">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
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
  );
}

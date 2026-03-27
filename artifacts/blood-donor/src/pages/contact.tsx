import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-[80vh]">
      {/* Hero */}
      <div className="bg-primary text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Contact Us</h1>
        <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
          We're here to help. Whether you have a question about donating, or need emergency assistance finding blood.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10">
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Info Card 1 */}
          <div className="bg-white rounded-2xl shadow-lg border border-border p-8 md:p-10 relative z-10">
            <h2 className="text-2xl font-bold mb-6 font-display">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Headquarters</h4>
                  <p className="text-muted-foreground">123 Health Avenue, Medical District<br/>New York, NY 10001</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Phone</h4>
                  <p className="text-muted-foreground">+1 (555) 123-4567<br/>Toll-free: 1-800-REDPULSE</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Email</h4>
                  <p className="text-muted-foreground">support@redpulse.org<br/>emergencies@redpulse.org</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Card 2 */}
          <div className="bg-white rounded-2xl shadow-lg border border-border p-8 md:p-10 relative z-10">
            <h2 className="text-2xl font-bold mb-6 font-display">Hospital & Emergency Support</h2>
            <p className="text-muted-foreground mb-8">
              For hospitals, clinics, and emergency responders requiring immediate access to our donor database.
            </p>
            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
              <div className="flex items-center gap-3 mb-2 text-primary font-bold">
                <Clock className="w-5 h-5" /> 24/7 Emergency Hotline
              </div>
              <div className="text-3xl font-extrabold text-foreground mb-2">911-BLOOD</div>
              <p className="text-sm text-red-800">Only for verified medical professionals and critical emergencies.</p>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden h-[400px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.2527998699!2d-74.14448787425355!3d40.69763123337424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s" 
            width="100%" 
            height="100%" 
            style={{border:0}} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

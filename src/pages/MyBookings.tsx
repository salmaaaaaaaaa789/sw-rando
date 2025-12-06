import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { Calendar, MapPin, Users, CreditCard, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface Booking {
  id: string;
  voyage_id: string;
  full_name: string;
  email: string;
  phone: string;
  participants: number;
  travel_date: string;
  special_requests: string | null;
  payment_method: string;
  total_amount: number;
  status: string;
  created_at: string;
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // In a real app, you'd filter by the current user's email
      // For now, we'll fetch all bookings
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        return;
      }

      setBookings(data || []);
    } catch (error) {
      console.error('Error in fetchBookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <WhatsAppButton />

      {/* Header */}
      <section className="pt-32 pb-16 gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-white">Mes Réservations</h1>
          <p className="text-xl max-w-3xl mx-auto text-white/90">
            Gérez et suivez toutes vos réservations de voyage
          </p>
        </div>
      </section>

      {/* Bookings List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <p>Chargement de vos réservations...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-4">Aucune réservation</h2>
                <p className="text-muted-foreground mb-6">
                  Vous n'avez pas encore effectué de réservation
                </p>
                <Button asChild>
                  <Link to="/voyages">Découvrir nos voyages</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="border-none shadow-card hover:shadow-lg transition-smooth">
                    <CardHeader className="border-b">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <CardTitle>Réservation #{booking.id.substring(0, 8)}</CardTitle>
                        <Badge className={`mt-2 md:mt-0 ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold mb-3">Détails du voyage</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary" />
                              <span>{booking.voyage_id}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-primary" />
                              <span>Départ: {formatDate(booking.travel_date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-primary" />
                              <span>{booking.participants} participant(s)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-primary" />
                              <span>Méthode: {booking.payment_method}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold mb-3">Informations client</h3>
                          <div className="space-y-2">
                            <p><span className="font-medium">Nom:</span> {booking.full_name}</p>
                            <p><span className="font-medium">Email:</span> {booking.email}</p>
                            <p><span className="font-medium">Téléphone:</span> {booking.phone}</p>
                            <p><span className="font-medium">Montant total:</span> {booking.total_amount}€</p>
                          </div>
                        </div>
                      </div>
                      
                      {booking.special_requests && (
                        <div className="mt-6 pt-4 border-t">
                          <h4 className="font-semibold mb-2">Demandes spéciales</h4>
                          <p className="text-muted-foreground">{booking.special_requests}</p>
                        </div>
                      )}
                      
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Button variant="outline" size="sm">Modifier</Button>
                        <Button variant="outline" size="sm">Contacter</Button>
                        <Button size="sm">Voir le devis</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MyBookings;
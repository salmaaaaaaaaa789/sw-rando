import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calendar, MapPin, Users, CreditCard, Clock } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const formSchema = z.object({
  voyageTitle: z.string().min(1, "Veuillez sélectionner un voyage"),
  fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  email: z.string().email("Email invalide").max(255),
  phone: z.string().min(10, "Numéro de téléphone invalide").max(20),
  participants: z.number().min(1, "Au moins 1 participant requis").max(20, "Max 20 participants"),
  travelDate: z.string().min(1, "Veuillez sélectionner une date"),
  specialRequests: z.string().max(500).optional(),
  paymentMethod: z.string().min(1, "Veuillez sélectionner un mode de paiement"),
});

type FormValues = z.infer<typeof formSchema>;

const Booking = () => {
  const { voyageId } = useParams<{ voyageId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock voyage data - in a real app, this would come from an API
  const voyage = {
    id: voyageId || "1",
    title: "Trek au Sommet du Monde",
    location: "Himalaya, Népal",
    duration: "14 jours",
    price: 2990,
    difficulty: "Difficile"
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      voyageTitle: voyage.title,
      fullName: "",
      email: "",
      phone: "",
      participants: 1,
      travelDate: "",
      specialRequests: "",
      paymentMethod: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("bookings").insert({
        voyage_id: values.voyageTitle,
        full_name: values.fullName,
        email: values.email,
        phone: values.phone,
        participants: values.participants,
        travel_date: values.travelDate,
        special_requests: values.specialRequests,
        payment_method: values.paymentMethod,
        total_amount: values.participants * voyage.price,
        status: "pending",
        created_at: new Date().toISOString(),
      });

      if (error) {
        throw error;
      }

      toast.success("Réservation effectuée avec succès !", {
        description: "Nous vous contacterons bientôt pour confirmer votre réservation.",
      });
      
      // Reset form after successful submission
      form.reset();
    } catch (err: unknown) {
      console.error("Booking form submission error:", err);
      const message = err instanceof Error ? err.message : "Une erreur est survenue";
      toast.error("Échec de la réservation", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <WhatsAppButton />

      {/* Header */}
      <section className="pt-32 pb-16 gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-white">Réserver votre voyage</h1>
          <p className="text-xl max-w-3xl mx-auto text-white/90">
            Complétez le formulaire ci-dessous pour réserver votre aventure
          </p>
        </div>
      </section>

      {/* Voyage Summary */}
      <section className="py-8 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-card p-6 rounded-xl shadow-card">
            <h2 className="text-2xl font-bold mb-4">Votre voyage: {voyage.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{voyage.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>{voyage.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <span>{voyage.price}€/pers.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Voyage Title - Hidden field */}
                <FormField
                  control={form.control}
                  name="voyageTitle"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Personal Information */}
                <div className="bg-card p-6 rounded-xl shadow-card">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Informations personnelles
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom complet *</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre nom complet" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="votre@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone *</FormLabel>
                          <FormControl>
                            <Input placeholder="0604-301545" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="participants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de participants *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              max="20"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Travel Details */}
                <div className="bg-card p-6 rounded-xl shadow-card">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Détails du voyage
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="travelDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de départ *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mode de paiement *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez un mode de paiement" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="card">Carte bancaire</SelectItem>
                              <SelectItem value="paypal">PayPal</SelectItem>
                              <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="specialRequests"
                    render={({ field }) => (
                      <FormItem className="mt-6">
                        <FormLabel>Demandes spéciales (optionnel)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ex: régime alimentaire spécifique, mobilité réduite, etc."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Total and Submit */}
                <div className="bg-card p-6 rounded-xl shadow-card flex flex-col md:flex-row justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Total</h3>
                    <p className="text-2xl font-bold text-primary">
                      {form.watch('participants') ? (form.watch('participants') * voyage.price) : voyage.price}€
                    </p>
                  </div>
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={isSubmitting}
                    className="mt-4 md:mt-0"
                  >
                    {isSubmitting ? "En cours..." : `Payer ${form.watch('participants') ? (form.watch('participants') * voyage.price) : voyage.price}€`}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Booking;
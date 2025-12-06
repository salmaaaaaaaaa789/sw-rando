import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { supabase } from "@/lib/supabaseClient";
import { canSubmitForm } from "@/lib/utils";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  email: z.string().email("Email invalide").max(255),
  phone: z.string().min(10, "Numéro de téléphone invalide").max(20),
  travelType: z.string().min(1, "Veuillez sélectionner un type de voyage"),
  destination: z.string().min(2, "Veuillez préciser une destination").max(200),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères").max(1000),
});

type FormValues = z.infer<typeof formSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      travelType: "",
      destination: "",
      message: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    // Check rate limiting
    if (!canSubmitForm(values.email)) {
      toast.error("Trop de tentatives", {
        description: "Vous avez déjà soumis un formulaire récemment. Veuillez réessayer dans une heure."
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contact_requests").insert({
        name: values.name,
        email: values.email,
        phone: values.phone,
        travel_type: values.travelType,
        destination: values.destination,
        message: values.message,
        created_at: new Date().toISOString(),
      });

      if (error) {
        if (error.code === '23505') { // Unique violation
          toast.error("Erreur de soumission", {
            description: "Cet email a déjà été utilisé récemment. Veuillez réessayer plus tard."
          });
        } else {
          toast.error("Erreur de base de données", { description: error.message });
        }
        return;
      }

      toast.success("Votre demande a été envoyée avec succès !", {
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
      form.reset();
    } catch (err: unknown) {
      console.error("Contact form submission error:", err);
      const message = err instanceof Error ? err.message : "Une erreur inattendue est survenue";
      toast.error("Échec de l'envoi", { description: message });
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
          <h1 className="mb-6 text-white">Contactez-Nous</h1>
          <p className="text-xl max-w-3xl mx-auto text-white/90">
            Une question ? Un projet de voyage ? Notre équipe est à votre écoute
            pour réaliser vos rêves d'évasion
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="mb-6">Nos Coordonnées</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Adresse</h3>
                      <p className="text-muted-foreground">
                        APT N°1, IMM 340 Av. Mohammed V
                        <br />
                        Rabat
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Téléphone</h3>
                      <a
                        href="tel:0604-301545"
                        className="text-muted-foreground hover:text-primary transition-smooth"
                      >
                        0604-301545
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a
                        href="mailto:contact@randopediatravel.com"
                        className="text-muted-foreground hover:text-primary transition-smooth"
                      >
                        contact@randopediatravel.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-muted rounded-lg">
                <h3 className="font-semibold mb-3">Horaires</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Dimanche</span>
                    <span>Ouvert 24h/24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lundi</span>
                    <span>09:00–18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mardi</span>
                    <span>09:00–18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mercredi</span>
                    <span>09:00–18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jeudi</span>
                    <span>09:00–18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vendredi</span>
                    <span>09:00–18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samedi</span>
                    <span>Ouvert 24h/24</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-card p-8 rounded-xl shadow-card">
                <h2 className="mb-6">Demande de Devis</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom complet *</FormLabel>
                            <FormControl>
                              <Input placeholder="Jean Dupont" {...field} />
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
                              <Input
                                type="email"
                                placeholder="jean.dupont@email.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        name="travelType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type de voyage *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="trek">Trek & Randonnée</SelectItem>
                                <SelectItem value="cultural">Culturel</SelectItem>
                                <SelectItem value="beach">Plage & Détente</SelectItem>
                                <SelectItem value="adventure">Aventure</SelectItem>
                                <SelectItem value="custom">Sur-mesure</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="destination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destination souhaitée *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Népal, Maroc, Maldives..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Votre message *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Parlez-nous de votre projet de voyage..."
                              rows={6}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;

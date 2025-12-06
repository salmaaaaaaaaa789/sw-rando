import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import desertImage from "@/assets/desert-destination.jpg";
import tropicalImage from "@/assets/tropical-destination.jpg";
import culturalImage from "@/assets/cultural-destination.jpg";
import heroImage from "@/assets/hero-mountain.jpg";

const Voyages = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "Tous les voyages" },
    { id: "trek", label: "Treks & Randonnées" },
    { id: "cultural", label: "Culturel" },
    { id: "beach", label: "Plages & Détente" },
    { id: "adventure", label: "Aventure" },
  ];

  const voyages = [
    {
      id: "1",
      title: "Trek au Sommet du Monde",
      category: "trek",
      image: heroImage,
      duration: "14 jours",
      participants: "8-12 pers.",
      location: "Himalaya, Népal",
      price: 2990,
      difficulty: "Difficile",
      description:
        "Une aventure inoubliable au cœur de l'Himalaya, entre sommets enneigés et monastères bouddhistes.",
      alt: "Randonneurs sur un sentier de montagne dans l'Himalaya au coucher du soleil",
    },
    {
      id: "2",
      title: "Expédition Sahara",
      category: "adventure",
      image: desertImage,
      duration: "10 jours",
      participants: "6-10 pers.",
      location: "Sahara, Maroc",
      price: 1890,
      difficulty: "Modéré",
      description:
        "Traversée des dunes dorées du Sahara, nuits sous les étoiles et rencontre avec les nomades.",
      alt: "Dunes du désert du Sahara au coucher du soleil",
    },
    {
      id: "3",
      title: "Paradis Tropical",
      category: "beach",
      image: tropicalImage,
      duration: "12 jours",
      participants: "4-8 pers.",
      location: "Maldives",
      price: 3490,
      difficulty: "Facile",
      description:
        "Détente absolue sur des plages de sable blanc, snorkeling et découverte de la culture locale.",
      alt: "Plage paradisiaque des Maldives avec eau turquoise et palmiers",
    },
    {
      id: "4",
      title: "Merveilles Culturelles",
      category: "cultural",
      image: culturalImage,
      duration: "8 jours",
      participants: "10-15 pers.",
      location: "Asie",
      price: 2290,
      difficulty: "Facile",
      description:
        "Immersion dans la richesse culturelle asiatique, temples ancestraux et traditions millénaires.",
      alt: "Architecture traditionnelle et patrimoine culturel asiatique",
    },
  ];

  const filteredVoyages =
    selectedCategory === "all"
      ? voyages
      : voyages.filter((v) => v.category === selectedCategory);

  const difficultyColors = {
    Facile: "bg-green-100 text-green-800 border-green-200",
    Modéré: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Difficile: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <WhatsAppButton />

      {/* Header */}
      <section className="pt-32 pb-16 gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-white">Nos Voyages</h1>
          <p className="text-xl max-w-3xl mx-auto text-white/90">
            Découvrez notre sélection de voyages exceptionnels, conçus pour les
            aventuriers et les amoureux de découvertes authentiques
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="transition-smooth"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Voyages Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVoyages.map((voyage) => (
              <Card
                key={voyage.id}
                className="overflow-hidden border-none shadow-card hover:shadow-lg transition-smooth group"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={voyage.image}
                    alt={voyage.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge
                      className={`${
                        difficultyColors[
                          voyage.difficulty as keyof typeof difficultyColors
                        ]
                      } border`}
                    >
                      {voyage.difficulty}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="mb-3 text-xl">{voyage.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    {voyage.description}
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-primary" />
                      <span>{voyage.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-primary" />
                      <span>{voyage.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-primary" />
                      <span>{voyage.participants}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-muted">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Places disponibles</span>
                      <span className="font-medium">12</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex justify-between items-center">
                  <div className="text-2xl font-bold text-primary">
                    {voyage.price.toLocaleString('fr-FR')}€
                  </div>
                  <Button asChild>
                    <Link to={`/booking/${voyage.id}`}>Réserver</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4">Voyage Sur-Mesure</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Vous ne trouvez pas votre bonheur ? Nous créons également des voyages
            100% personnalisés selon vos envies.
          </p>
          <Button size="lg" asChild>
            <Link to="/contact">Créer mon voyage</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Voyages;

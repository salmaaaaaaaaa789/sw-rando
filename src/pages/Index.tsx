import { ArrowRight, Users, MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import heroImage from "@/assets/hero-mountain.jpg";
import desertImage from "@/assets/desert-destination.jpg";
import tropicalImage from "@/assets/tropical-destination.jpg";
import culturalImage from "@/assets/cultural-destination.jpg";

const Index = () => {
  const destinations = [
    {
      title: "Aventures Désertiques",
      image: desertImage,
      description: "Explorez les dunes du Sahara sous un ciel étoilé",
      alt: "Coucher de soleil sur les dunes du désert du Sahara",
    },
    {
      title: "Paradis Tropicaux",
      image: tropicalImage,
      description: "Détendez-vous sur des plages de sable blanc",
      alt: "Plage tropicale avec palmiers et eau turquoise",
    },
    {
      title: "Trésors Culturels",
      image: culturalImage,
      description: "Découvrez des sites historiques fascinants",
      alt: "Architecture traditionnelle et patrimoine culturel",
    },
  ];

  const features = [
    {
      icon: Users,
      title: "Communauté Passionnée",
      description:
        "Rejoignez une communauté de voyageurs qui partagent votre passion pour l'aventure",
    },
    {
      icon: MapPin,
      title: "Destinations Authentiques",
      description:
        "Des circuits soigneusement sélectionnés hors des sentiers battus",
    },
    {
      icon: Heart,
      title: "Expériences Sur-Mesure",
      description:
        "Des voyages adaptés à vos envies et votre rythme",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="mb-6 animate-fade-in">
            Explorez le Monde Autrement
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white/90">
            Rejoignez Randopedia Travel et découvrez des destinations
            exceptionnelles avec une communauté de voyageurs passionnés
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg">
              <Link to="/voyages">
                Découvrir nos voyages
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
            >
              <Link to="/a-propos">En savoir plus</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12">Pourquoi Randopedia Travel ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-none shadow-card hover:shadow-lg transition-smooth"
              >
                <CardContent className="pt-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">Nos Destinations Phares</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Des expériences uniques dans les plus beaux coins du monde
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl shadow-card hover:shadow-lg transition-smooth cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                  />
                </div>
                <div className="absolute inset-0 gradient-card flex flex-col justify-end p-6 text-white">
                  <h3 className="mb-2 text-white">{destination.title}</h3>
                  <p className="text-white/90">{destination.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link to="/voyages">
                Voir tous nos voyages
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-white">Prêt pour l'Aventure ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Contactez-nous pour créer votre voyage sur-mesure ou rejoignez
            notre prochaine expédition de groupe
          </p>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="text-lg bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
          >
            <Link to="/contact">Demander un devis gratuit</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Globe, Heart, Users2, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import communityImage from "@/assets/community.jpg";

const About = () => {
  const values = [
    {
      icon: Globe,
      title: "Passion du Voyage",
      description:
        "Notre équipe partage une passion sans limite pour la découverte et l'aventure authentique.",
    },
    {
      icon: Heart,
      title: "Voyages Responsables",
      description:
        "Nous privilégions un tourisme respectueux des cultures locales et de l'environnement.",
    },
    {
      icon: Users2,
      title: "Esprit Communautaire",
      description:
        "Plus qu'une agence, nous créons une véritable communauté de voyageurs passionnés.",
    },
    {
      icon: Award,
      title: "Excellence & Expertise",
      description:
        "Des années d'expérience pour vous offrir des voyages inoubliables et sécurisés.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <WhatsAppButton />

      {/* Header */}
      <section className="pt-32 pb-16 gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-white">À Propos de Randopedia Travel</h1>
          <p className="text-xl max-w-3xl mx-auto text-white/90">
            Une agence de voyages pas comme les autres, créée par des passionnés
            pour des passionnés
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-6">Notre Histoire</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Randopedia Travel est née d'une conviction simple : le voyage
                  est bien plus qu'une destination, c'est une expérience humaine
                  enrichissante qui se vit et se partage.
                </p>
                <p>
                  Fondée par une équipe de globe-trotters passionnés, notre
                  agence s'est donnée pour mission de créer des voyages
                  authentiques, loin du tourisme de masse, où chaque aventure
                  devient une histoire à raconter.
                </p>
                <p>
                  Aujourd'hui, Randopedia Travel c'est une communauté de
                  voyageurs qui partagent les mêmes valeurs : curiosité,
                  respect, ouverture d'esprit et soif de découverte.
                </p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-card">
              <img
                src={communityImage}
                alt="La communauté Randopedia Travel - groupe de voyageurs souriants"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">Nos Valeurs</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Les principes qui guident chacune de nos actions et de nos voyages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="border-none shadow-card hover:shadow-lg transition-smooth text-center"
              >
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="mb-3 text-xl">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-8">Notre Mission</h2>
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                Chez Randopedia Travel, nous croyons que chaque voyage doit être
                une expérience transformatrice. Notre mission est de vous faire
                découvrir le monde sous un angle nouveau, de vous connecter avec
                des cultures différentes et de créer des souvenirs qui dureront
                toute une vie.
              </p>
              <p>
                Nous nous engageons à promouvoir un tourisme responsable et
                durable, en travaillant avec des partenaires locaux qui partagent
                nos valeurs et en minimisant notre impact environnemental.
              </p>
              <p className="font-semibold text-primary">
                Rejoignez notre communauté et partez à la découverte du monde avec
                des voyageurs qui vous ressemblent !
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;

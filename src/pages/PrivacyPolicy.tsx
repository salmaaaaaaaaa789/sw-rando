import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <WhatsAppButton />

      {/* Header */}
      <section className="pt-32 pb-16 gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-white">Politique de Confidentialité</h1>
          <p className="text-xl max-w-3xl mx-auto text-white/90">
            Comment nous collectons, utilisons et protégeons vos données
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-card p-8 rounded-xl shadow-card">
            <h2 className="text-2xl font-bold mb-6">1. Introduction</h2>
            <p className="mb-6 text-muted-foreground">
              La présente politique de confidentialité vous informe sur la manière 
              dont Randopedia Travel collecte, utilise, et protège les informations 
              personnelles que vous nous fournissez lors de l'utilisation de notre 
              site Web.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-10">2. Collecte des informations</h2>
            <p className="mb-6 text-muted-foreground">
              Nous collectons plusieurs types d'informations :
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
              <li>Informations personnelles : nom, prénom, adresse e-mail, numéro de téléphone</li>
              <li>Données de réservation : type de voyage, destination, dates de voyage, nombre de participants</li>
              <li>Données de navigation : pages visitées, temps passé sur le site, type de navigateur</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6 mt-10">3. Utilisation des informations</h2>
            <p className="mb-6 text-muted-foreground">
              Les informations collectées sont utilisées pour :
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
              <li>Traiter et confirmer vos réservations de voyage</li>
              <li>Vous contacter concernant vos réservations</li>
              <li>Améliorer votre expérience utilisateur sur notre site</li>
              <li>Envoyer des informations relatives à vos réservations</li>
              <li>Réaliser des analyses statistiques pour améliorer nos services</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6 mt-10">4. Protection des données</h2>
            <p className="mb-6 text-muted-foreground">
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger 
              vos informations personnelles contre tout accès non autorisé, altération, 
              divulgation ou destruction.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-10">5. Partage des informations</h2>
            <p className="mb-6 text-muted-foreground">
              Nous ne vendons, n'échangeons ni ne transférons vos informations personnelles 
              à des tiers sans votre consentement, sauf si exigé par la loi.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-10">6. Droits des utilisateurs</h2>
            <p className="mb-6 text-muted-foreground">
              Vous avez le droit d'accéder à vos données personnelles, de demander leur 
              rectification, leur suppression, ou de limiter leur traitement. Pour exercer 
              ces droits, contactez-nous à contact@randopediatravel.com.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-10">7. Cookies</h2>
            <p className="mb-6 text-muted-foreground">
              Notre site utilise des cookies pour améliorer votre expérience de navigation 
              et collecter des statistiques d'utilisation. Vous pouvez configurer votre 
              navigateur pour refuser les cookies.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-10">8. Modifications de la politique</h2>
            <p className="mb-6 text-muted-foreground">
              Nous nous réservons le droit de modifier cette politique de confidentialité 
              à tout moment. Les modifications seront publiées sur cette page.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-10">9. Contact</h2>
            <p className="mb-6 text-muted-foreground">
              Pour toute question concernant cette politique de confidentialité, 
              contactez-nous à contact@randopediatravel.com.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
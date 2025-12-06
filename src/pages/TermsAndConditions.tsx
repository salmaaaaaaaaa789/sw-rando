import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <WhatsAppButton />

      {/* Header */}
      <section className="pt-32 pb-16 gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-white">Conditions Générales</h1>
          <p className="text-xl max-w-3xl mx-auto text-white/90">
            Les conditions d'utilisation de nos services et de réservation
          </p>
        </div>
      </section>

      {/* Terms and Conditions Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-card p-8 rounded-xl shadow-card">
            <h2 className="text-2xl font-bold mb-6">1. Acceptation des conditions</h2>
            <p className="mb-6 text-muted-foreground">
              En utilisant le site Randopedia Travel et en réservant nos services, 
              vous acceptez sans réserve les présentes conditions générales d'utilisation. 
              Si vous n'êtes pas d'accord avec ces conditions, vous ne devez pas utiliser 
              nos services.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-10">2. Description des services</h2>
            <p className="mb-6 text-muted-foreground">
              Randopedia Travel propose des services de conception et d'organisation 
              de voyages personnalisés. Nous mettons à disposition des voyageurs 
              passionnés des circuits uniques, des expériences authentiques et 
              un accompagnement personnalisé.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-10">3. Réservations et paiements</h2>
            <p className="mb-6 text-muted-foreground">
              Toute réservation effectuée sur notre site implique l'acceptation 
              sans réserve des conditions de vente. Le client s'engage à fournir 
              des informations exactes et à régler le montant de la réservation 
              selon les modalités convenues.
            </p>
            <p className="mb-6 text-muted-foreground">
              Le paiement est exigible conformément aux modalités indiquées lors 
              de la réservation. En cas de non-paiement, Randopedia Travel se 
              réserve le droit d'annuler la réservation.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-10">4. Annulations et modifications</h2>
            <p className="mb-6 text-muted-foreground">
              Les conditions d'annulation et de modification dépendent du type 
              de voyage réservé. Des frais peuvent être appliqués selon le 
              préavis d'annulation. Les détails sont communiqués lors de la 
              confirmation de la réservation.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-10">5. Responsabilité</h2>
            <p className="mb-6 text-muted-foreground">
              Randopedia Travel ne saurait être tenue responsable des dommages 
              directs ou indirects résultant de l'utilisation de ses services 
              ou de l'accomplissement du voyage. Le client est responsable 
              de ses documents de voyage, de son assurance, et de sa santé.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-10">6. Force majeure</h2>
            <p className="mb-6 text-muted-foreground">
              Les obligations de Randopedia Travel pourront être suspendues 
              en cas de force majeure, notamment en cas de catastrophe 
              naturelle, d'émeute, de guerre, de blocage des moyens de 
              transports ou de communications.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-10">7. Propriété intellectuelle</h2>
            <p className="mb-6 text-muted-foreground">
              L'ensemble du site Randopedia Travel, son contenu, sa structure, 
              les textes, images et autres éléments sont la propriété exclusive 
              de Randopedia Travel et sont protégés par les lois applicables 
              sur la propriété intellectuelle.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-10">8. Données personnelles</h2>
            <p className="mb-6 text-muted-foreground">
              Conformément à la réglementation en vigueur, vous disposez d'un 
              droit d'accès, de modification, de rectification et de suppression 
              des données vous concernant. Pour exercer ce droit, contactez-nous 
              via les coordonnées indiquées sur le site.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-10">9. Litiges</h2>
            <p className="mb-6 text-muted-foreground">
              Les présentes conditions générales sont soumises à la loi française. 
              En cas de litige, les parties tenteront de trouver une solution 
              amiable. À défaut, les tribunaux français seront compétents.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-10">10. Modification des conditions</h2>
            <p className="mb-6 text-muted-foreground">
              Randopedia Travel se réserve le droit de modifier les présentes 
              conditions générales à tout moment. Les modifications seront 
              effectives dès leur publication sur le site.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
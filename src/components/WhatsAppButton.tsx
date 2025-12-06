import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phoneNumber = "212604301545"; // Format international sans + (Maroc)
  const message = "Bonjour, je souhaite obtenir plus d'informations sur vos voyages.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-card hover:scale-110 transition-smooth"
      aria-label="Contactez-nous sur WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
};

export default WhatsAppButton;

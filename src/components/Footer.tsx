import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Randopedia Travel</h3>
            <p className="text-primary-foreground/80 mb-4">
              Votre agence de voyages dédiée aux aventures authentiques et à la
              découverte de destinations exceptionnelles.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary transition-smooth"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary transition-smooth"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-primary-foreground/80 hover:text-secondary transition-smooth"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/a-propos"
                  className="text-primary-foreground/80 hover:text-secondary transition-smooth"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  to="/voyages"
                  className="text-primary-foreground/80 hover:text-secondary transition-smooth"
                >
                  Nos voyages
                </Link>
              </li>
              <li>
                <Link
                  to="/mes-reservations"
                  className="text-primary-foreground/80 hover:text-secondary transition-smooth"
                >
                  Mes réservations
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-primary-foreground/80 hover:text-secondary transition-smooth"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xl font-bold mb-4">Légal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/politique-de-confidentialite"
                  className="text-primary-foreground/80 hover:text-secondary transition-smooth"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  to="/conditions-generales"
                  className="text-primary-foreground/80 hover:text-secondary transition-smooth"
                >
                  Conditions générales
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="mt-1 flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  APT N°1, IMM 340 Av. Mohammed V, Rabat
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="flex-shrink-0" />
                <a
                  href="tel:0604-301545"
                  className="text-primary-foreground/80 hover:text-secondary transition-smooth"
                >
                  0604-301545
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="flex-shrink-0" />
                <a
                  href="mailto:contact@randopediatravel.com"
                  className="text-primary-foreground/80 hover:text-secondary transition-smooth"
                >
                  contact@randopediatravel.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/60 text-sm">
          <p>
            © {new Date().getFullYear()} Randopedia Travel. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

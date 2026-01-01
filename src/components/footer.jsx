import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer id="footer" className="bg-(--charcoal) text-white py-16 mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-2xl font-bold mb-4">
              Luxe<span className="text-[var(--luxury-gold)]">Furniture</span>
            </div>
            <p className="text-gray-300 mb-4">
              Premium furniture with cutting-edge AR technology for the modern
              home.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-[var(--luxury-gold)] transition-colors"
              >
                <FontAwesomeIcon icon={faFacebook} className="text-xl" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-[var(--luxury-gold)] transition-colors"
              >
                <FontAwesomeIcon icon={faInstagram} className="text-xl" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-[var(--luxury-gold)] transition-colors"
              >
                <FontAwesomeIcon icon={faTwitter} className="text-xl" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a
                  href="#"
                  className="hover:text-[var(--luxury-gold)] transition-colors"
                >
                  Living Room
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[var(--luxury-gold)] transition-colors"
                >
                  Bedroom
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[var(--luxury-gold)] transition-colors"
                >
                  Dining Room
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[var(--luxury-gold)] transition-colors"
                >
                  Office
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a
                  href="/contactus"
                  className="hover:text-[var(--luxury-gold)] transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="hover:text-[var(--luxury-gold)] transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[var(--luxury-gold)] transition-colors"
                >
                  Shipping Info
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[var(--luxury-gold)] transition-colors"
                >
                  Returns
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Subscribe for exclusive offers and AR updates
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]"
              />
              <button className="bg-[var(--luxury-gold)] hover:bg-opacity-90 px-4 py-2 rounded-r-lg transition-colors">
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-300">
          <p>&copy; 2024 LuxeFurniture. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

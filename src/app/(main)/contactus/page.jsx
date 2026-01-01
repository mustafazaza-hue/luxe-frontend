"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faHeart,
  faShoppingCart,
  faUser,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faCube,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

export default function ContactPage() {
  return (
    <main className="bg-[var(--soft-gray)] text-[var(--charcoal)]">
      {/* HEADER */}


      {/* HERO */}
      <section className="relative h-[400px] bg-gradient-to-r from-[var(--warm-beige)] to-[var(--soft-gray)] flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-5xl font-bold text-[var(--charcoal)] mb-4">
            Get in <span className="text-[var(--gold-accent)]">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're here to help you find the perfect furniture for your space. Reach out with any questions or feedback.
          </p>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* CONTACT INFO */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-8 shadow-sm h-fit space-y-6">
              <h2 className="text-2xl font-bold text-[var(--charcoal)]">Contact Information</h2>

              {[
                {icon: faMapMarkerAlt, title:"Visit Our Showroom", text:"123 Luxury Avenue\nDesign District, NY 10001"},
                {icon: faPhone, title:"Call Us", text:"+1 (555) 123-4567\nMon - Fri: 9AM - 6PM"},
                {icon: faEnvelope, title:"Email Support", text:"support@luxefurniture.com\n24/7 Response"},
                {icon: faCube, title:"AR Support", text:"ar-help@luxefurniture.com\nTechnical Assistance"}
              ].map((item,i)=>(
                <div key={i} className="flex items-start space-x-4">
                  <div className="bg-[var(--gold-accent)] bg-opacity-10 p-3 rounded-lg">
                    <FontAwesomeIcon icon={item.icon} className="text-[var(--gold-accent)] text-lg"/>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--charcoal)] mb-1">{item.title}</h3>
                    <p className="text-gray-600 whitespace-pre-line">{item.text}</p>
                  </div>
                </div>
              ))}

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-[var(--charcoal)] mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  {[faFacebook, faInstagram, faTwitter, faLinkedin].map((icon,i)=>(
                    <a key={i} href="#" className="bg-gray-100 hover:bg-[var(--gold-accent)] hover:text-white p-3 rounded-lg transition-all">
                      <FontAwesomeIcon icon={icon} className="text-lg"/>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[var(--charcoal)] mb-6">Send Us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" placeholder="First Name *" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold-accent)] focus:border-transparent"/>
                  <input type="text" placeholder="Last Name *" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold-accent)] focus:border-transparent"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="email" placeholder="Email Address *" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold-accent)] focus:border-transparent"/>
                  <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold-accent)] focus:border-transparent"/>
                </div>
                <input type="text" placeholder="Subject *" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold-accent)] focus:border-transparent"/>
                <textarea rows={6} placeholder="Message *" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold-accent)] focus:border-transparent resize-none"/>
                <div className="flex items-start space-x-3">
                  <input type="checkbox" className="mt-1 h-4 w-4 text-[var(--gold-accent)] border-gray-300 rounded focus:ring-[var(--gold-accent)]"/>
                  <label className="text-sm text-gray-600">Subscribe to newsletter</label>
                </div>
                <div className="flex items-start space-x-3">
                  <input type="checkbox" required className="mt-1 h-4 w-4 text-[var(--gold-accent)] border-gray-300 rounded focus:ring-[var(--gold-accent)]"/>
                  <label className="text-sm text-gray-600">I agree to Privacy Policy *</label>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button type="submit" className="flex-1 bg-[var(--gold-accent)] hover:bg-opacity-90 text-white py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2">
                    <FontAwesomeIcon className="" icon={faPaperPlane}/> <span>Send Message</span>
                  </button>
                  <button type="reset" className="sm:w-auto border-2 border-gray-300 text-gray-600 hover:border-[var(--gold-accent)] hover:text-[var(--gold-accent)] py-3 px-6 rounded-lg font-semibold transition-all">Clear Form</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faHeart,
  faShoppingCart,
  faUser,
  faPlus,
  faMinus,
  faCube,
} from "@fortawesome/free-solid-svg-icons";

export default function FAQPage() {
  const toggleFAQ = (id) => {
    const content = document.getElementById(id);
    const icon = document.getElementById(id + "-icon");
    if (content.classList.contains("hidden")) {
      content.classList.remove("hidden");
      icon.classList.remove("fa-plus");
      icon.classList.add("fa-minus");
      icon.classList.add("rotate-180");
    } else {
      content.classList.add("hidden");
      icon.classList.remove("fa-minus");
      icon.classList.add("fa-plus");
      icon.classList.remove("rotate-180");
    }
  };

  const faqItems = [
    {
      question: "What makes your furniture premium quality?",
      answer:
        "Our furniture is crafted from the finest materials including genuine Italian leather, solid hardwoods, and premium fabrics. Each piece undergoes rigorous quality control and is handcrafted by skilled artisans with decades of experience. We source materials sustainably and ensure every detail meets our luxury standards.",
    },
    {
      question: "Do you offer customization options?",
      answer:
        "Yes! We offer extensive customization including fabric selection, wood finishes, dimensions, and hardware options. Our design consultants work with you to create pieces that perfectly match your space and style preferences. Custom orders typically take 6-8 weeks for completion.",
    },
    {
      question: "How does the AR feature work?",
      answer:
        "Our AR technology uses your device's camera to place 3D models of furniture in your actual space. Simply click 'View in AR' on any compatible product, point your camera at the desired location, and see how the furniture looks and fits in real-time. The models are true-to-scale and show accurate colors and textures.",
    },
    {
      question: "What devices support AR viewing?",
      answer:
        "AR is supported on iOS devices (iPhone 6s and newer, iPad Pro, iPad 5th generation and newer) and Android devices with ARCore support. For the best experience, ensure your device has adequate lighting and a clear view of the floor space where you want to place the furniture.",
    },
    {
      question: "What are your shipping options?",
      answer:
        "We offer white glove delivery service which includes delivery, unpacking, assembly, and placement in your desired room. Standard delivery takes 2-4 weeks, while custom pieces take 6-8 weeks. We also offer expedited shipping for select in-stock items. All deliveries are fully insured.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for non-custom items in original condition. Custom pieces are final sale unless there's a manufacturing defect. Returns include free pickup and full refund minus original shipping costs. We stand behind our quality with a 5-year warranty on all furniture.",
    },
    {
      question: "Do you offer financing options?",
      answer:
        "Yes, we partner with leading financing companies to offer flexible payment plans. Options include 0% interest for 12 months on purchases over $1,000, and extended payment plans up to 36 months. Apply during checkout for instant approval and competitive rates.",
    },
    {
      question: "Can I schedule a showroom visit?",
      answer:
        "Absolutely! We have showrooms in major cities where you can experience our furniture in person. Schedule a private consultation with our design experts who can help you explore options and demonstrate the AR technology. Book appointments through our website or call our customer service.",
    },
  ];

  return (
    <main className="bg-[var(--soft-gray)] text-[var(--charcoal)]">
      {/* HERO */}
      <section className="bg-gradient-to-r from-[var(--warm-beige)] to-[var(--soft-gray)] py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-[var(--charcoal)] mb-6">
            Frequently Asked <span className="text-[var(--luxury-gold)]">Questions</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find answers to common questions about our luxury furniture, AR technology, and shopping experience
          </p>
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search FAQ..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)] focus:border-transparent"
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-4 text-gray-400" />
          </div>
        </div>
      </section>

      {/* FAQ CONTENT */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          {faqItems.map((item, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100">
              <button
                className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 rounded-xl transition-colors"
                onClick={() => toggleFAQ(`faq${i + 1}`)}
              >
                <h3 className="text-lg font-semibold">{item.question}</h3>
                <FontAwesomeIcon
                  icon={faPlus}
                  id={`faq${i + 1}-icon`}
                  className="text-[var(--luxury-gold)] transform transition-transform"
                />
              </button>
              <div id={`faq${i + 1}`} className="hidden px-6 pb-6 text-gray-600">
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

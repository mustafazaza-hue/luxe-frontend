"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faHeart,
  faShoppingCart,
  faUser,
  faLightbulb,
  faGem,
  faCube,
  faCheck,
  faTree,
  faRecycle,
  faTruck,
  faTrophy,
  faAward,
  faMedal,
} from "@fortawesome/free-solid-svg-icons";

import {
  faLinkedin,
  faTwitter,
  faFacebook,
  faInstagram,
  faPinterest,
} from "@fortawesome/free-brands-svg-icons";

export default function AboutPage() {
  return (
    <main className="bg-[var(--soft-gray)] text-[var(--charcoal)]">

      {/* HERO */}
      <section className="h-[500px] bg-gradient-to-r from-[var(--warm-beige)] to-[var(--soft-gray)] flex items-center">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <h1 className="text-5xl font-bold">
            Redefining Luxury
            <span className="block text-[var(--gold-accent)] mt-2">Through Innovation</span>
          </h1>
          <p className="text-xl text-[var(--gray-dark)] max-w-3xl mx-auto">
            We blend timeless craftsmanship with cutting-edge AR technology to create an unparalleled furniture shopping experience.
          </p>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-[var(--gold-accent)] font-semibold uppercase text-sm">
              Our Story
            </span>
            <h2 className="text-4xl font-bold">
              Where Tradition Meets Tomorrow
            </h2>
            <p className="text-[var(--gray-dark)] text-lg">
              Founded in 2015, LuxeFurniture emerged from a vision to revolutionize how people experience and purchase premium furniture.
            </p>
            <p className="text-[var(--gray-dark)] text-lg">
              What if you could see exactly how a piece of furniture would look and feel in your space before purchasing?
            </p>
            <p className="text-[var(--gray-dark)] text-lg">
              Today, we collaborate with master craftsmen worldwide to curate elegant and innovative collections.
            </p>
          </div>

          <div className="relative">
            <img
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/f72a8b94c4-1bda271a33843ef25778.png
"
              className="rounded-xl shadow-2xl h-[600px] w-full object-cover"
              alt="Elegant furniture showroom"
            />
            <div className="absolute -bottom-8 -left-8 bg-[var(--gold-accent)] text-white p-8 rounded-xl shadow-xl">
              <div className="text-4xl font-bold">9+ Years</div>
              <p className="opacity-90">Of Excellence in Luxury Furniture</p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-20 bg-gradient-to-br from-[var(--gold-accent)] to-[var(--copper)] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Our Mission & Vision
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Empowering confident decisions through innovation while preserving the art of exceptional craftsmanship.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[{
                icon: faLightbulb,
                title: "Innovation First",
                text: "Integrating advanced AR tools to elevate shopping experiences.",
              },{
                icon: faGem,
                title: "Quality Commitment",
                text: "Premium materials crafted for timeless durability.",
              },{
                icon: faHeart,
                title: "Customer Centric",
                text: "Personalized service built around your satisfaction.",
              }].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <div className="bg-white/20 w-16 h-16 flex items-center justify-center rounded-full mb-6">
                  <FontAwesomeIcon icon={item.icon} className="text-3xl text-[var(--charcoal)]" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="opacity-90">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AR SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
<img
  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/4f15e246e6-98c328c5f789a95c1630.png
"
  className="rounded-xl shadow-2xl h-[500px] object-cover w-full group-hover:scale-105 transition-transform duration-300"
  alt="Person using AR furniture app"
/>
          <div className="space-y-6">
            <span className="text-[var(--gold-accent)] font-semibold uppercase text-sm">
              AR Technology
            </span>
            <h2 className="text-4xl font-bold">See Before You Buy with AR</h2>
            <p className="text-[var(--gray-dark)] text-lg">
              Place true-to-scale 3D furniture models directly in your space using your phone.
            </p>
            {["True-to-scale visualization","360° viewing experience","Real lighting conditions"].map((text,i)=>(
              <div key={i} className="flex items-start gap-4">
                <div className="bg-[var(--warm-beige)] p-3 rounded-full mt-1">
                  <FontAwesomeIcon icon={faCheck} className="text-[var(--gold-accent)]" />
                </div>
                <p className="text-[var(--gray-dark)]">{text}</p>
              </div>
            ))}
            <button className="bg-[var(--gold-accent)] text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 hover:scale-105 transition">
              <FontAwesomeIcon icon={faCube} /> Try AR Experience
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[var(--gold-accent)] to-[var(--copper)] text-white text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Transform Your Space?
        </h2>
        <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
          Experience the future of furniture shopping with AR.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-[var(--gold-accent)] px-8 py-4 rounded-lg font-semibold">
            Explore AR Collection
          </button>
          <button className="border-2 border-white px-8 py-4 rounded-lg font-semibold">
            Contact Us
          </button>
        </div>
      </section>

    </main>
  );
}

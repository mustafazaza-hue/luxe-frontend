export default function InspirationPage() {
  const articles = [
    {
      id: 1,
      title: "Modern Living Room Design",
      desc: "Create a sophisticated living room with clean lines, neutral tones, and luxury furniture pieces.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7"
    },
    {
      id: 2,
      title: "Minimalist Bedroom Ideas",
      desc: "Discover how simplicity and comfort come together in modern bedroom designs.",
      image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0"
    },
    {
      id: 3,
      title: "Luxury Home Office Setup",
      desc: "Design a productive and elegant home office with premium materials and smart layouts.",
      image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf"
    },
    {
      id: 4,
      title: "Dining Room Styling Tips",
      desc: "Enhance your dining experience with stylish furniture and balanced lighting.",
      image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed"
    },
    {
      id: 5,
      title: "Warm & Cozy Interiors",
      desc: "Use warm colors and textures to create inviting and comfortable living spaces.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
    },
    {
      id: 6,
      title: "Contemporary Furniture Trends",
      desc: "Explore the latest furniture trends shaping modern interior design.",
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511"
    }
  ];

  return (
    <main className="bg-[var(--soft-gray)] min-h-screen">

      {/* HERO */}
      <section className="relative h-[450px] bg-gradient-to-r from-[var(--warm-beige)] to-[var(--soft-gray)] flex items-center">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <h1 className="text-5xl font-bold text-[var(--charcoal)]">
            Design <span className="text-[var(--luxury-gold)]">Inspiration</span>
          </h1>
          <p className="text-xl text-[var(--gray-dark)] max-w-3xl mx-auto">
            Discover expert design ideas, style guides, and furniture inspiration
          </p>
        </div>
      </section>

      {/* ARTICLES */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[var(--charcoal)] mb-4">
              Inspiration Articles
            </h2>
            <p className="text-[var(--gray-dark)]">
              Explore our latest interior design content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group cursor-pointer"
              >
                {/* Image */}
                <div className="h-64 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[var(--charcoal)] group-hover:text-[var(--luxury-gold)] transition mb-3">
                    {article.title}
                  </h3>
                  <p className="text-[var(--gray-dark)] leading-relaxed">
                    {article.desc}
                  </p>

                  <div className="mt-6">
                    <span className="inline-block text-[var(--luxury-gold)] font-semibold">
                      Read More →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[var(--luxury-gold)] to-[var(--copper)] text-white">
        <div className="max-w-3xl mx-auto text-center space-y-6 px-6">
          <h2 className="text-3xl font-bold">Get Weekly Inspiration</h2>
          <p className="opacity-90">
            Subscribe to receive the latest design trends and ideas
          </p>
          <button className="bg-white text-[var(--luxury-gold)] px-8 py-3 rounded-lg font-semibold">
            Subscribe Now
          </button>
        </div>
      </section>

    </main>
  );
}

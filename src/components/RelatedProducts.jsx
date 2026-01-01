"use client";

const RelatedProducts = () => {
  const relatedProducts = [
    {
      id: 2,
      name: "Walnut Coffee Table",
      price: 899,
      image:
        "https://storage.googleapis.com/uxpilot-auth.appspot.com/a93a97d6eb-a0051ad124abb84fb39b.png",
    },
    {
      id: 3,
      name: "Milano Armchair",
      price: 1299,
      image:
        "https://storage.googleapis.com/uxpilot-auth.appspot.com/ecad393672-c641d89eb134a5412601.png",
    },
    {
      id: 4,
      name: "Brass Floor Lamp",
      price: 399,
      image:
        "https://storage.googleapis.com/uxpilot-auth.appspot.com/cad283f92a-3e120d5a13ba7540e35b.png",
    },
    {
      id: 5,
      name: "Oak Side Table",
      price: 599,
      image:
        "https://storage.googleapis.com/uxpilot-auth.appspot.com/768e2696be-c6f4238e84c31cffedb6.png",
    },
  ];

  return (
    <div id="related-products" className="mt-16">
      <h2 className="text-3xl font-bold text-[var(--charcoal)] mb-8">
        You May Also Like
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <a
            key={product.id}
            href={`/product/${product.id}`}
            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-[var(--luxury-gold)]"
          >
            <div className="aspect-square overflow-hidden">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                src={product.image}
                alt={product.name}
              />
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-[var(--charcoal)] mb-2 group-hover:text-[var(--luxury-gold)] transition-colors">
                {product.name}
              </h3>
              <p className="text-[var(--luxury-gold)] font-bold text-lg">
                ${product.price.toLocaleString()}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;

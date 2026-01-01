// import ProductCard from "./prodcutCard";

// const CategorySection = ({
//   title,
//   description,
//   products,
//   bgColor = "bg-white",
// }) => {
//   return (
//     <section className={`py-12 ${bgColor}`}>
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h2 className="text-3xl font-bold text-charcoal mb-2">{title}</h2>
//             <p className="text-gray-600">{description}</p>
//           </div>
//           <button className="text-luxury-gold hover:text-luxury-copper font-semibold flex items-center space-x-2">
//             <span>View All {title}</span>
//             <i className="fa-solid fa-arrow-right"></i>
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {products.map((product, index) => (
//             <ProductCard key={index} product={product} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CategorySection;

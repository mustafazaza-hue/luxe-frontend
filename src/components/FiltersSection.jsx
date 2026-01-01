import { faList, faThLarge } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FiltersSection = () => {
  return (
    <section className="bg-white py-6 sticky top-20 z-40 border-b">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <label className="text-sm font-semibold text-charcoal">Material:</label>
              <select className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-luxury-gold">
                <option>All Materials</option>
                <option>Leather</option>
                <option>Wood</option>
                <option>Metal</option>
                <option>Fabric</option>
                <option>Glass</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <label className="text-sm font-semibold text-charcoal">Dimensions:</label>
              <select className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-luxury-gold">
                <option>All Sizes</option>
                <option>Small (&lt; 50&quot;)</option>
                <option>Medium (50&quot;-80&quot;)</option>
                <option>Large (&gt; 80&quot;)</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <label className="text-sm font-semibold text-charcoal">Color:</label>
              <select className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-luxury-gold">
                <option>All Colors</option>
                <option>Black</option>
                <option>White</option>
                <option>Brown</option>
                <option>Gray</option>
                <option>Beige</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <label className="text-sm font-semibold text-charcoal">Sort by:</label>
              <select className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-luxury-gold">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
                <option>Best Rated</option>
                <option>Most Popular</option>
              </select>
            </div>

            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button className="px-4 py-2 bg-luxury-gold text-white">
                <FontAwesomeIcon icon={faThLarge}></FontAwesomeIcon>
              </button>
              <button className="px-4 py-2 hover:bg-gray-50">
                <FontAwesomeIcon icon={faList}></FontAwesomeIcon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FiltersSection;
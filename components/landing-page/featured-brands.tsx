import { motion } from "framer-motion";
import Link from "next/link";

interface BrandCard {
  brand: string;
  image: string;
  link: string;
}

const brands: BrandCard[] = [
  {
    brand: "SNEAKERS",
    image: "/nike.jpg",
    link: "/products/sneakers"
  },
  {
    brand: "HOODIES",
    image: "/hoodies.jpg",
    link: "/products/hoodies"
  },
  {
    brand: "JACKETS",
    image: "/puffer.png",
    link: "/products/jackets"
  },
  {
    brand: "WATCHES",
    image: "/watch.png",
    link: "/products/wathces"
  }
];

export const FeaturedBrands = () => {
  return (
    <section className="w-full px-4 py-10 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.brand}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <Link href={brand.link}>
                <div className="relative group overflow-hidden rounded-lg aspect-[4/5]">
                  <img
                    src={brand.image}
                    alt={brand.brand}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/5 transition-opacity duration-300 group-hover:opacity-0" />
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-black/50 group-hover:text-blue-500 text-xl font-bold">{brand.brand}</h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
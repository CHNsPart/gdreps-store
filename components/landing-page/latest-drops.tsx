import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface DropItem {
  name: string;
  brand: string;
  image: string;
  price: string;
  tag: string;
}

const latestDrops: DropItem[] = [
  {
    name: "Tech Fleece Hoodie",
    brand: "NK",
    image: "/jordan.webp",
    price: "$89.99",
    tag: "NEW"
  },
  {
    name: "Triple S Sneakers",
    brand: "BLCG",
    image: "/api/placeholder/600/800",
    price: "$159.99",
    tag: "TRENDING"
  },
  {
    name: "Monogram Sweater",
    brand: "LV",
    image: "/api/placeholder/600/800",
    price: "$129.99",
    tag: "PREMIUM"
  }
];

export const LatestDrops = () => {
  return (
    <section className="w-full px-4 py-20 bg-white">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[4rem] font-bold leading-none tracking-tighter">
              LATEST
              <br />
              DROPS
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button 
              variant="ghost"
              className="text-lg group"
            >
              VIEW ALL
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestDrops.map((item, index) => (
            <motion.div
              key={item.name}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative aspect-[3/4] mb-4 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white px-3 py-1 text-sm font-medium">
                  {item.tag}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.brand}</p>
                  </div>
                  <span className="text-lg font-medium">{item.price}</span>
                </div>

                <div className="pt-2 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  <Button className="w-full bg-black hover:bg-gray-900">
                    ADD TO CART
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
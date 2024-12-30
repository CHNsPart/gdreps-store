'use client';

import { VelocityScroll } from "../ui/scroll-based-velocity";


const luxuryBrands = {
  row1: "NIKE • YEEZY • JORDAN • ADIDAS • OFF-WHITE • ESSENTIALS • SUPREME • ",
  row2: "BALENCIAGA • GUCCI • LOUIS VUITTON • DIOR • PRADA • STONE ISLAND • ",
  row3: "PALM ANGELS • FEAR OF GOD • CHROME HEARTS • BAPE • AMIRI • "
};

export const BrandScroll = () => {
  return (
    <section className="py-20 bg-white text-black overflow-hidden">
      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 h-full w-40 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-white to-transparent z-10" />

        {/* Main Content */}
        <div className="py-10 space-y-10">
          <VelocityScroll 
            text={luxuryBrands.row1} 
            default_velocity={1} 
            className="text-4xl md:text-6xl font-bold opacity-80"
          />
          
        </div>

        {/* Optional Section Title */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
          <span className="text-sm tracking-widest uppercase bg-black/10 px-4 py-2 rounded-full">
            Premium Replicas
          </span>
        </div>
      </div>
    </section>
  );
};
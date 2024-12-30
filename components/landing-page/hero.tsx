'use client'

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { useCallback } from "react";

export const Hero = () => {
  const scrollToNextSection = useCallback(() => {
    // Get the hero section's height
    const heroSection = document.querySelector('section');
    const heroHeight = heroSection?.offsetHeight || 0;
    
    // Scroll to the next section smoothly
    window.scrollTo({
      top: heroHeight,
      behavior: 'smooth'
    });
  }, []);
  return (
    <section className="w-full px-4 py-10 lg:py-20 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col gap-8">
          {/* Main Title with Image Integration */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-[3rem] md:text-[6rem] lg:text-[8rem] font-bold leading-none tracking-tighter">
              CLOTHING, 
              <span className="inline-flex items-center mx-4">
                <img 
                  src="/jordan.webp" 
                  alt="Fashion Preview" 
                  className="rounded-lg object-cover h-20 md:h-32 hover:rotate-12 transition-all ease-in-out duration-500"
                />
              </span>
              SHOES
              <br />& ACCESSORIES
            </h1>
          </motion.div>

          {/* Controls Bar */}
          <div className="flex justify-between items-center mt-4">
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full size-12 border-2 hover:text-blue-500 hover:border-blue-500 hover:animate-spin transition-all delay-75 ease-in-out cursor-crosshair"
            >
              <span className="text-6xl">⁕</span>
            </Button>

            <div className="flex items-center gap-4">
              <Button 
                variant="default"
                className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white px-6"
                onClick={scrollToNextSection}
              >
                SCROLL DOWN
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="rounded-full size-12 border-2"
                onClick={scrollToNextSection}
              >
                <ArrowDown className="size-12" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
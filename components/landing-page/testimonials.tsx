'use client';

import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { motion } from "framer-motion";

const testimonialData = [
  {
    quote: "The quality of these replicas is incredible. The attention to detail on my Jordan 1s is exactly like the originals. Fast shipping and great customer service too!",
    name: "Alex Chen",
    designation: "Verified Buyer",
    src: "/user1.png"
  },
  {
    quote: "Been buying hoodies from GDREPS for months now. The quality is consistent, prices are fair, and they always have the latest drops. Highly recommended!",
    name: "Sarah Kim",
    designation: "Regular Customer",
    src: "/user3.png"
  },
  {
    quote: "Found GDREPS through a friend and I'm amazed by the premium quality. Their replica sneakers are indistinguishable from retail pairs. Will definitely shop again!",
    name: "Marcus Johnson",
    designation: "Sneaker Enthusiast",
    src: "/user2.png"
  },
  {
    quote: "The designer collection here is unmatched. Got multiple items and each one feels premium. The customer support team is super helpful with sizing questions.",
    name: "Emma Zhang",
    designation: "Fashion Blogger",
    src: "/user4.png"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-20 z-40 bg-white dark:bg-black relative overflow-hidden">
      {/* Section Title */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
          WHAT OUR CUSTOMERS SAY
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Join thousands of satisfied customers wearing premium replicas
        </p>
      </motion.div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl" />
      </div>

      {/* Testimonials Carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <AnimatedTestimonials testimonials={testimonialData} autoplay={true} />
      </motion.div>
    </section>
  );
};
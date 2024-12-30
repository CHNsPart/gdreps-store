'use client';

import { useEffect } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { FeaturedBrands } from "@/components/landing-page/featured-brands";
import { Hero } from "@/components/landing-page/hero";
import { LatestDrops } from "@/components/landing-page/latest-drops";
import { BrandScroll } from "@/components/landing-page/brand-scroll";
import { Testimonials } from "@/components/landing-page/testimonials";
import { CtaFooter } from "@/components/landing-page/cta-footer";
import ProductCta from "@/components/landing-page/product-cta";

export default function Home() {
  const { isAuthenticated, isLoading } = useKindeAuth();

  useEffect(() => {
    const syncUser = async () => {
      if (isAuthenticated && !isLoading) {
        try {
          await fetch('/api/sync');
        } catch (error) {
          console.error('Failed to sync user:', error);
        }
      }
    };

    syncUser();
  }, [isAuthenticated, isLoading]);

  return (
    <main>
      <Hero />
      <FeaturedBrands />
      <BrandScroll />
      {/* <LatestDrops /> */}
      <ProductCta />
      <Testimonials />
      <CtaFooter />
    </main>
  );
}
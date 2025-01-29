"use client";

import { HeroSection } from "@/components/blocks/hero-section";

export function HomeHero() {
  return (
    <HeroSection
      badge={{
        text: "New Battery Emulator Series",
        action: {
          text: "Learn More",
          href: "/products",
        },
      }}
      title="Advanced Battery Emulation Solutions"
      description="Professional battery emulators providing precise battery characteristic simulation for your device testing and development. From small devices to large-scale industrial applications, we meet all your needs."
      actions={[
        {
          text: "Browse Products",
          href: "/products",
          variant: "default",
        },
        {
          text: "Contact Us",
          href: "/contact",
          variant: "glow",
        },
      ]}
      image={{
        light: "https://sjc.microlink.io/xjOFvxuO85WnWw2kflbDmkfh7m1IFhtst1dgJP-gMxnn2Ahtla72tUukSPVITBfevOCzFreq70Ym8TiI12kCmA.jpeg",
        dark: "https://sjc.microlink.io/xjOFvxuO85WnWw2kflbDmkfh7m1IFhtst1dgJP-gMxnn2Ahtla72tUukSPVITBfevOCzFreq70Ym8TiI12kCmA.jpeg",
        alt: "Battery Emulator Preview",
      }}
    />
  );
} 
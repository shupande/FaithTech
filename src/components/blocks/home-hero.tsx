"use client";

import { HeroSection } from "@/components/blocks/hero-section";
import { prisma } from "@/lib/prisma";

async function getHeroContent() {
  const content = await prisma.sectionContent.findUnique({
    where: {
      name: 'home_hero',
      status: 'Active'
    }
  });

  if (!content) {
    return {
      badge: {
        text: "New Battery Emulator Series",
        action: {
          text: "Learn More",
          href: "/products",
        },
      },
      title: "Advanced Battery Emulation Solutions",
      description: "Professional battery emulators providing precise battery characteristic simulation for your device testing and development. From small devices to large-scale industrial applications, we meet all your needs.",
      actions: [
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
      ],
      image: {
        light: "/images/battery-emulator-preview.jpeg",
        dark: "/images/battery-emulator-preview.jpeg",
        alt: "Battery Emulator Preview",
      }
    };
  }

  return {
    badge: content.badge ? JSON.parse(content.badge) : null,
    title: content.title,
    description: content.description,
    actions: content.actions ? JSON.parse(content.actions) : [],
    image: content.image ? JSON.parse(content.image) : null,
  };
}

export async function HomeHero() {
  const content = await getHeroContent();

  return (
    <HeroSection
      badge={content.badge}
      title={content.title}
      description={content.description}
      actions={content.actions}
      image={content.image}
    />
  );
} 
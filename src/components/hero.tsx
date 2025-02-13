import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface HeroProps {
  badge?: {
    text: string
    action?: {
      text: string
      href: string
    }
  }
  title: string
  description: string
  actions?: Array<{
    text: string
    href: string
    variant?: "default" | "glow"
  }>
  image: {
    light: string
    dark: string
    alt: string
  }
}

export function Hero({
  badge,
  title,
  description,
  actions = [],
  image,
}: HeroProps) {
  // 验证图片数据
  const hasValidImage = image && image.light && image.dark && image.alt

  return (
    <section className="container flex flex-col gap-4 py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
        {badge && (
          <Link
            href={badge.action?.href || "#"}
            className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium"
          >
            {badge.text}
            {badge.action && (
              <>
                <span className="mx-2">|</span>
                <span className="text-primary">{badge.action.text}</span>
              </>
            )}
          </Link>
        )}
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
          {title}
        </h1>
        <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
          {description}
        </p>
        {actions.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4">
            {actions.map((action, index) => (
              <Button
                key={index}
                asChild
                variant={action.variant || "default"}
                className={cn(
                  action.variant === "glow" &&
                    "shadow-primary/50 hover:shadow-primary/50 bg-primary text-primary-foreground shadow-lg hover:shadow-xl"
                )}
              >
                <Link href={action.href}>{action.text}</Link>
              </Button>
            ))}
          </div>
        )}
      </div>
      {hasValidImage && (
        <div className="mx-auto max-w-5xl">
          <picture>
            <source media="(prefers-color-scheme: dark)" srcSet={image.dark} />
            <Image
              src={image.light}
              alt={image.alt}
              width={1020}
              height={510}
              className="mx-auto aspect-[2/1] overflow-hidden rounded-lg object-cover"
              priority
            />
          </picture>
        </div>
      )}
    </section>
  )
} 
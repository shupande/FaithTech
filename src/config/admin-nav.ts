import {
  LayoutDashboard,
  Package,
  Newspaper,
  Lightbulb,
  Wrench,
  Download,
  Settings,
  Mail,
  Scale,
  Menu,
  Home,
  MessageCircle,
  FileText,
  Building2,
  Globe,
  FolderTree,
  Users,
} from "lucide-react"

export const adminNav = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Homepage",
    href: "/admin/homepage",
    icon: Home,
  },
  {
    title: "Pages",
    href: "/admin/pages",
    icon: FileText,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
    submenu: [
      {
        title: "All Products",
        href: "/admin/products",
      },
      {
        title: "Categories",
        href: "/admin/categories",
      },
    ],
  },
  {
    title: "News",
    href: "/admin/news",
    icon: Newspaper,
  },
  {
    title: "Solutions",
    href: "/admin/solutions",
    icon: Lightbulb,
  },
  {
    title: "Services",
    href: "/admin/services",
    icon: Wrench,
  },
  {
    title: "Downloads",
    href: "/admin/downloads",
    icon: Download,
  },
  {
    title: "FAQ",
    href: "/admin/support/faq",
    icon: MessageCircle,
  },
  {
    title: "Navigation",
    href: "/admin/navigation",
    icon: Menu,
  },
  {
    title: "Contact",
    href: "/admin/contact",
    icon: Mail,
    submenu: [
      {
        title: "Form Management",
        href: "/admin/contact",
      },
      {
        title: "Notifications",
        href: "/admin/contact/notifications",
      },
      {
        title: "Settings",
        href: "/admin/contact/settings",
      },
    ],
  },
  {
    title: "Legal",
    href: "/admin/legal",
    icon: Scale,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    submenu: [
      {
        title: "General",
        href: "/admin/settings",
      },
      {
        title: "Users",
        href: "/admin/users",
      },
      {
        title: "SEO",
        href: "/admin/settings/seo",
      },
      {
        title: "Code Injection",
        href: "/admin/settings/code-injection",
      },
      {
        title: "Social Media",
        href: "/admin/settings/social-media",
      },
    ],
  },
] 
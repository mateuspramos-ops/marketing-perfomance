"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  Sparkles,
  Building2,
  Megaphone,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Campanhas",
    href: "/campanhas",
    icon: Megaphone,
  },
  {
    label: "Clientes",
    href: "/clientes",
    icon: Building2,
  },
  {
    label: "Colaborador",
    href: "/colaborador",
    icon: Users,
  },
  {
    label: "Relatório",
    href: "/relatorio",
    icon: FileText,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-foreground/[0.06] bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">
          <div className="mr-6 flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand shadow-lg shadow-primary/30">
              <Sparkles className="h-4.5 w-4.5 text-white" strokeWidth={2.4} />
              <div className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
            </div>
            <span className="font-semibold tracking-tight hidden sm:inline-block">
              Marketing{" "}
              <span className="text-gradient-brand">Performance</span>
            </span>
            <span className="font-bold sm:hidden">MP</span>
          </div>

          <nav className="flex items-center gap-1 rounded-full bg-muted/50 p-1 ring-1 ring-foreground/[0.05]">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-gradient-brand shadow-md shadow-primary/30"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline-block">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

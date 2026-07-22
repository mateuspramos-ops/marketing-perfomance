import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Navigation } from "@/components/navigation";
import "./globals.css";

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const headingFont = Space_Grotesk({
  variable: "--font-heading-family",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono-family",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marketing Performance | Sistema de Gestão",
  description: "Sistema de Gestão de Desempenho e Produtividade para Equipes de Marketing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${bodyFont.variable} ${headingFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -top-32 -left-24 h-[32rem] w-[32rem] rounded-full bg-gradient-brand opacity-25 blur-[110px] aurora-blob dark:opacity-30" />
          <div className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-gradient-success opacity-15 blur-[110px] aurora-blob-alt dark:opacity-20" />
          <div className="absolute bottom-0 left-1/4 h-[24rem] w-[24rem] rounded-full bg-gradient-warning opacity-10 blur-[100px] aurora-blob dark:opacity-15" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,theme(colors.foreground/0.06)_1px,transparent_0)] [background-size:28px_28px] opacity-40" />
        </div>
        <Navigation />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}

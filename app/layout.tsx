import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "@/index.css";

export const metadata: Metadata = {
  title: "CMTBuilders & RapidMix Concrete Solutions Inc.",
  description: "Integrated construction, infrastructure, equipment, and ready-mix concrete solutions.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

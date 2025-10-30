import "../styles/globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "OdontoX",
  description: "Dental Clinic Management SaaS",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}


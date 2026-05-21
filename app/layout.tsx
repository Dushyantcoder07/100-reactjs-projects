import Container from "@/components/common/container";
import Navbar from "@/components/common/navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/utils/theme-provider";
import { generateMetadata as getMetadata } from "@/config/meta";
import "@/styles/globals.css";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";
import FluidCursor from "@/components/fluid-cursor";
import AnimatedPage from "@/components/common/animated-page";

const fontSans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = getMetadata("/");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${fontSans.variable} antialiased font-poppins`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FluidCursor />
          <TooltipProvider>
            <Container className="min-h-screen py-6">
              <Navbar />
              <AnimatedPage>{children}</AnimatedPage>
            </Container>
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

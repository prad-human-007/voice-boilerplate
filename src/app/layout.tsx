import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { PostHogProvider } from "./providers";

import "@livekit/components-styles";
import "./globals.css";

export const metadata: Metadata = {
  title: "Survey Monk",
  description: "Better Surveys",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`} >
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}

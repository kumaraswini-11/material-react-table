import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reunion Assignment",
  description: "This assignment is mainly focuesd on Material React Table.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

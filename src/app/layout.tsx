import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

const font = GeistSans;

export const metadata: Metadata = {
  title: "mobtimer wip",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <div className="grid grid-cols-3 max-w-full pt-20 px-10 gap-10 justify-center">
          <div></div>
          <div className="p-5 flex justify-center">{children}</div>
          <div></div>
        </div>
      </body>
    </html>
  );
}

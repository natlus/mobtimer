import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { PreviousMobs } from "./previous-mobs";
import QueryProvider from "./provider";

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
        <QueryProvider>
          <div className="grid grid-cols-3 max-w-full pt-20 px-10 gap-10 justify-center">
            <div className="pl-20 pt-20 flex">
              <PreviousMobs />
            </div>
            <div className="p-5 flex justify-center">{children}</div>
            <div></div>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}

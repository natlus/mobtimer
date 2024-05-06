import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import QueryProvider from "./provider";
import { NotificationsProvider } from "./notifications-provider";

const font = GeistSans;

export const metadata: Metadata = {
  title: "mobtimer",
};

export default function RootLayout({
  children,
  sidebar,
}: Readonly<{
  children: React.ReactNode;
  sidebar: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <QueryProvider>
          <NotificationsProvider>
            <div className="grid grid-cols-3 max-w-full pt-20 px-4 justify-center">
              <div className="pl-8 pt-20 flex justify-end">
                {/* <Sidebar /> */}
                {sidebar}
              </div>
              <div className="p-5 flex justify-center">{children}</div>
              <div></div>
            </div>
          </NotificationsProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

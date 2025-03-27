import "@/styles/globals.css";

import type { Metadata } from "next";

import SideBar from "@/components/layout/SideBar";

export const metadata: Metadata = {
  title: "Minimal Planner",
  description: "Created by Jialin Yang",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="main-container">
          <header>
            <h1>Minimal Planner</h1>
          </header>

          <div className="sidebar-main">
            <SideBar />
            <main>
              <div className="page-content">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

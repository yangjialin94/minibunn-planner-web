import "@/styles/globals.css";

import type { Metadata } from "next";

import Header from "@/components/layout/Header";
import SideBar from "@/components/layout/SideBar";
import AuthProvider from "@/providers/AuthProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

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
        <AuthProvider>
          <ReactQueryProvider>
            <div className="main-container">
              <Header />

              <div className="sidebar-main">
                <SideBar />
                <main>
                  <div className="page-content">{children}</div>
                </main>
              </div>
            </div>
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

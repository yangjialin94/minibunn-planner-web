import "@/styles/globals.css";

import type { Metadata } from "next";

import Header from "@/components/layout/Header";
import SideBar from "@/components/layout/SideBar";
import AuthProvider from "@/context/AuthProvider";
import ReactQueryProvider from "@/context/ReactQueryProvider";

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
        <ReactQueryProvider>
          <AuthProvider>
            <div className="main-container">
              <Header />

              <div className="sidebar-main">
                <SideBar />
                <main>
                  <div className="page-content">{children}</div>
                </main>
              </div>
            </div>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

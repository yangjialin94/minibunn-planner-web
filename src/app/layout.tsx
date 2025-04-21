import "@/styles/globals.scss";

import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";

import Content from "@/components/layout/Content";
import Header from "@/components/layout/Header";
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

              <Content>
                <main>
                  <div className="page-content">{children}</div>
                  <ToastContainer />
                </main>
              </Content>
            </div>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

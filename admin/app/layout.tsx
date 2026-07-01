import type { Metadata } from "next";
import "./globals.css";
import { AdminAuthProvider } from "../lib/AdminAuthContext";
import { Sidebar } from "../components/Sidebar";

export const metadata: Metadata = {
  title: "LexLoo Admin",
  description: "LexLoo internal operations dashboard",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AdminAuthProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-8">{children}</main>
          </div>
        </AdminAuthProvider>
      </body>
    </html>
  );
}

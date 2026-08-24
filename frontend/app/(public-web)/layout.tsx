import React from "react";
import { Navbar } from "@/shared/components/layout/navbar";
import Footer from "@/shared/components/layout/footer";

export default function PublicWebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}

import React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PreparationWorkbench from "@/experiments/LassaigneTest/components/PreparationWorkbench";

export default function LassaignePreparationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <PreparationWorkbench />
      <Footer />
    </div>
  );
}

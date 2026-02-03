import { Link } from "wouter";

import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Detection() {
  return (
    <div className="min-h-screen bg-hero-green text-white py-16">
      <div className="max-w-5xl mx-auto bg-emerald-900/95 rounded-xl p-6 sm:p-8 shadow-2xl ring-1 ring-white/10">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-serif font-bold">BORPAT ai Detection Centre</h1>

              <Link href="/">
                <Button className="bg-emerald-700/60 text-white">Home</Button>
              </Link>
            </div>

            <div className="text-sm text-amber-50/90 leading-relaxed">
              <p>
                The BORPAT ai Detection Centre is where our AI-driven imaging and pest detection work comes to life. This section brings together the core capabilities that power our platform:
              </p>

              <ul className="mt-4 list-disc list-inside space-y-2">
                <li>Computer vision models trained to identify pest damage and common tea diseases from leaf and canopy images.</li>
                <li>Real-time detection tools for on-site scouting through mobile or drone imagery.</li>
                <li>Actionable recommendations to reduce chemical overuse and improve yield.</li>
                <li>Traceability and reporting for B2B buyers and quality control teams.</li>
              </ul>

              <p className="mt-4">
                Want to try the model? Use our quick scanner or head to the Detection tools to upload an image and get a diagnosis. Our detection tools are designed to be easy for field teams and researchers to use.
              </p>

              <div className="mt-6 flex gap-3">
                <Button onClick={() => window.open('https://aimodeldetector.streamlit.app/', '_blank', 'noopener,noreferrer')} className="bg-amber-400 text-emerald-900">
                  Try the Quick Scanner
                </Button>

                <Link href="/products">
                  <Button className="bg-emerald-700/70 text-white">Buy Products & Supplies</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="md:w-72 w-full">
            <img src="https://cdn.builder.io/api/v1/image/assets%2F3c8edf2c5e3b436684f709f440180093%2F65f93d514a034dd48ade5031e70434a0?format=webp&width=800&height=500" alt="Assam tea gardens" className="w-full h-48 object-cover rounded-md shadow-inner" />

            <div className="mt-4 text-sm text-amber-50/80">
              <p className="font-semibold">Our research and data</p>
              <p className="mt-2">We aggregate anonymized field imagery and partner with estates to continuously improve model accuracy and real-world utility.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

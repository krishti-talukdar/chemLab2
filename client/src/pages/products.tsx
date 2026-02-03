import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const [, navigate] = useLocation();

  const items = [
    "Product catalog with images and descriptions",
    "Pricing and bulk discounts",
    "Minimum order quantities and packaging options",
    "Shipping, delivery times and logistics options",
    "Payment methods and invoices",
    "Product certificates and quality assurances",
    "Contact details for sales and support",
    "Return policy and warranty information",
  ];

  return (
    <div className="min-h-screen bg-hero-green text-white py-16 relative">
      <div className="absolute top-4 left-4 z-50">
        <Button onClick={() => navigate('/')} className="bg-white text-emerald-900 px-3 py-2 rounded shadow-sm">
          Back
        </Button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold" style={{ fontFamily: '"Playfair Display", serif' }}>
            Buy Products from us
          </h1>
          <p className="mt-4 text-white/90 max-w-2xl mx-auto">
            Below are the details and requirements to place orders and work with our product catalog.
          </p>
        </div>

        <div className="bg-white/5 rounded-xl p-8 shadow-lg">
          <ul className="space-y-4 text-lg">
            {items.map((it) => (
              <li key={it} className="flex items-start gap-3">
                <span className="inline-block mt-1 w-3 h-3 rounded-full bg-amber-400" />
                <span>{it}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex gap-3">
            <Button onClick={() => navigate('/subscription')} className="bg-amber-400 text-emerald-900">
              View Subscription Plans
            </Button>

            <Button onClick={() => navigate('/contact')} className="bg-emerald-700/80 text-white">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

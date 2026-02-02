import React from "react";
import { useLocation } from "wouter";
import Button from "@/components/ui/button";

export default function SubscriptionPage() {
  const [, navigate] = useLocation();

  const plans = [
    {
      name: "Basic",
      price: "₹299/mo",
      features: ["Weekly newsletter", "Access to blog content", "Community support"],
      cta: () => navigate('/detection')
    },
    {
      name: "Pro",
      price: "₹799/mo",
      features: ["All Basic features", "Early access to tools", "Priority email support"],
      cta: () => navigate('/detection')
    },
    {
      name: "Enterprise",
      price: "Contact us",
      features: ["Custom integrations", "Dedicated account manager", "SLA & onboarding"],
      cta: () => navigate('/about')
    }
  ];

  return (
    <div className="min-h-screen bg-hero-green text-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold" style={{ fontFamily: '"Playfair Display", serif' }}>
            Subscription Plans
          </h1>
          <p className="mt-4 text-white/90 max-w-2xl mx-auto">
            Choose a plan that fits your agritech needs. Upgrade, downgrade, or contact us for a custom enterprise solution.
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className="bg-white/10 rounded-xl p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">{plan.name}</h3>
                <div className="text-xl font-bold">{plan.price}</div>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-white/90">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <Button onClick={plan.cta} className="w-full bg-amber-400 text-emerald-900 font-semibold">
                  Choose {plan.name}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-white/80">
          <p>
            Need a custom plan? <button onClick={() => navigate('/about')} className="underline">Contact sales</button>
          </p>
        </div>
      </div>
    </div>
  );
}

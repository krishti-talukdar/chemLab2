import { Link } from "wouter";
import { Leaf } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen bg-hero-green text-white py-16">
      <div className="max-w-4xl mx-auto bg-emerald-900/95 rounded-xl p-6 sm:p-8 shadow-2xl ring-1 ring-white/10">
        <div className="flex items-start gap-6">
          <img src="https://cdn.builder.io/api/v1/image/assets%2F3c8edf2c5e3b436684f709f440180093%2F65f93d514a034dd48ade5031e70434a0?format=webp&width=800&height=500" alt="Assam tea gardens" className="w-40 h-28 object-cover rounded-md shadow-inner" />

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-amber-100 text-amber-700 shadow-sm">
                  <Leaf className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-serif font-bold" style={{ fontFamily: '"Playfair Display", serif' }}>About BORPAT ai</h1>
              </div>

              <Link href="/">
                <button className="bg-emerald-700/60 text-white px-3 py-1 rounded">Home</button>
              </Link>
            </div>

            <div className="text-sm text-amber-50/90 leading-relaxed">
              <p>
                We are a forward-thinking agritech and tea solutions company committed to empowering the tea industry through innovation, sustainability, and technology. Our approach merges data-driven intelligence with high-quality agricultural products to help tea growers and buyers thrive in every stage of production.
              </p>

              <p className="mt-3">
                At the heart of our work lies our AI-based pest detection model, designed to help tea estates monitor crop health in real time. By identifying early signs of pest infestation, our technology enables faster decision-making, reduces chemical overuse, and enhances both quality and yield.
              </p>

              <p className="mt-3">
                Alongside technology, we provide a range of eco-conscious pest control products developed to maintain tea garden health naturally and effectively.
              </p>

              <p className="mt-3">
                Through our B2B tea supply solutions, we connect certified tea producers with bulk buyers and exporters who value traceability and sustainability. By bridging technology with tradition, we ensure every cup of tea represents the best of innovation, care, and agricultural excellence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

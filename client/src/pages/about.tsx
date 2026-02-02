import { Link } from "wouter";
import { Leaf } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-emerald-100 to-amber-50 py-12">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm shadow-2xl rounded-lg p-10 border border-emerald-200">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-emerald-100 text-emerald-700 shadow-sm">
              <Leaf className="w-6 h-6" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif italic" style={{ fontFamily: '"Playfair Display", serif' }}>About ASSAM</h1>
          </div>

          <Link href="/">
            <button className="bg-emerald-800 text-white px-4 py-2 rounded shadow">Home</button>
          </Link>
        </div>

        <h2 className="text-lg text-amber-800 font-semibold mb-6 tracking-wide">Assam Tea – The Pride of India</h2>

        <div className="space-y-6 text-gray-800 text-lg leading-relaxed">
          <p className="first-line:uppercase first-line:tracking-widest">Assam tea is a symbol of richness, strength, and tradition. Grown along the fertile banks of the Brahmaputra River, the lush tea gardens of Assam produce one of the world’s finest and most distinctive teas. Known for its bold flavor, deep amber color, and brisk, malty taste, Assam tea offers an experience that is both refreshing and energizing.</p>

          <blockquote className="border-l-4 border-emerald-300 pl-4 italic text-emerald-900 bg-emerald-50/60 p-4 rounded">
            <span className="text-2xl mr-2 align-middle">☕</span>
            What makes Assam tea truly special is its unique growing environment. The region’s warm climate, abundant rainfall, and rich alluvial soil create perfect conditions for tea cultivation, giving Assam tea its unmatched aroma and character. Each cup reflects the heritage, hard work, and craftsmanship of generations of tea growers.
          </blockquote>

          <p>Celebrated globally and enjoyed daily by millions, Assam tea is more than just a beverage—it is a legacy of quality, culture, and natural excellence. A sip of Assam tea is a taste of authenticity, warmth, and the timeless spirit of India.</p>

          <div className="flex items-center gap-4 mt-4">
            <span className="text-3xl">✨</span>
            <p className="text-sm text-gray-600">Learn more about Assam's tea-growing regions, seasonality, and traditional processing techniques in our interactive experiences.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

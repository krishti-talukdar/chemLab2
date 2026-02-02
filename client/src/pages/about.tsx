import { Link } from "wouter";

export default function About() {
  const html = `Assam Tea – The Pride of India<br><br>

Assam tea is a symbol of richness, strength, and tradition. Grown along the fertile banks of the Brahmaputra River, the lush tea gardens of Assam produce one of the world’s finest and most distinctive teas. Known for its bold flavor, deep amber color, and brisk, malty taste, Assam tea offers an experience that is both refreshing and energizing.<br><br>

What makes Assam tea truly special is its unique growing environment. The region’s warm climate, abundant rainfall, and rich alluvial soil create perfect conditions for tea cultivation, giving Assam tea its unmatched aroma and character. Each cup reflects the heritage, hard work, and craftsmanship of generations of tea growers.<br><br>

Celebrated globally and enjoyed daily by millions, Assam tea is more than just a beverage—it is a legacy of quality, culture, and natural excellence. A sip of Assam tea is a taste of authenticity, warmth, and the timeless spirit of India.`;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded p-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-serif italic">About ASSAM</h1>
          <Link href="/">
            <button className="bg-emerald-800 text-white px-4 py-2 rounded">Home</button>
          </Link>
        </div>

        <div className="prose prose-lg text-gray-800" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}

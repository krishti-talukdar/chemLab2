import { Link } from "wouter";

export default function Detection() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded p-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-serif">BORPAT ai Detection Centre</h1>
          <Link href="/">
            <button className="bg-emerald-800 text-white px-4 py-2 rounded">Home</button>
          </Link>
        </div>

        <p className="text-gray-700 leading-relaxed">Welcome to the BORPAT ai Detection Centre. This section will host interactive detection tools and resources related to agricultural imaging and tea quality analysis. Content coming soon.</p>
      </div>
    </div>
  );
}

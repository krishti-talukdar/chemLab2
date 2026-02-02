import { FlaskRound } from "lucide-react";
import { FaTwitter, FaFacebook, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-emerald-900 text-emerald-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FlaskRound className="text-2xl text-emerald-200" />
              <h4 className="text-xl font-bold">ChemLab Virtual</h4>
            </div>
            <p className="text-emerald-200 mb-4 max-w-md">
              Empowering chemistry education through interactive virtual experiments.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-emerald-200 hover:text-white">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-emerald-200 hover:text-white">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="text-emerald-200 hover:text-white">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="#" className="text-emerald-200 hover:text-white">
                <FaGithub className="text-xl" />
              </a>
            </div>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Company</h5>
            <ul className="space-y-2 text-emerald-200">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Resources</h5>
            <ul className="space-y-2 text-emerald-200">
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Docs</a></li>
              <li><a href="#" className="hover:text-white">Support</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Contact</h5>
            <p className="text-emerald-200 mb-4">Kohima, Nagaland, India<br/>info@example.com<br/>+91 98765 43210</p>
            <div className="flex items-center gap-2">
              <input type="email" placeholder="Your email" className="px-3 py-2 rounded-l bg-emerald-800 text-emerald-100 border border-emerald-700" />
              <button className="px-4 py-2 bg-emerald-700 text-white rounded-r">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="border-t border-emerald-800 mt-8 pt-8 text-center text-emerald-300">
          <p>&copy; 2024 ChemLab Virtual. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

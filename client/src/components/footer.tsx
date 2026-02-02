import { FaTwitter, FaFacebook, FaLinkedin, FaGithub } from "react-icons/fa";
import { FlaskRound } from "lucide-react";

export default function Footer() {
  return (
    <footer id="about-assam" className="bg-footer-green text-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h5 className="font-semibold mb-4">Company</h5>
            <ul className="space-y-2 text-cream/80">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Smart Farming</a></li>
              <li><a href="#" className="hover:text-white transition-colors">IoT Sensors</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Crop Monitoring</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Precision Agriculture</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Products &amp; Services</h5>
            <ul className="space-y-2 text-cream/80">
              <li><a href="#" className="hover:text-white transition-colors">Drone Tech</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI Analytics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sustainability Tools</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Soil Sensors</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Farm Advisory</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Resources</h5>
            <ul className="space-y-2 text-cream/80">
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Farmer's Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Downloads</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Contact</h5>
            <p className="text-cream/80 mb-4">Kohima, Nagaland, India<br/>info@agritech.com<br/>+91 98765 43210</p>
            <label className="text-sm text-cream/80 mb-2 block">Subscribe for agritech updates</label>
            <div className="flex gap-2">
              <input id="subscribe-email" type="email" placeholder="Your email" className="flex-1 rounded px-3 py-2 text-foreground bg-white" />
              <button className="bg-white text-emerald-800 rounded px-3 py-2">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="text-center mb-6 text-cream/80">Connect with us</div>
          <div className="flex justify-center space-x-4 mb-6">
            <a href="#" className="text-cream/80 hover:text-white transition-colors"><FaTwitter className="text-xl" /></a>
            <a href="#" className="text-cream/80 hover:text-white transition-colors"><FaFacebook className="text-xl" /></a>
            <a href="#" className="text-cream/80 hover:text-white transition-colors"><FaLinkedin className="text-xl" /></a>
            <a href="#" className="text-cream/80 hover:text-white transition-colors"><FaGithub className="text-xl" /></a>
          </div>

          <div className="border-t border-cream/20 pt-6 text-center text-cream/70">
            <p>&copy; 2026 AgriVerse. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

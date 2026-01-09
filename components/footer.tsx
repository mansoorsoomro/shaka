import Link from "next/link"
import { Mail, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-[#01ab3112] pt-20 pb-10 border-t border-[#01AB31]/10">
      <div className="container mx-auto px-4">
        {/* Top Section: Newsletter and Links */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Newsletter */}
          <div className="space-y-8 pr-0 lg:pr-12 md:border-r border-[#01AB31]/20">
            <h3 className="text-3xl md:text-4xl font-serif max-w-lg leading-tight">
              Expert advice, updates, and surprises for your inbox
            </h3>
            <div className="relative max-w-md">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Enter your email address"
                className="pl-12 h-14 bg-white rounded-full border-2 border-[#01AB31]/30 focus:border-[#01AB31] transition-colors text-lg"
              />
            </div>
          </div>

          {/* Right: Links Categories */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pl-0 lg:pl-12">
            <div className="space-y-6">
              <h4 className="text-xl font-bold">Shop</h4>
              <ul className="space-y-4 text-gray-600">
                <li><Link href="/shop" className="hover:text-[#01AB31]">Pants</Link></li>
                <li><Link href="/shop" className="hover:text-[#01AB31]">Diapers</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-xl font-bold">Support</h4>
              <ul className="space-y-4 text-gray-600">
                <li><Link href="/how-it-works" className="hover:text-[#01AB31]">How It Works</Link></li>
                <li><Link href="/resources" className="hover:text-[#01AB31]">Size Guide</Link></li>
                <li><Link href="/resources" className="hover:text-[#01AB31]">FAQs</Link></li>
                <li><Link href="/contact" className="hover:text-[#01AB31]">Contact Us</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-xl font-bold">Contact</h4>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[#01AB31]" />
                  <span className="text-sm">support@logo.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[#01AB31]" />
                  <span className="text-sm">1-800-LOGO</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Middle Section: Large Logo branding */}
        <div className="relative py-12 border-t border-b border-[#01AB31]/20 my-12">
          <div className="text-[4rem] md:text-[4rem] font-bold text-[#01AB31] text-center leading-none tracking-tighter uppercase opacity-90">
            Shaka
          </div>
        </div>

        {/* Bottom Section: Copyright and Legal */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500">
          <p>© 2025 shaka. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-8">
            <Link href="#" className="hover:text-[#01AB31]">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#01AB31]">Terms of Service</Link>
            <Link href="#" className="hover:text-[#01AB31]">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

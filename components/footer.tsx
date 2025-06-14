import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="font-serif text-2xl font-bold">
              BUCCI
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Redefining luxury with extravagance and elegance. Our commitment to quality and craftsmanship is
              unmatched.
            </p>
            <div className="mt-4 flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-black">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-black">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-black">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-wider">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/collections/new" className="text-muted-foreground hover:text-black">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products?category=outerwear" className="text-muted-foreground hover:text-black">
                  Outerwear
                </Link>
              </li>
              <li>
                <Link href="/products?category=tops" className="text-muted-foreground hover:text-black">
                  T-shirts & Tops
                </Link>
              </li>
              <li>
                <Link href="/products?category=pants" className="text-muted-foreground hover:text-black">
                  Pants
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="text-muted-foreground hover:text-black">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-wider">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-black">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="text-muted-foreground hover:text-black">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-black">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/stores" className="text-muted-foreground hover:text-black">
                  Store Locator
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-black">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-wider">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-black">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-black">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-muted-foreground hover:text-black">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-black">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-black">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Bucci. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}


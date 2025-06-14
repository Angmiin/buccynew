import FeaturedProducts from "@/components/featured-products"
import HeroSection from "@/components/hero-section"
import CollectionsShowcase from "@/components/collections-showcase"
import Newsletter from "@/components/newsletter"

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      <HeroSection />
      <FeaturedProducts />
      <CollectionsShowcase />
      <Newsletter />
    </div>
  )
}


import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="relative h-[90vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d"
          alt="Luxury fashion"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="mb-4 font-serif text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          BUCCI
        </h1>
        <p className="mb-8 max-w-2xl text-lg font-light tracking-wider sm:text-xl">
          Redefining luxury with extravagance and elegance, quality is remembered long after price is forgotten
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Button
            asChild
            size="lg"
            className="min-w-[150px] bg-white text-black"
          >
            <Link href="/products">Shop Now</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="min-w-[150px] bg-white text-black"
          >
          </Button>
        </div>
      </div>
    </div>

  );
}

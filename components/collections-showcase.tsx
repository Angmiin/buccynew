import Link from "next/link";
import Image from "next/image";

const collections = [
  {
    id: "summer",
    name: "Summer Essentials",
    description: "Lightweight luxury for the warmer months",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
  },
  {
    id: "evening",
    name: "Evening Attire",
    description: "Sophisticated pieces for special occasions",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
  },
  {
    id: "accessories",
    name: "Statement Accessories",
    description: "The finishing touches that define your look",
    image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93",
  },
];

export default function CollectionsShowcase() {
  return (
    <section className="bg-neutral-50 py-16">
      <div className="container px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-2 font-serif text-3xl font-bold tracking-tight md:text-4xl">
            Explore Our Collections
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Each collection tells a story of craftsmanship and timeless
            elegance.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="mb-2 font-serif text-2xl font-medium">
                  {collection.name}
                </h3>
                <p className="mb-4 text-sm text-white/80">
                  {collection.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

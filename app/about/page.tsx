import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Bucci Atelier"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Our Story
          </h1>
          <p className="max-w-2xl text-lg font-light tracking-wider sm:text-xl">
            A legacy of luxury, craftsmanship, and innovation since 1990
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="container px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-serif text-3xl font-bold">
            The Bucci Legacy
          </h2>
          <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
            Founded in 1990, Bucci emerged from a vision to redefine luxury
            fashion. What began as a small atelier in Milan has grown into a
            global symbol of Italian craftsmanship and contemporary elegance.
          </p>
          <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
            Our commitment to excellence is reflected in every piece we create,
            from the finest materials to the meticulous attention to detail that
            goes into each garment.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="container px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="mb-2 font-serif text-xl font-bold">Excellence</h3>
            <p className="text-muted-foreground">
              We strive for perfection in every detail, ensuring the highest
              quality in our craftsmanship.
            </p>
          </div>

          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                  />
                </svg>
              </div>
            </div>
            <h3 className="mb-2 font-serif text-xl font-bold">Innovation</h3>
            <p className="text-muted-foreground">
              We continuously push boundaries in design and technology while
              respecting traditional techniques.
            </p>
          </div>

          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6h.008v.008H6V6z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="mb-2 font-serif text-xl font-bold">
              Sustainability
            </h3>
            <p className="text-muted-foreground">
              We are committed to sustainable practices and responsible sourcing
              of materials.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-serif text-3xl font-bold">Our Team</h2>
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            Behind every Bucci piece is a team of passionate artisans,
            designers, and craftspeople who bring our vision to life.
          </p>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="mb-4 aspect-square overflow-hidden rounded-full">
                  <Image
                    src={`/placeholder.svg?height=400&width=400`}
                    alt="Team member"
                    width={400}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="font-serif text-xl font-bold">
                  Team Member {i}
                </h3>
                <p className="text-muted-foreground">Position</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4">
        <div className="mx-auto max-w-3xl rounded-xl bg-black p-8 text-center text-white sm:p-12">
          <h2 className="mb-4 font-serif text-3xl font-bold">
            Join Our Journey
          </h2>
          <p className="mb-8 text-lg text-white/80">
            Experience the world of Bucci and discover our latest collections.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-black hover:bg-white/90"
          >
            <Link href="/products">Explore Collection</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

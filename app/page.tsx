import type { Metadata } from 'next'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { CategoryCard } from "@/components/category-card"
import { FeatureSection } from "@/components/feature-section"

export const metadata: Metadata = {
  title: "Homepage | Shaka",
}

export default function Homepage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
          <Image src="/images/Rectangle.png" alt="Happy senior couple" fill className="object-cover brightness-75" priority />
          <div className="container relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto uppercase tracking-wide leading-tight">
              Comfort, Confidence, and Discretion
            </h1>
            <Button size="lg" className="bg-brand-green hover:bg-brand-green/90 text-white rounded-full px-8">
              Shop The diaper
            </Button>
          </div>
        </section>

        {/* Category Cards */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div style={{ width: "75%", position: "relative", left: "0", right: "0", marginLeft: "auto", marginRight: "auto" }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <CategoryCard style={{ backgroundColor: "#01ab3112" }}
                title="The Diaper"
                description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
                image="/image 22.png"
                buttonText="Shop The Diaper"
              />
              <CategoryCard style={{ backgroundColor: "#01ab3112" }}
                title="The Pant"
                description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
                image="/image 22.png"
                buttonText="Shop The Pant"
                isDark
              />
            </div>
          </div>
        </section>

        {/* Modern Essentials */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-serif mb-6 max-w-2xl mx-auto leading-tight">
              The modern diapering essentials
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
              <div className="aspect-[4/3] relative rounded-lg overflow-hidden -rotate-2">
                <Image src="/caregiver-helping-senior.jpg" alt="Caregiving" fill className="object-cover" />
              </div>
              <div className="aspect-[4/3] relative rounded-lg overflow-hidden rotate-2 translate-y-8">
                <Image src="/seniors-laughing-together.jpg" alt="Community" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <FeatureSection
          title="Designed to perform"
          description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text"
          image="/diaper-texture-macro.jpg"
          buttonText="Shop the diaper"
          bgColor="bg-[#01ab3112]"
        />
        <FeatureSection
          title="Held to high safety standards"
          description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text"
          image="/senior-holding-diaper-smiling.jpg"
          buttonText="Read over safety reports"
          reverse
          bgColor="bg-white"
        />
        <FeatureSection
          title="Delivered to your doorstep"
          description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text"
          image="/product-packaging-box.jpg"
          buttonText="Get Started"
          bgColor="bg-[#efefef]"
        />

        {/* Community */}
        <section className="py-20 bg-[#01ab3112]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 max-w-2xl mx-auto">Welcome to our Diaper community</h2>
            <p className="text-gray-500 mb-16 text-lg">So nice to have you here</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`aspect-[3/4.5] relative rounded-xl overflow-hidden border-2 border-[#01AB31] shadow-[0_4px_20px_rgba(1,171,49,0.2)] ${i % 2 === 0 ? "translate-y-4" : "-translate-y-4"}`}>
                  <Image
                    src={`/lifestyle-senior-photography-.jpg?height=500&width=350&query=lifestyle+senior+photography+${i}`}
                    alt="Community"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA/Testimonial */}
        <section className="relative h-[500px] flex items-center justify-center">
          <Image src="/seniors-hands-touching.jpg" alt="Trust" fill className="object-cover brightness-50" />
          <div className="container relative z-10 text-center text-white px-4">
            <p className="text-3xl md:text-5xl font-serif max-w-4xl mx-auto mb-8">Lorem Ipsum is simply dummy text</p>
            <p className="max-w-xl mx-auto opacity-80 mb-8">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </p>
            <div className="flex flex-wrap justify-center gap-8 opacity-60">
              {["Pampers", "Friends", "Huggies"].map((brand) => (
                <span key={brand} className="text-xl font-bold italic tracking-widest">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}


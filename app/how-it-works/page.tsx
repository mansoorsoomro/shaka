import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { RefreshCw, LayoutPanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function HowItWorksPage() {
  const steps = [
    {
      title: "Expert Guidance",
      desc: "Our trained staff can help you find the right products for your specific needs. Browse our selection or reach out for personalized recommendations.",
      img: "/images/screenshot-202026-01-04-20at-202.png",
    },
    {
      title: "Place Your Order",
      desc: "Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the industry's standard dummy. Lorem Ipsum has been the standard dummy.",
      img: "/images/screenshot-202026-01-04-20at-202.png",
    },
    {
      title: "Discreet Delivery",
      desc: "Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the industry's standard dummy. Lorem Ipsum has been the standard dummy.",
      img: "/images/screenshot-202026-01-04-20at-202.png",
    },
    {
      title: "Live Confidently",
      desc: "Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the industry's standard dummy. Lorem Ipsum has been the standard dummy.",
      img: "/images/screenshot-202026-01-04-20at-202.png",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        {/* Header */}
        <section className="py-16 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">How It Works</h1>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the
              industry's standard dummy.
            </p>
          </div>
        </section>

        {/* Steps Grid */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto space-y-24">
            {steps.map((step, i) => (
              <div key={i} className="grid md:grid-cols-2 gap-12 items-center">
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-6 text-white text-2xl font-bold">
                    {i + 1}
                  </div>
                  <h2 className="font-serif text-3xl font-bold mb-4 uppercase tracking-tight">{step.title}</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>{step.desc}</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Lorem ipsum is simply dummy text
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Lorem ipsum is simply dummy text
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Lorem ipsum is simply dummy text
                      </li>
                    </ul>
                  </div>
                </div>
                <div className={i % 2 === 1 ? "md:order-1" : ""}>
                  <div
                    className={`relative h-[350px] rounded-lg overflow-hidden border-8 border-white shadow-xl ${i % 2 === 0 ? "rotate-2" : "-rotate-2"}`}
                  >
                    <Image src={step.img || "/placeholder.svg"} alt={step.title} fill className="object-cover" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Subscribe & Save */}
        <section className="py-20 px-4 bg-accent/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-16 uppercase">Subscribe & Save</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Save More", icon: "15%", desc: "Get 15% off every subscription order" },
                { title: "Never Run Out", icon: RefreshCw, desc: "Automatic deliveries on your schedule" },
                { title: "Flexible Control", icon: LayoutPanelLeft, desc: "Modify, skip, or cancel anytime" },
              ].map((card, i) => (
                <div key={i} className="bg-white border-2 border-primary/20 rounded-xl p-10 text-center shadow-sm">
                  <div className="mb-6 flex justify-center">
                    {typeof card.icon === "string" ? (
                      <span className="text-5xl font-bold text-primary">{card.icon}</span>
                    ) : (
                      <card.icon className="w-14 h-14 text-primary" />
                    )}
                  </div>
                  <h3 className="font-bold text-xl mb-4 uppercase tracking-tight">{card.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Choosing the Right Product */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-16 uppercase">Choosing the Right Product</h2>
            <div className="bg-white border-2 border-primary/20 rounded-xl p-10 shadow-sm">
              <div className="space-y-10">
                <div>
                  <h3 className="font-bold text-lg mb-4 uppercase text-primary">Consider Your Needs:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span className="text-muted-foreground">
                        <span className="font-bold">Light Incontinence:</span> Moderate absorbency briefs or pads for
                        occasional leaks.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span className="text-muted-foreground">
                        <span className="font-bold">Moderate Incontinence:</span> Premium absorbency for daily
                        protection.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span className="text-muted-foreground">
                        <span className="font-bold">Heavy Incontinence:</span> Ultra maximum absorbency for overnight
                        and heavy use.
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-4 uppercase text-primary">Lifestyle Factors:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span className="text-muted-foreground">
                        <span className="font-bold">Active Lifestyle:</span> Pull-on style for easy changing on the go.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span className="text-muted-foreground">
                        <span className="font-bold">Limited Mobility:</span> Tab-style briefs with adjustable closures.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span className="text-muted-foreground">
                        <span className="font-bold">Night-time use:</span> Maximum absorbency with leak guards.
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                  <p className="text-sm text-primary font-bold mb-1 uppercase tracking-wider">Need Help Choosing?</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Our care specialists are available 24/7 to provide personalized recommendations. Call us at
                    1-800-LOGO or use our live chat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-primary py-16 px-4 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 uppercase">
              Experience the Adult Diaper Difference
            </h2>
            <p className="mb-8 text-white/90">
              Join thousands of satisfied customers who trust us for their daily comfort needs
            </p>
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-primary hover:bg-white/90 border-white px-12"
              asChild
            >
              <Link href="/shop">Shop Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

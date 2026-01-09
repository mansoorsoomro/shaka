import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Shield, Award, Lock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        {/* Header */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">About Us</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the
              industry's standard dummy.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 px-4 bg-accent/20">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-3xl font-bold text-primary mb-6 uppercase tracking-wider">Our Story</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the
                    industry's standard dummy. Lorem Ipsum has been the industry's standard dummy.
                  </p>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the
                    industry's standard dummy. Lorem Ipsum is simply dummy text of the printing.
                  </p>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the
                    industry's standard dummy. Lorem Ipsum has been the industry's standard dummy.
                  </p>
                </div>
              </div>
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image
                  src="/images/screenshot-202026-01-04-20at-202.png"
                  alt="Senior woman"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-12 uppercase">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Dignity First",
                  icon: Shield,
                  desc: "We treat every customer with respect and understanding, ensuring their dignity is always preserved.",
                },
                {
                  title: "Quality Guaranteed",
                  icon: Award,
                  desc: "Only the highest quality products make it to our shelves. We stand behind everything we sell.",
                },
                {
                  title: "Privacy Matters",
                  icon: Lock,
                  desc: "Discreet packaging and secure ordering ensure your privacy is always protected.",
                },
              ].map((val, i) => (
                <div
                  key={i}
                  className="border-2 border-primary/20 rounded-lg p-8 hover:border-primary transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-6">
                    <val.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-4 uppercase">{val.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Commitment */}
        <section className="py-16 px-4 bg-accent/20">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-12 uppercase">Our Commitment to You</h2>
            <div className="space-y-6">
              {[
                {
                  title: "Expert Guidance",
                  desc: "Our trained staff can help you find the right products for your specific needs.",
                },
                {
                  title: "Fast, Discreet Shipping",
                  desc: "Orders ship within 24 hours in plain packaging with no identifying marks.",
                },
                {
                  title: "Satisfaction Guarantee",
                  desc: "30-day money-back guarantee on all unopened products - no questions asked.",
                },
                {
                  title: "24/7 Customer Support",
                  desc: "Our compassionate support team is always available to help with any questions.",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 uppercase">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
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

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function AboutUs() {
    const benefits = [
        {
            title: 'Expert Team',
            description: 'Our team of professionals brings decades of combined experience in the industry.',
        },
        {
            title: 'Quality Service',
            description: 'We are committed to delivering the highest quality service to all our clients.',
        },
        {
            title: 'Innovation',
            description: 'We continuously innovate to provide cutting-edge solutions to our customers.',
        },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-foreground mb-8">About Us</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Our Story</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-foreground leading-relaxed">
                            Founded in 2020, our company has grown to become a leading provider of innovative solutions in the industry.
                            We started with a simple mission: to help businesses succeed through cutting-edge technology and exceptional service.
                        </p>
                        <p className="text-foreground leading-relaxed">
                            Today, we serve hundreds of satisfied customers worldwide, helping them achieve their goals and transform their businesses.
                            Our commitment to excellence and customer satisfaction drives everything we do.
                        </p>
                        <p className="text-foreground leading-relaxed">
                            We believe in building long-term relationships with our clients based on trust, transparency, and mutual success.
                        </p>
                    </CardContent>
                </Card>

                <div className="bg-white rounded-lg overflow-hidden shadow-md h-96">
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-6xl font-bold text-primary/60 mb-2">John Smith</div>
                            <p className="text-foreground font-semibold">CEO & Founder</p>
                            <p className="text-muted-foreground text-sm">15+ Years of Industry Experience</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Our Benefits Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-6">Our Benefits</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {benefits.map((benefit) => (
                        <Card key={benefit.title} className="bg-white">
                            <CardContent className="pt-6">
                                <div className="flex gap-4">
                                    <CheckCircle2 size={24} className="text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                                        <p className="text-muted-foreground text-sm">{benefit.description}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Our Values Section */}
            <Card className="bg-white">
                <CardHeader>
                    <CardTitle>Our Values</CardTitle>
                    <CardDescription>What we stand for</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-foreground mb-2">Integrity</h4>
                            <p className="text-muted-foreground">We conduct our business with honesty and strong moral principles in all our dealings.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground mb-2">Excellence</h4>
                            <p className="text-muted-foreground">We strive for excellence in every aspect of our work and customer interactions.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground mb-2">Customer Focus</h4>
                            <p className="text-muted-foreground">Our customers are at the heart of everything we do, and their success is our success.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground mb-2">Collaboration</h4>
                            <p className="text-muted-foreground">We believe in the power of teamwork and collaborative partnerships to achieve great things.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

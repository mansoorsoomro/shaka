'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function HowItWorks() {
    const steps = [
        {
            number: '01',
            title: 'Sign Up',
            description: 'Create your account and set up your profile with all necessary information.',
            details: [
                'Visit our website and click Sign Up',
                'Enter your email and create a password',
                'Verify your email address',
                'Complete your profile setup',
            ],
        },
        {
            number: '02',
            title: 'Choose Plan',
            description: 'Select the perfect plan that matches your business needs.',
            details: [
                'Review all available plans',
                'Compare features and pricing',
                'Select your preferred plan',
                'Complete billing setup',
            ],
        },
        {
            number: '03',
            title: 'Start Using',
            description: 'Begin using our service and access all the features immediately.',
            details: [
                'Log in to your dashboard',
                'Set up your preferences',
                'Invite team members',
                'Start creating content',
            ],
        },
        {
            number: '04',
            title: 'Grow Your Business',
            description: 'Scale your business with our powerful tools and support.',
            details: [
                'Monitor your progress',
                'Analyze performance metrics',
                'Optimize your strategy',
                'Expand your reach',
            ],
        },
    ];

    return (
        <div>
            <div className="mb-12">
                <h1 className="text-3xl font-bold text-foreground mb-4">How It Works</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Our simple and straightforward process makes it easy to get started and achieve your goals in just a few steps.
                </p>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {steps.map((step, index) => (
                    <Card key={step.number} className="bg-white">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-4xl font-bold text-primary mb-2">{step.number}</div>
                                    <CardTitle>{step.title}</CardTitle>
                                    <CardDescription>{step.description}</CardDescription>
                                </div>
                                {index < steps.length - 1 && (
                                    <ArrowRight size={24} className="text-primary mt-2" />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {step.details.map((detail, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                        <span className="text-foreground text-sm">{detail}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Process Overview */}
            <Card className="bg-white mb-12">
                <CardHeader>
                    <CardTitle>Complete Process Timeline</CardTitle>
                    <CardDescription>Follow our proven methodology for success</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex gap-8">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                                        {step.number}
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className="w-0.5 h-24 bg-primary/30 my-4" />
                                    )}
                                </div>
                                <div className="pb-8">
                                    <h4 className="text-lg font-semibold text-foreground mb-2">{step.title}</h4>
                                    <p className="text-muted-foreground mb-4">{step.description}</p>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm font-medium text-foreground mb-3">Key Activities:</p>
                                        <ul className="space-y-2">
                                            {step.details.map((detail, idx) => (
                                                <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                                                    {detail}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Image Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-2">📊</div>
                        <p className="text-foreground font-semibold">Analytics & Insights</p>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-2">🚀</div>
                        <p className="text-foreground font-semibold">Growth & Scaling</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

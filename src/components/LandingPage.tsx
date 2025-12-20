import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowRight, Upload, Sparkles, Download, CheckCircle, Star, Users, Award, TrendingUp } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onShowSample: () => void;
}

export function LandingPage({ onGetStarted, onShowSample }: LandingPageProps) {
  const [activeStep, setActiveStep] = useState(0);

  const features = [
    {
      icon: Upload,
      title: 'Upload Your CV',
      description: 'Upload your existing CV in PDF or Word format, or paste your CV text directly'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Analysis',
      description: 'Our smart engine analyzes your CV against job requirements and ATS standards'
    },
    {
      icon: CheckCircle,
      title: 'Get Improvements',
      description: 'Receive detailed suggestions and a match score with actionable improvements'
    },
    {
      icon: Download,
      title: 'Download & Apply',
      description: 'Download your optimized CV and start applying to your dream jobs'
    }
  ];

  const testimonials = [
    {
      name: 'Chidinma Okafor',
      role: 'Software Engineer',
      company: 'TechCorp Lagos',
      image: 'https://i.pravatar.cc/150?img=1',
      text: 'ResumeGenie helped me land 3 interviews in one week! The CV optimization is incredible.',
      rating: 5
    },
    {
      name: 'Ademola Williams',
      role: 'Product Manager',
      company: 'FinTech Solutions',
      image: 'https://i.pravatar.cc/150?img=12',
      text: 'I went from 0 responses to multiple interview calls. The ATS optimization really works!',
      rating: 5
    },
    {
      name: 'Blessing Eze',
      role: 'Marketing Specialist',
      company: 'Brand Masters',
      image: 'https://i.pravatar.cc/150?img=5',
      text: 'Best investment in my job search. The cover letter generator saved me so much time!',
      rating: 5
    }
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Happy Users' },
    { icon: Award, value: '95%', label: 'Match Rate' },
    { icon: TrendingUp, value: '3x', label: 'More Interviews' }
  ];

  const pricingPackages = [
    { price: 1000, points: 10, bonus: 0 },
    { price: 2000, points: 21, bonus: 1, popular: true },
    { price: 5000, points: 55, bonus: 5 },
    { price: 10000, points: 120, bonus: 20 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl">ResumeGenie</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onGetStarted}>
              Login
            </Button>
            <Button onClick={onGetStarted}>
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Trusted by 10,000+ Nigerian job seekers</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl leading-tight">
            Your dream job might ignore your CV — <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">let's fix that today</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Smart CV revamp made for Nigerian job seekers. Upload your CV, paste the job description, and get a tailored CV in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={onGetStarted} className="text-lg px-8 py-6">
              Try Free CV Fix
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={onShowSample} className="text-lg px-8 py-6">
              See Sample Output
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 pt-8">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="flex items-center gap-2 text-purple-600 mb-1">
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">How ResumeGenie Works</h2>
            <p className="text-xl text-gray-600">Get your optimized CV in 4 simple steps</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className={`p-6 cursor-pointer transition-all ${activeStep === index ? 'border-purple-600 shadow-lg' : ''}`}
                  onMouseEnter={() => setActiveStep(index)}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm text-purple-600 mb-2">Step {index + 1}</div>
                  <h3 className="mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Join thousands of Nigerians who landed their dream jobs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div>{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-gray-500">{testimonial.company}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Simple, Affordable Pricing</h2>
            <p className="text-xl text-gray-600">Pay as you go with our flexible points system</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {pricingPackages.map((pkg, index) => (
              <Card 
                key={index}
                className={`p-6 text-center ${pkg.popular ? 'border-purple-600 shadow-lg relative' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                    Popular
                  </div>
                )}
                <div className="text-3xl mb-2">₦{pkg.price.toLocaleString()}</div>
                <div className="text-gray-600 mb-4">
                  {pkg.points} points
                  {pkg.bonus > 0 && (
                    <span className="text-green-600 block text-sm">+{pkg.bonus} bonus</span>
                  )}
                </div>
                <Button 
                  variant={pkg.popular ? "default" : "outline"}
                  className="w-full"
                  onClick={onGetStarted}
                >
                  Get Started
                </Button>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 text-gray-600">
            <p>✨ Get 1 free point when you sign up!</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto p-8 md:p-12 text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
          <h2 className="text-3xl md:text-4xl mb-4">Ready to Transform Your Job Search?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of successful job seekers and get your dream job faster
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={onGetStarted}
            className="text-lg px-8 py-6"
          >
            Start Your Free CV Fix Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span>ResumeGenie</span>
            </div>
            <p className="text-gray-600 text-sm">
              © 2025 ResumeGenie. Made with ❤️ for Nigerian job seekers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

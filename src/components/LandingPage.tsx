// src/components/LandingPage.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  ArrowRight,
  Upload,
  Sparkles,
  Download,
  CheckCircle,
  Star,
  Users,
  Award,
  TrendingUp,
} from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Upload,
      title: "Upload Your CV",
      description:
        "Upload your existing CV in PDF or Word format, or paste your CV text directly",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Analysis",
      description:
        "Our smart engine analyzes your CV against job requirements and ATS standards",
    },
    {
      icon: CheckCircle,
      title: "Get Improvements",
      description:
        "Receive detailed suggestions and a match score with actionable improvements",
    },
    {
      icon: Download,
      title: "Download & Apply",
      description:
        "Download your optimized CV and start applying to your dream jobs",
    },
  ];

  const testimonials = [
    {
      name: "Chidinma Okafor",
      role: "Software Engineer",
      company: "TechCorp Lagos",
      image: "https://i.pravatar.cc/150?img=1",
      text: "FlowJobAi helped me land 3 interviews in one week! The CV optimization is incredible.",
      rating: 5,
    },
    {
      name: "Ademola Williams",
      role: "Product Manager",
      company: "FinTech Solutions",
      image: "https://i.pravatar.cc/150?img=12",
      text: "I went from 0 responses to multiple interview calls. The ATS optimization really works!",
      rating: 5,
    },
    {
      name: "Blessing Eze",
      role: "Marketing Specialist",
      company: "Brand Masters",
      image: "https://i.pravatar.cc/150?img=5",
      text: "Best investment in my job search. The cover letter generator saved me so much time!",
      rating: 5,
    },
  ];

  const stats = [
    { icon: Users, value: "10,000+", label: "Happy Users" },
    { icon: Award, value: "95%", label: "Match Rate" },
    { icon: TrendingUp, value: "3x", label: "More Interviews" },
  ];

  const pricingPackages = [
    { price: 1000, points: 10, bonus: 0 },
    { price: 2000, points: 21, bonus: 1, popular: true },
    { price: 5000, points: 55, bonus: 5 },
    { price: 10000, points: 120, bonus: 20 },
  ];

  const handleGetStarted = () => {
    navigate("/auth");
  };

  const handleShowSample = () => {
    alert("Sample output would be displayed here");
    // In the future, you could navigate to a sample preview page:
    // navigate("/sample-cv-output");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold">FlowJobAi</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleGetStarted}>
              Login
            </Button>
            <Button onClick={handleGetStarted}>
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

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Your dream job might ignore your CV —{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              let's fix that today
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Smart CV revamp made for Nigerian job seekers. Upload your CV, paste
            the job description, and get a tailored CV in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="text-lg px-8 py-6"
            >
              Try Free CV Fix
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleShowSample}
              className="text-lg px-8 py-6"
            >
              See Sample Output
            </Button>
          </div>

          <div className="flex items-center justify-center gap-12 pt-8">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="flex items-center gap-2 text-purple-600 mb-2">
                  <stat.icon className="w-8 h-8" />
                  <span className="text-3xl font-bold">{stat.value}</span>
                </div>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How FlowJobAi Works
            </h2>
            <p className="text-xl text-gray-600">
              Get your optimized CV in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer border"
                  onClick={handleGetStarted}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm text-purple-600 font-medium mb-2">
                    Step {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of Nigerians who landed their dream jobs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role} at {testimonial.company}
                    </div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Affordable Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Pay as you go with our flexible points system
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {pricingPackages.map((pkg, index) => (
              <Card
                key={index}
                className={`p-6 text-center relative transition-shadow hover:shadow-xl ${
                  pkg.popular ? "border-2 border-purple-600" : ""
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="text-4xl font-bold mb-2">
                  ₦{pkg.price.toLocaleString()}
                </div>
                <div className="text-xl text-gray-700 mb-4">
                  {pkg.points} points
                  {pkg.bonus > 0 && (
                    <span className="block text-green-600 font-medium">
                      +{pkg.bonus} bonus points
                    </span>
                  )}
                </div>
                <Button
                  variant={pkg.popular ? "default" : "outline"}
                  className="w-full"
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-lg text-gray-700">
              ✨ <strong>Get 1 free point</strong> when you sign up today!
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto p-12 text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Job Search?
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Join thousands of successful job seekers and get your dream job
            faster
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={handleGetStarted}
            className="text-lg px-10 py-7 font-medium"
          >
            Start Your Free CV Fix Now
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">FlowJobAi</span>
            </div>
            <p className="text-gray-600">
              © 2025 FlowJobAi. Made with ❤️ for Nigerian job seekers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

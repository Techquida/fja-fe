// src/components/BuyPoints.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, Zap, Check, CreditCard, Sparkles } from "lucide-react";

import { auth, pointsService } from "../lib/mockBackend";
import { toast } from "sonner";
import type { PricingPackage } from "../types";

export function BuyPoints() {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage | null>(
    null
  );
  const [processing, setProcessing] = useState(false);

  const user = auth.getCurrentUser();

  const packages: PricingPackage[] = [
    { id: "1", price: 1000, points: 10, bonus: 0 },
    { id: "2", price: 2000, points: 21, bonus: 1, popular: true },
    { id: "3", price: 5000, points: 55, bonus: 5 },
    { id: "4", price: 10000, points: 120, bonus: 20 },
  ];

  const handlePurchase = async () => {
    if (!selectedPackage) {
      toast.error("Please select a package first");
      return;
    }

    setProcessing(true);

    try {
      // Simulate payment processing (in real app: Paystack/Flutterwave integration)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Add points via mock service
      pointsService.purchasePoints(
        user!.id,
        selectedPackage.price,
        selectedPackage.points
      );

      toast.success(
        `Success! ${selectedPackage.points} points added to your account! 🎉`,
        {
          duration: 5000,
        }
      );

      // Optional: force refresh user data
      const updatedUser = auth.getCurrentUser();
      if (updatedUser) {
        auth.updateUser(updatedUser.id, updatedUser);
      }

      // Return to dashboard after success
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error: any) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
      setSelectedPackage(null); // Reset selection
    }
  };

  const features = [
    "Use points for CV fixes, cover letters, and interview prep",
    "Points never expire",
    "Secure payment powered by Paystack",
    "Instant point delivery",
    "No subscription — pay only when you need",
  ];

  return (
    <div>
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Top Up Your Points
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose a package and unlock more CV fixes, cover letters, and
            interview prep
          </p>
          <p className="text-lg text-gray-500 mt-2">
            Bigger packages = more bonus points!
          </p>
        </div>

        {/* Pricing Packages */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {packages.map((pkg) => {
            const isSelected = selectedPackage?.id === pkg.id;
            const totalPoints = pkg.points;
            const valuePerPoint = Math.round(pkg.price / totalPoints);

            return (
              <Card
                key={pkg.id}
                className={`relative p-8 cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "border-purple-600 shadow-2xl ring-4 ring-purple-100 scale-105"
                    : "hover:shadow-xl hover:border-purple-300"
                } ${pkg.popular ? "border-purple-500" : ""}`}
                onClick={() => setSelectedPackage(pkg)}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 text-sm font-bold border-0">
                    MOST POPULAR
                  </Badge>
                )}

                <div className="text-center">
                  <div className="text-4xl font-bold mb-3">
                    ₦{pkg.price.toLocaleString()}
                  </div>

                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {totalPoints} points
                  </div>

                  {pkg.bonus > 0 && (
                    <Badge
                      variant="secondary"
                      className="mb-4 bg-green-100 text-green-700 text-lg py-1"
                    >
                      +{pkg.bonus} bonus points!
                    </Badge>
                  )}

                  <p className="text-sm text-gray-600 mb-6">
                    Only ₦{valuePerPoint} per point
                  </p>

                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="lg"
                    className="w-full"
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Selected
                      </>
                    ) : (
                      "Select"
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Checkout Summary */}
        {selectedPackage && (
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <h2 className="text-2xl font-bold text-center mb-8">
              Complete Your Purchase
            </h2>

            <div className="bg-white rounded-xl p-6 mb-8 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-600">Package</p>
                  <p className="text-2xl font-bold">
                    {selectedPackage.points} points
                    {selectedPackage.bonus > 0 && (
                      <span className="text-green-600 text-lg ml-3">
                        (+{selectedPackage.bonus} bonus)
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Total Amount</p>
                  <p className="text-3xl font-bold">
                    ₦{selectedPackage.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full text-lg py-8 font-semibold"
              onClick={handlePurchase}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Sparkles className="w-6 h-6 mr-3 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-6 h-6 mr-3" />
                  Pay with Paystack
                </>
              )}
            </Button>

            <p className="text-center text-sm text-gray-600 mt-6">
              🔒 Secure payment • Instant delivery • Powered by Paystack
            </p>
          </Card>
        )}

        {/* Benefits */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16">
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Why Buy Points?
            </h3>
            <ul className="space-y-4">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50">
            <h3 className="text-2xl font-bold mb-6 text-center">
              How Points Work
            </h3>
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl text-white font-bold">
                  1–5
                </div>
                <h4 className="font-semibold mb-1">CV Optimization</h4>
                <p className="text-sm text-gray-700">
                  Basic (1pt) • Smart (3pts) • Full Makeover (5pts)
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl text-white font-bold">
                  1
                </div>
                <h4 className="font-semibold mb-1">
                  Cover Letters & Interview Prep
                </h4>
                <p className="text-sm text-gray-700">
                  Generate unlimited professional content
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

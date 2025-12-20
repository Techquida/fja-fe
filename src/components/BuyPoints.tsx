import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Zap, Check, CreditCard, Sparkles } from 'lucide-react';
import { auth, pointsService } from '../lib/mockBackend';
import { toast } from 'sonner@2.0.3';
import type { PricingPackage } from '../types';

interface BuyPointsProps {
  onBack: () => void;
}

export function BuyPoints({ onBack }: BuyPointsProps) {
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage | null>(null);
  const [processing, setProcessing] = useState(false);

  const user = auth.getCurrentUser();

  const packages: PricingPackage[] = [
    { id: '1', price: 1000, points: 10, bonus: 0 },
    { id: '2', price: 2000, points: 21, bonus: 1, popular: true },
    { id: '3', price: 5000, points: 55, bonus: 5 },
    { id: '4', price: 10000, points: 120, bonus: 20 }
  ];

  const handlePurchase = async () => {
    if (!selectedPackage) {
      toast.error('Please select a package');
      return;
    }

    setProcessing(true);

    try {
      // In a real app, integrate with Paystack/Flutterwave here
      // For demo, simulate payment success
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add points to user account
      pointsService.purchasePoints(user!.id, selectedPackage.price, selectedPackage.points);

      toast.success(`Successfully added ${selectedPackage.points} points! 🎉`);
      
      // Reload user data
      const updatedUser = auth.getCurrentUser();
      if (updatedUser) {
        auth.updateUser(updatedUser.id, updatedUser);
      }

      setSelectedPackage(null);
    } catch (error: any) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const features = [
    'Use points for CV fixes, cover letters, and interview prep',
    'Points never expire',
    'Secure payment with Paystack',
    'Instant delivery',
    'No subscription required'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span>Buy Points</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>Current: {user?.points} points</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-4">Choose Your Package</h1>
          <p className="text-xl text-gray-600 mb-2">
            Pay as you go with our flexible points system
          </p>
          <p className="text-gray-500">
            Get bonus points with larger packages
          </p>
        </div>

        {/* Packages */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {packages.map((pkg) => {
            const isSelected = selectedPackage?.id === pkg.id;
            const totalPoints = pkg.points;
            const basePoints = pkg.points - pkg.bonus;

            return (
              <Card
                key={pkg.id}
                className={`p-6 cursor-pointer transition-all relative ${
                  isSelected
                    ? 'border-purple-600 shadow-lg ring-2 ring-purple-200'
                    : 'hover:border-purple-400'
                } ${pkg.popular ? 'border-purple-400' : ''}`}
                onClick={() => setSelectedPackage(pkg)}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600">
                    Most Popular
                  </Badge>
                )}

                <div className="text-center mb-6">
                  <div className="text-3xl mb-2">
                    ₦{pkg.price.toLocaleString()}
                  </div>
                  <div className="text-2xl text-purple-600 mb-1">
                    {totalPoints}
                  </div>
                  <div className="text-sm text-gray-600">
                    points
                  </div>
                  {pkg.bonus > 0 && (
                    <div className="mt-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        +{pkg.bonus} bonus
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="text-center text-sm text-gray-600 mb-4">
                  ₦{Math.round(pkg.price / totalPoints)} per point
                </div>

                <Button
                  variant={isSelected ? 'default' : 'outline'}
                  className="w-full"
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Selected
                    </>
                  ) : (
                    'Select Package'
                  )}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Purchase Button */}
        {selectedPackage && (
          <Card className="p-8 max-w-2xl mx-auto">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl mb-4">Complete Your Purchase</h2>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-gray-600">You're buying</p>
                    <p className="text-xl">
                      {selectedPackage.points} points
                      {selectedPackage.bonus > 0 && (
                        <span className="text-green-600 text-sm ml-2">
                          (+{selectedPackage.bonus} bonus)
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">Total</p>
                    <p className="text-2xl">₦{selectedPackage.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handlePurchase}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pay with Paystack
                  </>
                )}
              </Button>

              <p className="text-sm text-gray-500 text-center">
                Secure payment powered by Paystack. Your points will be added instantly.
              </p>
            </div>
          </Card>
        )}

        {/* Features */}
        <div className="max-w-2xl mx-auto mt-12">
          <Card className="p-8">
            <h3 className="text-xl mb-6 text-center">What You Get</h3>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Points Usage Guide */}
        <div className="max-w-4xl mx-auto mt-8">
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50">
            <h3 className="text-xl mb-6 text-center">How to Use Your Points</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white">1-5</span>
                </div>
                <h4 className="mb-2">CV Fixes</h4>
                <p className="text-sm text-gray-700">
                  Basic fix (1pt), Smart rebuild (3pts), Full makeover (5pts)
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white">1</span>
                </div>
                <h4 className="mb-2">Cover Letter</h4>
                <p className="text-sm text-gray-700">
                  Generate professional cover letters
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white">1</span>
                </div>
                <h4 className="mb-2">Interview Prep</h4>
                <p className="text-sm text-gray-700">
                  Get questions, answers, and tips
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

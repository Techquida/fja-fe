import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ArrowLeft, Share2, Copy, Check, Mail, MessageCircle, Award, Users, Gift } from 'lucide-react';
import { auth, referralService } from '../lib/mockBackend';
import { toast } from 'sonner@2.0.3';
import type { Referral } from '../types';

interface ReferralPageProps {
  onBack: () => void;
}

export function ReferralPage({ onBack }: ReferralPageProps) {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [copied, setCopied] = useState(false);
  const [totalEarned, setTotalEarned] = useState(0);

  const user = auth.getCurrentUser();

  useEffect(() => {
    if (user) {
      setReferrals(referralService.getReferrals(user.id));
      setTotalEarned(referralService.getTotalEarned(user.id));
    }
  }, [user]);

  const referralLink = `https://resumegenie.ng/signup?ref=${user?.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = 'Get Your Dream Job with ResumeGenie';
    const body = `Hey! I've been using ResumeGenie to optimize my CV and it's amazing. You should try it too!\n\nSign up with my referral link and get 1 free point:\n${referralLink}\n\nI'll also get 2 bonus points when you join. Win-win!`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const shareViaWhatsApp = () => {
    const text = `Hey! I've been using ResumeGenie to optimize my CV and it's amazing. Sign up with my link and get 1 free point: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const stats = [
    { icon: Users, label: 'Total Referrals', value: referrals.length, color: 'text-purple-600' },
    { icon: Gift, label: 'Points Earned', value: totalEarned, color: 'text-green-600' },
    { icon: Award, label: 'Pending', value: referrals.filter(r => r.status === 'pending').length, color: 'text-orange-600' }
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
              <Share2 className="w-5 h-5 text-orange-600" />
              <span>Refer & Earn</span>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl mb-4">Invite Friends, Earn Points</h1>
          <p className="text-xl text-gray-600">
            Get 2 points for every friend who joins ResumeGenie
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6 text-center">
                <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                <div className="text-3xl mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </Card>
            );
          })}
        </div>

        {/* Referral Link */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl mb-4">Your Referral Link</h2>
          <div className="flex gap-3 mb-6">
            <Input
              value={referralLink}
              readOnly
              className="text-sm font-mono"
            />
            <Button onClick={handleCopy} className="flex-shrink-0">
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-4">Share via:</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={shareViaEmail} className="flex-1">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button variant="outline" onClick={shareViaWhatsApp} className="flex-1">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>
        </Card>

        {/* Referral Code */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="text-center">
            <p className="text-gray-700 mb-2">Your Referral Code</p>
            <div className="text-4xl tracking-wider mb-4">{user?.referralCode}</div>
            <p className="text-sm text-gray-600">
              Friends can enter this code when signing up
            </p>
          </div>
        </Card>

        {/* How It Works */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">1</span>
              </div>
              <h3 className="mb-2">Share Your Link</h3>
              <p className="text-sm text-gray-600">
                Send your unique referral link to friends via email, WhatsApp, or social media
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">2</span>
              </div>
              <h3 className="mb-2">They Sign Up</h3>
              <p className="text-sm text-gray-600">
                Your friends create an account using your referral link or code
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">3</span>
              </div>
              <h3 className="mb-2">Earn Points</h3>
              <p className="text-sm text-gray-600">
                You get 2 points instantly when they complete their signup
              </p>
            </div>
          </div>
        </Card>

        {/* Referral History */}
        <Card className="p-8">
          <h2 className="text-2xl mb-6">Referral History</h2>
          {referrals.length > 0 ? (
            <div className="space-y-3">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="mb-1">{referral.referredEmail}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(referral.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={referral.status === 'completed' ? 'default' : 'secondary'}
                    >
                      {referral.status === 'completed' ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          +{referral.pointsEarned} points
                        </>
                      ) : (
                        'Pending'
                      )}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No referrals yet</p>
              <p className="text-sm text-gray-500">
                Share your referral link to start earning points!
              </p>
            </div>
          )}
        </Card>

        {/* Bonus Tips */}
        <Card className="p-8 mt-8 bg-gradient-to-br from-orange-50 to-pink-50">
          <h3 className="text-xl mb-4">💡 Referral Tips</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-orange-600">•</span>
              <span>Share your success story when referring friends</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600">•</span>
              <span>Post your referral link on social media</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600">•</span>
              <span>Join Nigerian job seeker groups and share the link</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600">•</span>
              <span>Create a WhatsApp status with your referral code</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600">•</span>
              <span>The more you share, the more points you earn!</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

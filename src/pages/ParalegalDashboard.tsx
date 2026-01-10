import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { useUser } from '@clerk/clerk-react';
import { api } from '../../convex/_generated/api';
import Layout from '../components/layout/Layout';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BadgeCheck, Eye, MapPin, TrendingUp, Smartphone, Download,
  CheckCircle, ArrowRight, ExternalLink, User, Edit, Star
} from 'lucide-react';
import ParalegalProfileEdit from '@/components/paralegal/ParalegalProfileEdit';

const ParalegalDashboard = () => {
  const { user } = useUser();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Get paralegal dashboard data
  const dashboardData = useQuery(
    api.paralegals.getDashboardData,
    user?.emailAddresses?.[0]?.emailAddress
      ? { email: user.emailAddresses[0].emailAddress }
      : "skip"
  );

  const updateProfile = useMutation(api.paralegals.updateParalegalProfile);

  // Check if onboarding needed
  useEffect(() => {
    if (dashboardData?.paralegal && !dashboardData.paralegal.onboardingCompleted) {
      setShowOnboarding(true);
    }
  }, [dashboardData]);

  const handleCompleteOnboarding = async () => {
    if (dashboardData?.paralegal) {
      await updateProfile({
        id: dashboardData.paralegal._id,
        onboardingCompleted: true,
      });
      setShowOnboarding(false);
    }
  };

  const handleJoinHakiYangu = async () => {
    if (dashboardData?.paralegal) {
      await updateProfile({
        id: dashboardData.paralegal._id,
        hasJoinedHakiYangu: true,
      });
    }
    // Open app store links
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    if (isIOS) {
      window.open('https://apps.apple.com/app/haki-yangu', '_blank');
    } else if (isAndroid) {
      window.open('https://play.google.com/store/apps/details?id=org.lsftz.hakiyangu', '_blank');
    } else {
      // Desktop - show both options
      window.open('/haki-yangu', '_blank');
    }
  };

  // Show loading only when query is actually loading (undefined)
  if (dashboardData === undefined) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-600">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // No approved paralegal found (null or no paralegal record)
  if (dashboardData === null || !dashboardData.paralegal) {
    return (
      <Layout>
        <Container className="py-16">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="h-10 w-10 text-orange-600" />
            </div>
            <Typography variant="h2" className="text-2xl mb-4">Application Under Review</Typography>
            <Typography variant="body" className="text-neutral-600 mb-6">
              Your paralegal application is being reviewed by our team. You'll receive an email
              once it's approved and you can access your dashboard. This typically takes 5-7 business days.
            </Typography>
            <Button onClick={() => window.location.href = '/'}>
              Return Home
            </Button>
          </div>
        </Container>
      </Layout>
    );
  }

  const { paralegal, stats } = dashboardData;

  // Onboarding Modal
  if (showOnboarding) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary-teal/5 py-16">
          <Container>
            <div className="max-w-2xl mx-auto">
              <Card className="shadow-2xl">
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>

                  <Typography variant="h2" className="text-3xl mb-4">
                    Welcome, {paralegal.fullName}! 🎉
                  </Typography>

                  <Typography variant="body" className="text-neutral-600 mb-8 text-lg">
                    Congratulations on becoming an LSF Community Paralegal!
                    You're now part of a network of {stats.totalParalegals} paralegals
                    helping communities across Tanzania access justice.
                  </Typography>

                  <div className="bg-secondary-orange/10 border border-secondary-orange/20 rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Smartphone className="h-8 w-8 text-secondary-orange" />
                      <Typography variant="h3" className="text-xl">
                        Join Haki Yangu App
                      </Typography>
                    </div>
                    <Typography variant="body" className="text-neutral-600 mb-4">
                      Download the Haki Yangu app to receive case notifications,
                      access legal resources, and connect with the LSF network.
                    </Typography>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={handleJoinHakiYangu}
                        className="gap-2 bg-black hover:bg-black/90"
                      >
                        <Download className="h-4 w-4" />
                        Download on App Store
                      </Button>
                      <Button
                        onClick={handleJoinHakiYangu}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Get it on Google Play
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4 text-left mb-8">
                    <Typography variant="h4" className="text-center mb-4">What's Next?</Typography>
                    {[
                      'Complete your profile with a photo and bio',
                      'Download the Haki Yangu mobile app',
                      'Review our paralegal training materials',
                      'Connect with other paralegals in your region'
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{i + 1}</span>
                        </div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <Button size="lg" onClick={handleCompleteOnboarding} className="w-full">
                    Go to My Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </Container>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <Container>
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {paralegal.fullName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Typography variant="h2" className="text-2xl">{paralegal.fullName}</Typography>
                  {stats.isVerified && (
                    <Badge className="bg-green-100 text-green-700 gap-1">
                      <BadgeCheck className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <Typography variant="body" className="text-neutral-600">
                  Community Paralegal • {paralegal.region}
                </Typography>
              </div>
            </div>
            <ParalegalProfileEdit paralegal={paralegal} />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">Profile Views</p>
                    <p className="text-3xl font-bold text-neutral-900">{stats.profileViews}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">Your Rank</p>
                    <p className="text-3xl font-bold text-secondary-orange">#{stats.rank}</p>
                    <p className="text-xs text-neutral-500">of {stats.totalParalegals}</p>
                  </div>
                  <div className="w-12 h-12 bg-secondary-orange/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-secondary-orange" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">Region</p>
                    <p className="text-lg font-bold text-neutral-900">{paralegal.region}</p>
                    <p className="text-xs text-neutral-500">{paralegal.district}</p>
                  </div>
                  <div className="w-12 h-12 bg-secondary-teal/10 rounded-xl flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-secondary-teal" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">Status</p>
                    <p className="text-lg font-bold text-green-600">Active</p>
                    <p className="text-xs text-neutral-500">
                      {stats.isVerified ? 'Verified ✓' : 'Pending verification'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Haki Yangu Prompt (if not joined) */}
          {!paralegal.hasJoinedHakiYangu && (
            <Card className="mb-8 bg-gradient-to-r from-secondary-orange/10 to-secondary-yellow/10 border-secondary-orange/20">
              <CardContent className="py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-secondary-orange rounded-2xl flex items-center justify-center">
                      <Smartphone className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <Typography variant="h4" className="text-lg">Join Haki Yangu App</Typography>
                      <Typography variant="body" className="text-neutral-600">
                        Get case notifications and access legal resources on your phone
                      </Typography>
                    </div>
                  </div>
                  <Button onClick={handleJoinHakiYangu} className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Now
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <User className="h-7 w-7 text-primary" />
                  </div>
                  <Typography variant="h4" className="mb-2">View Public Profile</Typography>
                  <Typography variant="body" className="text-neutral-600 text-sm">
                    See how your profile appears to the public
                  </Typography>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-14 h-14 bg-secondary-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="h-7 w-7 text-secondary-teal" />
                  </div>
                  <Typography variant="h4" className="mb-2">Haki Yangu Resources</Typography>
                  <Typography variant="body" className="text-neutral-600 text-sm">
                    Access legal forms, guides, and training materials
                  </Typography>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-14 h-14 bg-secondary-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-7 w-7 text-secondary-orange" />
                  </div>
                  <Typography variant="h4" className="mb-2">Training Portal</Typography>
                  <Typography variant="body" className="text-neutral-600 text-sm">
                    Continue your paralegal education
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
    </Layout>
  );
};

export default ParalegalDashboard;
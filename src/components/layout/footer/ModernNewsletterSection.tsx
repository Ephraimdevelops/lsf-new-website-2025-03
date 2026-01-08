import { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Typography from '@/components/shared/Typography';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

const ModernNewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribeNewsletter = useMutation(api.newsletter.subscribe);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await subscribeNewsletter({ email, source: 'footer' });
      if (result.success) {
        setIsSubscribed(true);
        setEmail('');
      } else {
        setError(result.message || 'Subscription failed');
      }
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
      console.error('Newsletter subscription error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-16 border-b border-white/10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 bg-primary/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-primary/30">
              <Mail className="h-5 w-5 text-primary" />
              <Typography variant="overline" className="text-primary font-bold text-sm tracking-wider">
                Stay Connected
              </Typography>
            </div>

            <Typography variant="h2" className="text-white mb-4 text-3xl md:text-4xl font-bold">
              Stay Updated with Our Latest Impact
            </Typography>

            <Typography variant="body" className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
              Get the latest news about our programs, success stories, and opportunities to make a difference in your community.
            </Typography>
          </div>

          {/* Newsletter Form */}
          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-primary to-secondary-orange hover:opacity-90 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Subscribing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Subscribe</span>
                      <Send className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </div>

              <Typography variant="bodySmall" className="text-white/60 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </Typography>
            </form>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-500/30">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                  <Typography variant="h3" className="text-white font-bold">
                    Successfully Subscribed!
                  </Typography>
                </div>
                <Typography variant="body" className="text-white/80">
                  Thank you for joining our community. You'll receive updates about our impact and opportunities to get involved.
                </Typography>
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <Typography variant="h4" className="text-white mb-2 font-semibold">
                Weekly Updates
              </Typography>
              <Typography variant="bodySmall" className="text-white/70">
                Get the latest news and impact stories
              </Typography>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-secondary-teal/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Send className="h-6 w-6 text-secondary-teal" />
              </div>
              <Typography variant="h4" className="text-white mb-2 font-semibold">
                Action Alerts
              </Typography>
              <Typography variant="bodySmall" className="text-white/70">
                Be the first to know about new opportunities
              </Typography>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-secondary-orange/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-secondary-orange" />
              </div>
              <Typography variant="h4" className="text-white mb-2 font-semibold">
                Impact Reports
              </Typography>
              <Typography variant="bodySmall" className="text-white/70">
                See how your support makes a difference
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernNewsletterSection;

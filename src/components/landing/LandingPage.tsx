
import React from 'react';
import { Button } from '@/components/ui/button';
import HeroSection from './HeroSection';
import StatsSection from './StatsSection';
import FeaturesSection from './FeaturesSection';
import { LogIn } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            InnovateX
          </div>
          <Button onClick={onGetStarted} variant="outline" className="flex items-center gap-2 hover:bg-blue-50">
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection onGetStarted={onGetStarted} />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Journey?
          </h2>
          <p className="text-blue-100 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
            Join thousands of successful entrepreneurs and investors who have already discovered 
            their perfect matches through our platform. Your next big opportunity is just one click away.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-6 text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
          >
            Start Your Journey Today
          </Button>
          <div className="mt-6 text-blue-100 text-sm">
            ✓ Free to join  ✓ No hidden fees  ✓ Cancel anytime
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                InnovateX
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Connecting innovative startups with visionary investors and experienced mentors worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Platform</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">For Startups</li>
                <li className="hover:text-white transition-colors cursor-pointer">For Investors</li>
                <li className="hover:text-white transition-colors cursor-pointer">For Mentors</li>
                <li className="hover:text-white transition-colors cursor-pointer">Success Stories</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Resources</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Investment Guide</li>
                <li className="hover:text-white transition-colors cursor-pointer">Pitch Deck Templates</li>
                <li className="hover:text-white transition-colors cursor-pointer">Events</li>
                <li className="hover:text-white transition-colors cursor-pointer">Help Center</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">About Us</li>
                <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
                <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 InnovateX. All rights reserved. Built with ❤️ for entrepreneurs worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

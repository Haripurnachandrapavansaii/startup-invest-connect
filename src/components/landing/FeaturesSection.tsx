
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  MessageSquare, 
  Shield, 
  BarChart3, 
  Calendar, 
  BookOpen,
  Zap,
  Globe,
  Award
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Search,
      title: "Smart Matching",
      description: "Advanced algorithms match startups with investors based on industry, stage, and investment criteria.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: MessageSquare,
      title: "Direct Communication",
      description: "Secure messaging system enables direct conversations between entrepreneurs and potential investors.",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Shield,
      title: "Verified Profiles",
      description: "All users undergo verification to ensure authentic connections and protect sensitive information.",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track profile views, investor interest, and engagement metrics to optimize your strategy.",
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: Calendar,
      title: "Event Platform",
      description: "Attend virtual and in-person networking events, pitch competitions, and investor meetups.",
      color: "bg-pink-100 text-pink-600"
    },
    {
      icon: BookOpen,
      title: "Resource Library",
      description: "Access comprehensive guides, templates, and educational content for fundraising success.",
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      icon: Zap,
      title: "Quick Setup",
      description: "Get started in minutes with our streamlined onboarding process and profile creation.",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Connect with investors and startups from around the world, expanding your reach exponentially.",
      color: "bg-teal-100 text-teal-600"
    },
    {
      icon: Award,
      title: "Success Stories",
      description: "Learn from successful fundraising cases and get inspired by real success stories.",
      color: "bg-red-100 text-red-600"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and resources needed to connect, 
            communicate, and close successful investment deals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
              <CardHeader>
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.color} mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

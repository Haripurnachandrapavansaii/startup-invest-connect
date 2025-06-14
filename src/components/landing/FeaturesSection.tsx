
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, MessageSquare, Calendar, BookOpen, Shield, Zap } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Upload,
      title: "Pitch Deck Sharing",
      description: "Upload and share your pitch decks securely with potential investors.",
      color: "text-blue-600 bg-blue-100"
    },
    {
      icon: MessageSquare,
      title: "Direct Messaging",
      description: "Connect directly with investors and startups through our built-in messaging system.",
      color: "text-purple-600 bg-purple-100"
    },
    {
      icon: Calendar,
      title: "Event Platform",
      description: "Attend virtual and in-person networking events, pitch competitions, and workshops.",
      color: "text-green-600 bg-green-100"
    },
    {
      icon: BookOpen,
      title: "Resource Library",
      description: "Access curated guides, templates, and insights to help you succeed.",
      color: "text-orange-600 bg-orange-100"
    },
    {
      icon: Shield,
      title: "Verified Profiles",
      description: "All users are verified to ensure authentic and secure connections.",
      color: "text-red-600 bg-red-100"
    },
    {
      icon: Zap,
      title: "Smart Recommendations",
      description: "Get AI-powered recommendations for the best matches and opportunities.",
      color: "text-yellow-600 bg-yellow-100"
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our comprehensive platform provides all the tools and resources you need to connect, collaborate, and grow.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;

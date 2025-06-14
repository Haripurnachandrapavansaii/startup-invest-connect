
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Handshake, Globe } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: "2,500+",
      label: "Registered Users",
      description: "Entrepreneurs, investors, and mentors from around the world",
      color: "text-blue-600"
    },
    {
      icon: TrendingUp,
      value: "$120M+",
      label: "Total Funding",
      description: "Successfully connected through our platform",
      color: "text-green-600"
    },
    {
      icon: Handshake,
      value: "450+",
      label: "Successful Matches",
      description: "Startups paired with their ideal investors",
      color: "text-purple-600"
    },
    {
      icon: Globe,
      value: "50+",
      label: "Countries",
      description: "Global network spanning six continents",
      color: "text-orange-600"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Innovators Worldwide
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform has become the go-to destination for startups seeking investment 
            and investors looking for the next big opportunity.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50 mb-4`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-700 mb-2">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

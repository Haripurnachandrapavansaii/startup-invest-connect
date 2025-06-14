
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const StatsSection = () => {
  const stats = [
    { number: "10K+", label: "Active Startups", color: "text-blue-600" },
    { number: "5K+", label: "Verified Investors", color: "text-purple-600" },
    { number: "$2.5B+", label: "Funding Raised", color: "text-green-600" },
    { number: "98%", label: "Success Rate", color: "text-orange-600" }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by thousands of entrepreneurs and investors
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform has facilitated connections that have resulted in successful funding rounds and partnerships.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;

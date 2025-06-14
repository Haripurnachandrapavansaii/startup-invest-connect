
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Handshake, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const StatsSection = () => {
  const [realStats, setRealStats] = useState({
    users: 0,
    startups: 0,
    investors: 0,
    mentors: 0,
    events: 0,
    resources: 0
  });

  useEffect(() => {
    fetchRealStats();
  }, []);

  const fetchRealStats = async () => {
    try {
      // Fetch user counts by role
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('role');

      if (profilesError) throw profilesError;

      // Count users by role
      const roleCounts = profilesData?.reduce((acc: any, profile) => {
        acc[profile.role] = (acc[profile.role] || 0) + 1;
        return acc;
      }, {}) || {};

      // Fetch events count
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('id');

      if (eventsError) throw eventsError;

      // Fetch resources count
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select('id');

      if (resourcesError) throw resourcesError;

      setRealStats({
        users: profilesData?.length || 0,
        startups: roleCounts.startup || 0,
        investors: roleCounts.investor || 0,
        mentors: roleCounts.mentor || 0,
        events: eventsData?.length || 0,
        resources: resourcesData?.length || 0
      });

    } catch (error) {
      console.error('Error fetching real stats:', error);
    }
  };

  const stats = [
    {
      icon: Users,
      value: realStats.users > 0 ? `${realStats.users}+` : "Growing",
      label: "Registered Users",
      description: "Entrepreneurs, investors, and mentors from around the world",
      color: "text-blue-600"
    },
    {
      icon: TrendingUp,
      value: realStats.startups > 0 ? `${realStats.startups}+` : "Active",
      label: "Startups",
      description: "Innovative companies seeking funding and mentorship",
      color: "text-green-600"
    },
    {
      icon: Handshake,
      value: realStats.investors > 0 ? `${realStats.investors}+` : "Ready",
      label: "Investors",
      description: "Experienced investors looking for promising opportunities",
      color: "text-purple-600"
    },
    {
      icon: Globe,
      value: realStats.mentors > 0 ? `${realStats.mentors}+` : "Expert",
      label: "Mentors",
      description: "Seasoned professionals ready to guide entrepreneurs",
      color: "text-orange-600"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Join Our Growing Community
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Be part of a thriving ecosystem where innovation meets investment and mentorship drives success.
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

        {realStats.users === 0 && (
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              Be among the first to join our platform and help build this community!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default StatsSection;

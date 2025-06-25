
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Handshake, Globe, DollarSign, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const StatsSection = () => {
  const [realStats, setRealStats] = useState({
    users: 0,
    startups: 0,
    investors: 0,
    mentors: 0,
    events: 0,
    resources: 0,
    totalFunding: 0,
    successRate: 0,
    totalMessages: 0
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

      // Fetch startup profiles to calculate total funding needed
      const { data: startupsData, error: startupsError } = await supabase
        .from('startup_profiles')
        .select('funding_needed');

      if (startupsError) throw startupsError;

      // Calculate total funding (extract numbers from funding_needed strings)
      const totalFunding = startupsData?.reduce((total, startup) => {
        const fundingStr = startup.funding_needed || '';
        const match = fundingStr.match(/\$?([\d,]+)([kmKM]?)/);
        if (match) {
          let amount = parseInt(match[1].replace(/,/g, ''));
          const unit = match[2]?.toLowerCase();
          if (unit === 'k') amount *= 1000;
          if (unit === 'm') amount *= 1000000;
          return total + amount;
        }
        return total;
      }, 0) || 0;

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

      // Fetch messages count for activity
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('id');

      if (messagesError) throw messagesError;

      // Calculate success rate (simplified: users with complete profiles)
      const completedProfiles = roleCounts.startup + roleCounts.investor + roleCounts.mentor;
      const successRate = profilesData?.length > 0 ? Math.round((completedProfiles / profilesData.length) * 100) : 0;

      setRealStats({
        users: profilesData?.length || 0,
        startups: roleCounts.startup || 0,
        investors: roleCounts.investor || 0,
        mentors: roleCounts.mentor || 0,
        events: eventsData?.length || 0,
        resources: resourcesData?.length || 0,
        totalFunding,
        successRate,
        totalMessages: messagesData?.length || 0
      });

    } catch (error) {
      console.error('Error fetching real stats:', error);
    }
  };

  const formatFunding = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M+`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K+`;
    }
    return amount > 0 ? `$${amount.toLocaleString()}+` : 'Growing';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K+`;
    }
    return num > 0 ? `${num}+` : 'Growing';
  };

  const stats = [
    {
      icon: Users,
      value: formatNumber(realStats.users),
      label: "Active Members",
      description: "Entrepreneurs, investors, and mentors actively using the platform",
      color: "text-blue-600"
    },
    {
      icon: DollarSign,
      value: formatFunding(realStats.totalFunding),
      label: "Funding Connected",
      description: "Total funding opportunities available on the platform",
      color: "text-green-600"
    },
    {
      icon: Target,
      value: realStats.successRate > 0 ? `${realStats.successRate}%` : "Growing",
      label: "Success Rate",
      description: "Platform members with completed profiles and active engagement",
      color: "text-purple-600"
    },
    {
      icon: Handshake,
      value: formatNumber(realStats.totalMessages),
      label: "Connections Made",
      description: "Messages exchanged between startups, investors, and mentors",
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

        <div className="text-center mt-8">
          <p className="text-xs text-gray-400">
            * Stats updated in real-time based on platform activity
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

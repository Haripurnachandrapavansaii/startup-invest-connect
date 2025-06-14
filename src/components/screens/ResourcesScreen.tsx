
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, ExternalLink, Star } from 'lucide-react';
import { useResources } from '@/hooks/useResources';

interface ResourcesScreenProps {
  onBack: () => void;
}

const ResourcesScreen = ({ onBack }: ResourcesScreenProps) => {
  const { resources, loading } = useResources();

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'article':
        return 'bg-blue-100 text-blue-800';
      case 'video':
        return 'bg-red-100 text-red-800';
      case 'podcast':
        return 'bg-purple-100 text-purple-800';
      case 'tool':
        return 'bg-green-100 text-green-800';
      case 'guide':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-lg">Loading resources...</div>
      </div>
    );
  }

  const featuredResources = resources.filter(resource => resource.is_featured);
  const regularResources = resources.filter(resource => !resource.is_featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Business Resources</h1>
        </div>

        {resources.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Resources Yet</h3>
              <p className="text-gray-600">Check back later for helpful business resources.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {featuredResources.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500" />
                  Featured Resources
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {featuredResources.map((resource) => (
                    <Card key={resource.id} className="hover:shadow-lg transition-shadow border-yellow-200">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <Badge className={getResourceTypeColor(resource.resource_type)}>
                            {resource.resource_type}
                          </Badge>
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        </div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {resource.tags && resource.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {resource.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="text-sm text-gray-600">
                          {resource.author && `By ${resource.author.full_name} • `}
                          {formatDate(resource.created_at)}
                        </div>

                        {resource.content_url && (
                          <Button 
                            onClick={() => window.open(resource.content_url!, '_blank')}
                            className="w-full flex items-center gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            View Resource
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {regularResources.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">All Resources</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {regularResources.map((resource) => (
                    <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <Badge className={getResourceTypeColor(resource.resource_type)} style={{ width: 'fit-content' }}>
                          {resource.resource_type}
                        </Badge>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {resource.tags && resource.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {resource.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="text-sm text-gray-600">
                          {resource.author && `By ${resource.author.full_name} • `}
                          {formatDate(resource.created_at)}
                        </div>

                        {resource.content_url && (
                          <Button 
                            onClick={() => window.open(resource.content_url!, '_blank')}
                            variant="outline"
                            className="w-full flex items-center gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            View Resource
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesScreen;

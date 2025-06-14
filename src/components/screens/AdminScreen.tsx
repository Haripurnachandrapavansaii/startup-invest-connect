
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Users, Building, TrendingUp, Calendar, BookOpen, Plus } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';

interface AdminScreenProps {
  onBack: () => void;
  currentUserId: string;
}

const AdminScreen = ({ onBack, currentUserId }: AdminScreenProps) => {
  const { isAdmin, stats, loading, createEvent, createResource } = useAdmin(currentUserId);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'resources'>('overview');
  
  // Event form state
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    event_type: 'networking',
    max_attendees: ''
  });

  // Resource form state
  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    resource_type: 'article',
    content_url: '',
    tags: ''
  });

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createEvent({
      ...eventForm,
      max_attendees: eventForm.max_attendees ? parseInt(eventForm.max_attendees) : undefined
    });
    
    if (success) {
      setEventForm({
        title: '',
        description: '',
        event_date: '',
        location: '',
        event_type: 'networking',
        max_attendees: ''
      });
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createResource({
      ...resourceForm,
      tags: resourceForm.tags ? resourceForm.tags.split(',').map(tag => tag.trim()) : undefined
    });
    
    if (success) {
      setResourceForm({
        title: '',
        description: '',
        resource_type: 'article',
        content_url: '',
        tags: ''
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-600 mb-4">You don't have admin privileges.</p>
            <Button onClick={onBack}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-lg">Loading admin panel...</div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        </div>

        <div className="flex gap-4 mb-8">
          <Button 
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Button>
          <Button 
            variant={activeTab === 'events' ? 'default' : 'outline'}
            onClick={() => setActiveTab('events')}
          >
            Create Event
          </Button>
          <Button 
            variant={activeTab === 'resources' ? 'default' : 'outline'}
            onClick={() => setActiveTab('resources')}
          >
            Create Resource
          </Button>
        </div>

        {activeTab === 'overview' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Startups</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStartups}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Investors</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalInvestors}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEvents}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resources</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalResources}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'events' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Event
              </CardTitle>
              <CardDescription>
                Add a new event for the startup community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <Label htmlFor="event-title">Event Title</Label>
                  <Input
                    id="event-title"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="event-description">Description</Label>
                  <Textarea
                    id="event-description"
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    placeholder="Enter event description"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="event-date">Event Date & Time</Label>
                    <Input
                      id="event-date"
                      type="datetime-local"
                      value={eventForm.event_date}
                      onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="event-type">Event Type</Label>
                    <Select value={eventForm.event_type} onValueChange={(value) => setEventForm({ ...eventForm, event_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="networking">Networking</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="meetup">Meetup</SelectItem>
                        <SelectItem value="pitch">Pitch Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="event-location">Location</Label>
                    <Input
                      id="event-location"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      placeholder="Enter event location"
                    />
                  </div>

                  <div>
                    <Label htmlFor="max-attendees">Max Attendees (Optional)</Label>
                    <Input
                      id="max-attendees"
                      type="number"
                      value={eventForm.max_attendees}
                      onChange={(e) => setEventForm({ ...eventForm, max_attendees: e.target.value })}
                      placeholder="Enter max attendees"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Create Event
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === 'resources' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Resource
              </CardTitle>
              <CardDescription>
                Add a helpful resource for the startup community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateResource} className="space-y-4">
                <div>
                  <Label htmlFor="resource-title">Resource Title</Label>
                  <Input
                    id="resource-title"
                    value={resourceForm.title}
                    onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                    placeholder="Enter resource title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="resource-description">Description</Label>
                  <Textarea
                    id="resource-description"
                    value={resourceForm.description}
                    onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                    placeholder="Enter resource description"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="resource-type">Resource Type</Label>
                    <Select value={resourceForm.resource_type} onValueChange={(value) => setResourceForm({ ...resourceForm, resource_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="podcast">Podcast</SelectItem>
                        <SelectItem value="tool">Tool</SelectItem>
                        <SelectItem value="guide">Guide</SelectItem>
                        <SelectItem value="template">Template</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="content-url">Content URL</Label>
                    <Input
                      id="content-url"
                      type="url"
                      value={resourceForm.content_url}
                      onChange={(e) => setResourceForm({ ...resourceForm, content_url: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="resource-tags">Tags (comma separated)</Label>
                  <Input
                    id="resource-tags"
                    value={resourceForm.tags}
                    onChange={(e) => setResourceForm({ ...resourceForm, tags: e.target.value })}
                    placeholder="startup, funding, marketing"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Create Resource
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminScreen;

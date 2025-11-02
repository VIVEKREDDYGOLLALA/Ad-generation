import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Video, 
  Clock, 
  Calendar,
  Download,
  Eye,
  Plus
} from 'lucide-react';

interface Ad {
  id: string;
  product_name: string;
  product_description: string;
  duration: number;
  status: 'processing' | 'completed' | 'failed';
  final_video_url?: string;
  final_video_duration?: number;
  total_cost_estimate: number;
  created_at: string;
}

const Dashboard = () => {
  const { session } = useAuth();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    if (session?.access_token) {
      fetchAds();
    }
  }, [session]);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/my-ads`, {
        headers: {
          "Authorization": `Bearer ${session?.access_token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch ads: ${res.status}`);
      }

      const data = await res.json();
      setAds(data.ads || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadVideo = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your ads...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchAds} variant="outline">Try Again</Button>
        </div>
      </div>
    );
  }

  if (ads.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">Dashboard</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">No Ads Generated Yet</h2>
            <p className="text-blue-600 mb-4">
              Start creating your first ad to see it appear here!
            </p>
            <Button asChild>
              <a href="/start-creating">Create Your First Ad</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          View and manage all your generated video ads
        </p>
      </div>

      <div className="grid gap-6">
        {ads.map((ad) => (
          <Card key={ad.id} className="border-blue-100 shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-xl text-blue-600">
                      {ad.product_name}
                    </CardTitle>
                    <Badge className={getStatusColor(ad.status)}>
                      {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {ad.product_description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      {ad.duration}s
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      {formatDate(ad.created_at)}
                    </div>
                    {ad.total_cost_estimate > 0 && (
                      <div className="text-green-600 font-medium">
                        ${ad.total_cost_estimate.toFixed(4)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <a href="/start-creating">
                      <Plus size={16} className="mr-2" />
                      Create New
                    </a>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {ad.final_video_url ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <Video size={20} />
                    Final Video Ad
                  </h3>
                  <div className="flex items-center gap-4">
                    <video 
                      controls 
                      className="w-80 h-48 rounded-lg border border-green-200"
                    >
                      <source src={ad.final_video_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div className="flex-1">
                      <p className="text-sm text-green-700 mb-2">
                        Complete {ad.final_video_duration}s video ad for {ad.product_name}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadVideo(ad.final_video_url!, `${ad.product_name}_ad.mp4`)}
                        >
                          <Download size={16} className="mr-2" />
                          Download Video
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(ad.final_video_url!, '_blank')}
                        >
                          <Eye size={16} className="mr-2" />
                          View Full Screen
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                    <Clock size={20} />
                    Video Processing
                  </h3>
                  <p className="text-amber-700 text-sm">
                    Your video ad is being generated. This may take a few minutes. 
                    Check back soon to view and download your final video.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

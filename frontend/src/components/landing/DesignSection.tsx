import { Button } from '@/components/ui/button';
import { AnimatedTransition } from '@/components/AnimatedTransition';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Play, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface VideoAd {
  id: string;
  title: string;
  brand: string;
  category: string;
  aspectRatio: string;
  thumbnail: string;
  duration: string;
  views: string;
  gridSpan: {
    col: number;
    row: number;
  };
}

interface DesignSectionProps {
  show: boolean;
}

export const DesignSection = ({
  show
}: DesignSectionProps) => {
  const [videoAds, setVideoAds] = useState<VideoAd[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    // Generate sample video ads created by the app
    const ads: VideoAd[] = [
      {
        id: '1',
        title: 'Glow Serum Transformation',
        brand: 'Luminescence Beauty',
        category: 'Beauty',
        aspectRatio: 'aspect-[9/16]',
        thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=600&fit=crop',
        duration: '0:30',
        views: '45.2k',
        gridSpan: { col: 1, row: 2 }
      },
      {
        id: '2',
        title: 'Summer Collection Launch',
        brand: 'Elegance Fashion',
        category: 'Fashion',
        aspectRatio: 'aspect-[16/9]',
        thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=450&fit=crop',
        duration: '0:45',
        views: '32.8k',
        gridSpan: { col: 2, row: 1 }
      },
      {
        id: '3',
        title: 'Daily Skincare Routine',
        brand: 'Pure Radiance',
        category: 'Beauty',
        aspectRatio: 'aspect-square',
        thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop',
        duration: '1:00',
        views: '67.3k',
        gridSpan: { col: 1, row: 1 }
      },
      {
        id: '4',
        title: 'New Product Reveal',
        brand: 'StyleHub',
        category: 'E-commerce',
        aspectRatio: 'aspect-[4/5]',
        thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=625&fit=crop',
        duration: '0:20',
        views: '28.5k',
        gridSpan: { col: 1, row: 2 }
      },
      {
        id: '5',
        title: 'Style Guide 2024',
        brand: 'Trendsetter',
        category: 'Fashion',
        aspectRatio: 'aspect-[3/4]',
        thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop',
        duration: '0:40',
        views: '41.1k',
        gridSpan: { col: 1, row: 2 }
      },
      {
        id: '6',
        title: 'Makeup Masterclass',
        brand: 'Glamour Cosmetics',
        category: 'Beauty',
        aspectRatio: 'aspect-[9/16]',
        thumbnail: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=600&fit=crop',
        duration: '1:15',
        views: '89.7k',
        gridSpan: { col: 1, row: 2 }
      },
      {
        id: '7',
        title: 'Autumn Collection',
        brand: 'Vintage Vogue',
        category: 'Fashion',
        aspectRatio: 'aspect-[16/9]',
        thumbnail: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=450&fit=crop',
        duration: '0:35',
        views: '39.9k',
        gridSpan: { col: 2, row: 1 }
      },
      {
        id: '8',
        title: 'Customer Success Story',
        brand: 'Wellness Plus',
        category: 'E-commerce',
        aspectRatio: 'aspect-square',
        thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop',
        duration: '0:25',
        views: '22.2k',
        gridSpan: { col: 1, row: 1 }
      }
    ];

    setVideoAds(ads);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatedTransition show={show} animation="slide-up" duration={600}>
      <div className="py-16 md:py-24">
        <div className="flex flex-col items-center text-center gap-2 mb-12">
          <h2 className="text-4xl font-bold text-blue-600 md:text-8xl">Showcase</h2>
          <p className="text-foreground max-w-3xl text-xl md:text-2xl mt-2">
            See what our users are creating with AI Video Ad Creator.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-4 gap-4 auto-rows-[200px]">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="animate-pulse">
                <div className="bg-muted rounded-lg h-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4 auto-rows-[200px] mb-12">
            {videoAds.map((ad) => (
              <Card 
                key={ad.id} 
                className="group overflow-hidden hover:shadow-xl transition-all duration-500 cursor-pointer"
                style={{
                  gridColumn: `span ${ad.gridSpan.col}`,
                  gridRow: `span ${ad.gridSpan.row}`
                }}
              >
                <div className="relative w-full h-full bg-gradient-to-br from-primary/5 to-primary/20 overflow-hidden">
                  <img 
                    src={ad.thumbnail} 
                    alt={ad.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Play size={20} className="text-primary ml-1" />
                    </div>
                  </div>
                  
                  {/* Duration badge */}
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {ad.duration}
                  </div>
                  
                  {/* Brand badge */}
                  <div className="absolute top-2 left-2 bg-primary/90 text-white text-xs px-2 py-1 rounded">
                    {ad.brand}
                  </div>
                  
                  {/* Views badge */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {ad.views} views
                  </div>
                  
                  {/* Title and brand overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-white font-medium text-sm group-hover:text-primary transition-colors duration-300">
                      {ad.title}
                    </h3>
                    <p className="text-white/80 text-xs mt-1">
                      by {ad.brand}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-center">
          <Button size="lg" className="rounded-full px-8 py-6 text-base font-medium" asChild>
            <Link to="/templates" className="flex items-center gap-2">
              Start Creating Your Own
              <ExternalLink size={20} />
            </Link>
          </Button>
        </div>
      </div>
    </AnimatedTransition>
  );
};
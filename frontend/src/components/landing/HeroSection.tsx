import { Play, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedTransition } from '@/components/AnimatedTransition';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface VideoAd {
  id: string;
  title: string;
  brand: string;
  thumbnail: string;
  duration: string;
  views: string;
}

interface HeroSectionProps {
  showTitle: boolean;
}

export const HeroSection = ({
  showTitle
}: HeroSectionProps) => {
  const navigate = useNavigate();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const videoAds: VideoAd[] = [
    {
      id: '1',
      title: 'Glow Serum Transformation',
      brand: 'Luminescence Beauty',
      thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=800&fit=crop',
      duration: '0:30',
      views: '45.2k'
    },
    {
      id: '2',
      title: 'Summer Collection Launch',
      brand: 'Elegance Fashion',
      thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
      duration: '0:45',
      views: '32.8k'
    },
    {
      id: '3',
      title: 'Daily Skincare Routine',
      brand: 'Pure Radiance',
      thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop',
      duration: '1:00',
      views: '67.3k'
    },
    {
      id: '4',
      title: 'Style Guide 2024',
      brand: 'Trendsetter',
      thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop',
      duration: '0:40',
      views: '41.1k'
    },
    {
      id: '5',
      title: 'Makeup Masterclass',
      brand: 'Glamour Cosmetics',
      thumbnail: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=800&fit=crop',
      duration: '1:15',
      views: '89.7k'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % videoAds.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [videoAds.length]);

  return (
    <div className="relative py-24 md:py-32 overflow-hidden">
      {/* Simple Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-white"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Content */}
          <AnimatedTransition show={showTitle} animation="slide-up" duration={600}>
            <div className="text-left relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles size={16} />
                AI-Powered Video Creation
              </div>
              
              <h1 className="text-5xl sm:text-6xl font-bold mb-8 text-blue-600 leading-tight">
                Create Stunning
                <span className="block text-foreground">Video Ads</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
                Transform your products into converting video content with AI-powered templates and professional editing tools. 
                <span className="font-semibold text-foreground"> No design skills required.</span>
              </p>
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/start-creating')} 
                  className="rounded-full px-10 py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Zap size={20} className="mr-2" />
                  Start Creating Free
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-full px-10 py-6 text-lg font-semibold border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                >
                  <Play size={20} className="mr-2" />
                  Watch Demo
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-lg">
                <div className="text-center">
                  <div className="font-bold text-3xl text-blue-600 mb-2">500+</div>
                  <div className="text-muted-foreground font-medium">Templates</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-3xl text-blue-600 mb-2">10k+</div>
                  <div className="text-muted-foreground font-medium">Videos Created</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-3xl text-blue-600 mb-2">98%</div>
                  <div className="text-muted-foreground font-medium">Satisfaction</div>
                </div>
              </div>
            </div>
          </AnimatedTransition>

          {/* Right Side - Video Showcase */}
          <AnimatedTransition show={showTitle} animation="slide-up" duration={800}>
            <div className="relative">
              {/* Main Video Display */}
              <div className="relative bg-white rounded-3xl p-8 border border-blue-100 shadow-xl">
                <div className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src={videoAds[currentAdIndex].thumbnail} 
                    alt={videoAds[currentAdIndex].title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-center justify-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                      <Play size={36} className="text-blue-600 ml-1" />
                    </div>
                  </div>
                  
                  {/* Video Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-blue-400 text-xs font-medium">LIVE</span>
                    </div>
                    <h3 className="text-white font-bold text-xl mb-1">
                      {videoAds[currentAdIndex].title}
                    </h3>
                    <p className="text-white/90 text-sm mb-3">
                      by {videoAds[currentAdIndex].brand}
                    </p>
                    <div className="flex items-center gap-6 text-white/80 text-sm">
                      <span className="flex items-center gap-1">
                        <Play size={14} />
                        {videoAds[currentAdIndex].duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp size={14} />
                        {videoAds[currentAdIndex].views} views
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  Trending
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-blue-100">
                  ✨ AI Generated
                </div>
              </div>

              {/* Scrolling Video Strip */}
              <div className="absolute -bottom-12 left-0 right-0 overflow-hidden">
                <div className="flex gap-4 animate-scroll-left">
                  {[...videoAds, ...videoAds].map((ad, index) => (
                    <div key={`${ad.id}-${index}`} className="flex-shrink-0">
                      <div className="w-28 h-36 rounded-xl overflow-hidden shadow-lg border-2 border-blue-100 hover:border-blue-300 transition-colors duration-300">
                        <img 
                          src={ad.thumbnail} 
                          alt={ad.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <Play size={20} className="text-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedTransition>
        </div>
      </div>
    </div>
  );
};
import { useState, useEffect } from 'react';
import { useAnimateIn } from '@/lib/animations';
import { AnimatedTransition } from '@/components/AnimatedTransition';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Play, Search, Filter, Grid, List, Eye, Clock, Download } from 'lucide-react';

interface VideoTemplate {
  id: string;
  title: string;
  category: string;
  aspectRatio: string;
  thumbnail: string;
  duration: string;
  views: string;
  downloads: string;
  tags: string[];
  description: string;
}

const TemplatesPage = () => {
  const [templates, setTemplates] = useState<VideoTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<VideoTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const showContent = useAnimateIn(false, 300);

  const categories = ['All', 'Beauty', 'Fashion', 'E-commerce', 'Lifestyle', 'Wellness'];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Generate comprehensive video templates
    const videoTemplates: VideoTemplate[] = [
      {
        id: '1',
        title: 'Beauty Product Showcase',
        category: 'Beauty',
        aspectRatio: 'aspect-[9/16]',
        thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=600&fit=crop',
        duration: '0:30',
        views: '2.4k',
        downloads: '156',
        tags: ['beauty', 'product', 'showcase', 'cosmetics'],
        description: 'Perfect for showcasing beauty products with elegant transitions and product highlights.'
      },
      {
        id: '2',
        title: 'Fashion Lookbook',
        category: 'Fashion',
        aspectRatio: 'aspect-[16/9]',
        thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=450&fit=crop',
        duration: '0:45',
        views: '1.8k',
        downloads: '89',
        tags: ['fashion', 'lookbook', 'style', 'clothing'],
        description: 'Dynamic fashion presentation with smooth camera movements and style transitions.'
      },
      {
        id: '3',
        title: 'Skincare Routine',
        category: 'Beauty',
        aspectRatio: 'aspect-square',
        thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop',
        duration: '1:00',
        views: '3.2k',
        downloads: '234',
        tags: ['skincare', 'routine', 'beauty', 'wellness'],
        description: 'Step-by-step skincare routine with before and after transformations.'
      },
      {
        id: '4',
        title: 'Product Launch',
        category: 'E-commerce',
        aspectRatio: 'aspect-[4/5]',
        thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=625&fit=crop',
        duration: '0:20',
        views: '1.5k',
        downloads: '67',
        tags: ['product', 'launch', 'ecommerce', 'marketing'],
        description: 'Exciting product launch with countdown and reveal effects.'
      },
      {
        id: '5',
        title: 'Style Guide',
        category: 'Fashion',
        aspectRatio: 'aspect-[3/4]',
        thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop',
        duration: '0:40',
        views: '2.1k',
        downloads: '123',
        tags: ['style', 'guide', 'fashion', 'tips'],
        description: 'Comprehensive style guide with multiple outfit combinations.'
      },
      {
        id: '6',
        title: 'Makeup Tutorial',
        category: 'Beauty',
        aspectRatio: 'aspect-[9/16]',
        thumbnail: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=600&fit=crop',
        duration: '1:15',
        views: '4.7k',
        downloads: '312',
        tags: ['makeup', 'tutorial', 'beauty', 'how-to'],
        description: 'Detailed makeup tutorial with close-up shots and step-by-step instructions.'
      },
      {
        id: '7',
        title: 'Collection Preview',
        category: 'Fashion',
        aspectRatio: 'aspect-[16/9]',
        thumbnail: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=450&fit=crop',
        duration: '0:35',
        views: '1.9k',
        downloads: '98',
        tags: ['collection', 'preview', 'fashion', 'new'],
        description: 'Sneak peek at upcoming fashion collections with dramatic reveals.'
      },
      {
        id: '8',
        title: 'Customer Testimonial',
        category: 'E-commerce',
        aspectRatio: 'aspect-square',
        thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop',
        duration: '0:25',
        views: '1.2k',
        downloads: '45',
        tags: ['testimonial', 'customer', 'review', 'social-proof'],
        description: 'Authentic customer testimonials with emotional storytelling.'
      },
      {
        id: '9',
        title: 'Wellness Tips',
        category: 'Wellness',
        aspectRatio: 'aspect-[9/16]',
        thumbnail: 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=400&h=600&fit=crop',
        duration: '0:50',
        views: '2.8k',
        downloads: '178',
        tags: ['wellness', 'health', 'tips', 'lifestyle'],
        description: 'Wellness and health tips with calming visuals and soothing music.'
      },
      {
        id: '10',
        title: 'Flash Sale',
        category: 'E-commerce',
        aspectRatio: 'aspect-[16/9]',
        thumbnail: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=450&fit=crop',
        duration: '0:15',
        views: '3.5k',
        downloads: '201',
        tags: ['sale', 'flash', 'ecommerce', 'urgent'],
        description: 'Urgent flash sale announcement with countdown timer and special offers.'
      },
      {
        id: '11',
        title: 'Lifestyle Story',
        category: 'Lifestyle',
        aspectRatio: 'aspect-[4/5]',
        thumbnail: 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=500&h=625&fit=crop',
        duration: '0:55',
        views: '2.6k',
        downloads: '134',
        tags: ['lifestyle', 'story', 'daily', 'inspiration'],
        description: 'Inspirational lifestyle story with beautiful cinematography.'
      },
      {
        id: '12',
        title: 'Brand Story',
        category: 'Lifestyle',
        aspectRatio: 'aspect-[16/9]',
        thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=450&fit=crop',
        duration: '1:20',
        views: '1.7k',
        downloads: '76',
        tags: ['brand', 'story', 'company', 'values'],
        description: 'Compelling brand story with company values and mission.'
      }
    ];

    setTemplates(videoTemplates);
    setFilteredTemplates(videoTemplates);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = templates;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    setFilteredTemplates(filtered);
  }, [searchTerm, selectedCategory, templates]);

  const handleTemplateClick = (template: VideoTemplate) => {
    // Handle template selection - could open preview modal or redirect to editor
    console.log('Selected template:', template);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent -z-10"></div>
      <div className="absolute top-1/3 right-0 w-[300px] h-[300px] rounded-full bg-primary/5 blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 left-0 w-[250px] h-[250px] rounded-full bg-accent/5 blur-3xl -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
        <AnimatedTransition show={showContent} animation="slide-up" duration={600}>
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-foreground">
              Video Templates
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover 500+ professionally designed video templates for every industry and use case.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={20} />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List size={20} />
                </Button>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'secondary'}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 text-center">
            <p className="text-muted-foreground">
              Showing {filteredTemplates.length} of {templates.length} templates
            </p>
          </div>

          {/* Templates Grid/List */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, idx) => (
                <div key={idx} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-64 mb-3"></div>
                  <div className="bg-muted rounded h-4 mb-2"></div>
                  <div className="bg-muted rounded h-3 w-2/3"></div>
                </div>
              ))}
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground mb-4">No templates found</p>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
            }>
              {filteredTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className="group overflow-hidden hover:shadow-xl transition-all duration-500 cursor-pointer"
                  onClick={() => handleTemplateClick(template)}
                >
                  <div className={`relative ${template.aspectRatio} bg-gradient-to-br from-primary/5 to-primary/20 overflow-hidden`}>
                    <img 
                      src={template.thumbnail} 
                      alt={template.title}
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
                      {template.duration}
                    </div>
                    
                    {/* Category badge */}
                    <div className="absolute top-2 left-2 bg-primary/90 text-white text-xs px-2 py-1 rounded">
                      {template.category}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors duration-300">
                      {template.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {template.description}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Eye size={16} />
                        {template.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Download size={16} />
                        {template.downloads}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        {template.duration}
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {template.tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default TemplatesPage;

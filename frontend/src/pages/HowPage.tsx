
import { useState, useEffect, useRef } from 'react';
import { useAnimateIn } from '@/lib/animations';
import { 
  Video, 
  Lightbulb, 
  Search, 
  Upload, 
  Database, 
  Zap,
  CheckCircle,
  Code,
  PenTool,
  BookOpen,
  Save,
  Shield,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Link } from 'react-router-dom';

const FeatureCard = ({ 
  icon, 
  title, 
  description,
  color = 'primary'
}: { 
  icon: React.ReactNode, 
  title: string, 
  description: string,
  color?: string
}) => {
  return (
    <div className="flex flex-col items-start p-6 glass-panel rounded-lg h-full">
      <div className={`w-12 h-12 flex items-center justify-center rounded-full bg-${color}/10 mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-primary">{title}</h3>
      <p className="text-foreground/80">{description}</p>
    </div>
  );
};

const WorkflowStep = ({ 
  number, 
  title, 
  description,
  color = "primary" 
}: { 
  number: number, 
  title: string, 
  description: string,
  color?: string 
}) => {
  return (
    <div className="relative">
      <div className={`absolute top-0 left-0 w-10 h-10 rounded-full bg-${color} text-white flex items-center justify-center font-bold text-lg z-10`}>
        {number}
      </div>
      <div className="pl-16">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-foreground/80">{description}</p>
      </div>
    </div>
  );
};

const FeatureShowcase = ({
  title,
  description,
  image,
  features,
  reversed = false
}: {
  title: string,
  description: string,
  image: string,
  features: { icon: React.ReactNode, text: string }[],
  reversed?: boolean
}) => {
  return (
    <div className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 my-16`}>
      <div className="w-full md:w-1/2">
        <div className="glass-panel rounded-lg overflow-hidden h-full">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <h3 className="text-2xl font-bold mb-3 text-primary">{title}</h3>
        <p className="text-foreground/80 mb-6">{description}</p>
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 mt-1 flex-shrink-0 text-primary">
                {feature.icon}
              </div>
              <p className="text-foreground/80">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ValueProp = ({
  icon,
  title,
  description
}: {
  icon: React.ReactNode,
  title: string,
  description: string
}) => {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-foreground/80">{description}</p>
    </div>
  );
};

const HowPage = () => {
  const [loading, setLoading] = useState(true);
  const showContent = useAnimateIn(false, 300);
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        const parallaxFactor = 0.4;
        heroRef.current.style.transform = `translateY(${scrollPosition * parallaxFactor}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent -z-10"></div>
      <div className="absolute top-1/3 right-0 w-[300px] h-[300px] rounded-full bg-primary/5 blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 left-0 w-[250px] h-[250px] rounded-full bg-accent/5 blur-3xl -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-24">
          <div ref={heroRef} className="relative w-full max-w-3xl mx-auto">
            <div className="absolute -z-10 w-[300px] h-[300px] rounded-full bg-gradient-to-r from-primary/30 to-accent/30 blur-3xl left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="glass-panel rounded-full py-5 px-8 inline-block mx-auto mb-12">
              <h1 className="text-2xl md:text-3xl font-bold text-primary">How does Video Creator work?</h1>
            </div>
            
            <p className="text-xl text-center text-foreground/80 max-w-2xl mx-auto mb-12">
              Our AI-powered platform makes video ad creation simple, fast, and professional for every brand.
            </p>
            
            <div className="flex justify-center">
              <Button size="lg" className="rounded-full">
                Start creating
              </Button>
            </div>
          </div>
        </div>
        
        {/* Workflow Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">The Video Creation Workflow</h2>
          
          <div className="relative">
            <div className="absolute left-5 top-6 w-0.5 h-[calc(100%-60px)] bg-gradient-to-b from-primary via-accent to-primary/30"></div>
            
            <div className="space-y-16 pl-4">
              <WorkflowStep 
                number={1}
                title="Choose Template"
                description="Select from 500+ professionally designed video templates for beauty, fashion, and lifestyle products."
              />
              <WorkflowStep 
                number={2}
                title="Customize Content"
                description="Upload your product images, add your brand colors, and customize text with our intuitive drag-and-drop editor."
              />
              <WorkflowStep 
                number={3}
                title="Preview & Edit"
                description="Preview your video in real-time, make adjustments, and refine the final output to ensure it meets your vision."
              />
              <WorkflowStep 
                number={4}
                title="Download & Share"
                description="Download your high-quality video in various formats and share it across your social media platforms."
              />
            </div>
          </div>
        </div>
        
        {/* Feature Showcases */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Designed for Video Ad Creation</h2>
          
          <FeatureShowcase
            title="Professional templates for every industry"
            description="Our library of 500+ templates is specifically designed for beauty, fashion, and lifestyle brands, ensuring your content looks professional and converts."
            image="/placeholder.svg"
            features={[
              { icon: <CheckCircle size={24} />, text: "Industry-specific video templates" },
              { icon: <CheckCircle size={24} />, text: "Customizable brand elements and colors" },
              { icon: <CheckCircle size={24} />, text: "Professional animations and transitions" },
              { icon: <CheckCircle size={24} />, text: "Mobile-optimized aspect ratios" },
            ]}
          />
          
          <FeatureShowcase
            title="AI-powered editing tools"
            description="Our advanced AI automatically enhances your content, from color correction to product highlighting, saving you hours of manual editing."
            image="/placeholder.svg"
            features={[
              { icon: <CheckCircle size={24} />, text: "Automatic color and lighting enhancement" },
              { icon: <CheckCircle size={24} />, text: "Smart product detection and highlighting" },
              { icon: <CheckCircle size={24} />, text: "AI-generated captions and text overlays" },
              { icon: <CheckCircle size={24} />, text: "Background music and sound effect suggestions" },
            ]}
            reversed={true}
          />
          
          <FeatureShowcase
            title="Multi-platform optimization"
            description="Create once and optimize for all platforms. Our system automatically adjusts your videos for Instagram, TikTok, YouTube, and Facebook."
            image="/placeholder.svg"
            features={[
              { icon: <CheckCircle size={24} />, text: "Platform-specific aspect ratios and formats" },
              { icon: <CheckCircle size={24} />, text: "Automatic caption generation for accessibility" },
              { icon: <CheckCircle size={24} />, text: "Optimized file sizes for faster loading" },
              { icon: <CheckCircle size={24} />, text: "Thumbnail generation for better click-through rates" },
            ]}
          />
          
          <FeatureShowcase
            title="Collaboration and workflow tools"
            description="Work with your team seamlessly. Share projects, get approvals, and manage multiple client campaigns from one dashboard."
            image="/placeholder.svg"
            features={[
              { icon: <CheckCircle size={24} />, text: "Team collaboration and project sharing" },
              { icon: <CheckCircle size={24} />, text: "Client approval workflows" },
              { icon: <CheckCircle size={24} />, text: "Version control and revision history" },
              { icon: <CheckCircle size={24} />, text: "Performance analytics and reporting" },
            ]}
            reversed={true}
          />
          
          <FeatureShowcase
            title="Enterprise-grade security and scalability"
            description="Built for businesses that need reliability, security, and the ability to scale their video production as they grow."
            image="/placeholder.svg"
            features={[
              { icon: <CheckCircle size={24} />, text: "Enterprise security and compliance" },
              { icon: <CheckCircle size={24} />, text: "White-label solutions for agencies" },
              { icon: <CheckCircle size={24} />, text: "API access for custom integrations" },
              { icon: <CheckCircle size={24} />, text: "Unlimited storage and bandwidth" },
            ]}
          />
        </div>
        
        {/* Values Section */}
        <div className="py-16 px-4 rounded-lg glass-panel my-24">
          <h2 className="text-3xl font-bold text-center mb-3">We believe video creation should be effortless</h2>
          <p className="text-xl text-center text-foreground/80 max-w-3xl mx-auto mb-16">
            So you can focus on growing your brand, not learning complex software.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueProp
              icon={<Video className="w-8 h-8 text-primary" />}
              title="Creativity without complexity"
              description="Our platform makes professional video creation accessible to everyone, regardless of technical expertise."
            />
            <ValueProp
              icon={<Shield className="w-8 h-8 text-primary" />}
              title="Quality without compromise"
              description="Professional-grade output that competes with expensive agency work, at a fraction of the cost and time."
            />
            <ValueProp
              icon={<Lightbulb className="w-8 h-8 text-primary" />}
              title="Less becomes more"
              description="By removing unnecessary features and complexity, we create a more powerful experience."
            />
          </div>
          
          <div className="flex justify-center mt-16">
            <Button size="lg" className="rounded-full" asChild>
              <Link to="/">
                Start creating videos
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Upload className="w-8 h-8 text-primary" />}
              title="Template Library"
              description="Access 500+ professionally designed video templates for beauty, fashion, and lifestyle brands."
            />
            <FeatureCard
              icon={<Database className="w-8 h-8 text-primary" />}
              title="AI Editing"
              description="Our AI automatically enhances colors, lighting, and product focus for professional results."
            />
            <FeatureCard
              icon={<Video className="w-8 h-8 text-primary" />}
              title="Multi-Platform"
              description="Export videos optimized for Instagram, TikTok, YouTube, Facebook, and more."
            />
            <FeatureCard
              icon={<Search className="w-8 h-8 text-primary" />}
              title="Brand Kit"
              description="Save your brand colors, fonts, and logos for consistent video creation across campaigns."
            />
            <FeatureCard
              icon={<Lightbulb className="w-8 h-8 text-primary" />}
              title="Smart Captions"
              description="AI-generated captions and text overlays that increase engagement and accessibility."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-primary" />}
              title="Analytics"
              description="Track performance metrics and optimize your video ads for better conversion rates."
            />
          </div>
        </div>
        
        {/* Who is it for section */}
        <div className="mb-20 glass-panel p-10 rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-12">Made for beauty brands, fashion labels, e-commerce stores, influencers & marketing agencies</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <PenTool className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-bold text-lg">Beauty Brands</h3>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-bold text-lg">Fashion Labels</h3>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-bold text-lg">E-commerce</h3>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Code className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-bold text-lg">Agencies</h3>
            </div>
          </div>
        </div>
        
        {/* Technical Details */}
        <div className="mt-20 glass-panel p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-primary">Technical Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3">AI Technology</h3>
              <p className="text-foreground/80 mb-4">
                Our platform uses advanced computer vision and machine learning to automatically enhance video quality and generate engaging content.
              </p>
              <h3 className="text-xl font-bold mb-3">Cloud Processing</h3>
              <p className="text-foreground/80">
                All video processing happens in the cloud with enterprise-grade security, ensuring fast rendering and reliable performance.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Integration</h3>
              <p className="text-foreground/80 mb-4">
                Connect with your existing marketing tools like Shopify, Mailchimp, and social media platforms through our comprehensive API.
              </p>
              <h3 className="text-xl font-bold mb-3">Customization</h3>
              <p className="text-foreground/80">
                Tailor the platform to your brand with custom templates, white-label solutions, and personalized workflows.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowPage;

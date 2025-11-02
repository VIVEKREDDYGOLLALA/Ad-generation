import { useState } from 'react';
import { AnimatedTransition } from '@/components/AnimatedTransition';
import { FeatureIllustration } from './FeatureIllustration';
import { FeatureIcon } from './FeatureIllustrations/FeatureIcon';
interface ManageSectionProps {
  show: boolean;
}
export const ManageSection = ({
  show
}: ManageSectionProps) => {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const features = [{
    title: "AI Templates",
    description: "Choose from 500+ pre-designed video templates for beauty, fashion, and lifestyle products."
  }, {
    title: "Smart Editing",
    description: "AI-powered editing tools that automatically enhance colors, lighting, and product focus."
  }, {
    title: "Brand Kit",
    description: "Save your brand colors, fonts, and logos for consistent video ad creation."
  }, {
    title: "Product Focus",
    description: "AI automatically detects and highlights your products with professional lighting effects."
  }, {
    title: "Auto Captions",
    description: "Generate engaging captions and text overlays that convert viewers into customers."
  }, {
    title: "Music Library",
    description: "Access thousands of royalty-free tracks perfect for beauty and fashion content."
  }, {
    title: "Export Options",
    description: "Export in multiple formats optimized for Instagram, TikTok, YouTube, and Facebook ads."
  }, {
    title: "Analytics",
    description: "Track performance metrics and optimize your video ads for better conversion rates."
  }, {
    title: "Collaboration",
    description: "Work with your team in real-time with shared projects and approval workflows."
  }, {
    title: "Mobile App",
    description: "Create and edit video ads on-the-go with our powerful mobile application."
  }, {
    title: "API Access",
    description: "Integrate video creation into your existing marketing and e-commerce platforms."
  }, {
    title: "White Label",
    description: "Customize the platform with your branding for client video ad creation services."
  }];
  const handleFeatureClick = (index: number) => {
    setActiveFeature(index === activeFeature ? null : index);
  };
  return <AnimatedTransition show={show} animation="slide-up" duration={600}>
      <div className="py-16 md:py-24">
        <div className="flex flex-col items-center text-center gap-2 mb-12">
          <h2 className="text-4xl font-bold text-blue-600 md:text-8xl">Create</h2>
          <p className="text-foreground max-w-3xl text-xl md:text-2xl mt-2">The ultimate platform for creating converting video ads.</p>
        </div>

        <FeatureIllustration featureIndex={activeFeature} className="transition-all duration-500" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => <div key={index} className={`flex flex-col items-center text-center transition-all duration-300 ${activeFeature === index ? 'scale-105' : 'hover:scale-102'} cursor-pointer`} onClick={() => handleFeatureClick(index)}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${activeFeature === index ? 'bg-primary/20 ring-2 ring-primary/50' : 'bg-primary/10'}`}>
                <FeatureIcon index={index} size={32} />
              </div>
              <h3 className="font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>)}
        </div>
      </div>
    </AnimatedTransition>;
};
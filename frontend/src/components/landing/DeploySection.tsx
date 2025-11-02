import { Activity, TrendingUp, Layout, Maximize } from 'lucide-react';
import { AnimatedTransition } from '@/components/AnimatedTransition';
interface DeploySectionProps {
  show: boolean;
}
export const DeploySection = ({
  show
}: DeploySectionProps) => {
  const deployFeatures = [{
    icon: <Activity size={32} className="text-primary" />,
    title: "Multi-Platform",
    description: "Publish your video ads directly to Instagram, TikTok, YouTube, Facebook, and more."
  }, {
    icon: <TrendingUp size={32} className="text-primary" />,
    title: "Performance Analytics",
    description: "Track views, engagement, conversions, and ROI with detailed performance metrics."
  }, {
    icon: <Layout size={32} className="text-primary" />,
    title: "A/B Testing",
    description: "Test different video versions to optimize for maximum conversion rates."
  }, {
    icon: <Maximize size={32} className="text-primary" />,
    title: "Scale & Automate",
    description: "Automate video creation and scale your ad campaigns across multiple platforms."
  }];
  return <AnimatedTransition show={show} animation="slide-up" duration={600}>
      <div className="py-16 md:py-24">
        <div className="flex flex-col items-center text-center gap-2 mb-12">
          <h2 className="text-4xl font-bold text-blue-600 md:text-8xl">Publish</h2>
          <p className="text-foreground max-w-3xl text-xl md:text-2xl mt-2">
            Launch your video ads and track their performance across all platforms.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {deployFeatures.map((feature, index) => <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>)}
        </div>
      </div>
    </AnimatedTransition>;
};
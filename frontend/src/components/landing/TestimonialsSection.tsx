import { AnimatedTransition } from '@/components/AnimatedTransition';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
interface TestimonialsSectionProps {
  showTestimonials: boolean;
}
export const TestimonialsSection = ({
  showTestimonials
}: TestimonialsSectionProps) => {
  const testimonials = [{
    quote: "Our video ads increased sales by 300% in just one month!",
    name: "Sarah P.",
    role: "Beauty Brand Owner",
    rating: 5
  }, {
    quote: "Creating professional video content has never been easier.",
    name: "James L.",
    role: "Fashion Designer",
    rating: 5
  }, {
    quote: "The AI templates saved us thousands on video production costs.",
    name: "Amanda T.",
    role: "E-commerce Manager",
    rating: 4
  }, {
    quote: "Our social media engagement skyrocketed with these video ads.",
    name: "Dr. Michael R.",
    role: "Marketing Director",
    rating: 5
  }, {
    quote: "I can create stunning video ads in minutes, not hours!",
    name: "Emma A.",
    role: "Content Creator",
    rating: 4
  }, {
    quote: "The conversion rates from our video ads are incredible.",
    name: "Laura M.",
    role: "Digital Marketer",
    rating: 5
  }, {
    quote: "Professional video quality without the professional price tag.",
    name: "Rafael O.",
    role: "Startup Founder",
    rating: 5
  }, {
    quote: "Our beauty products look amazing in these video templates.",
    name: "David K.",
    role: "Brand Manager",
    rating: 4
  }, {
    quote: "The platform is so intuitive, anyone on my team can use it.",
    name: "Nicole F.",
    role: "Creative Director",
    rating: 5
  }, {
    quote: "Video ads have become our highest-converting marketing channel.",
    name: "Thomas J.",
    role: "Sales Manager",
    rating: 4
  }, {
    quote: "We've doubled our online sales since switching to video ads.",
    name: "Sophia R.",
    role: "E-commerce Owner",
    rating: 5
  }, {
    quote: "The ROI on our video ad campaigns is absolutely phenomenal.",
    name: "Alex C.",
    role: "Marketing Consultant",
    rating: 5
  }];

  // Component to render star ratings
  const StarRating = ({
    rating
  }: {
    rating: number;
  }) => {
    return <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />)}
      </div>;
  };
  return <AnimatedTransition show={showTestimonials} animation="slide-up" duration={600}>
      <div className="py-16 md:py-24">
        <div className="flex flex-col items-center gap-2 mb-12 text-center">
          <h2 className="text-4xl font-bold text-blue-600 md:text-8xl">
            Trusted by brands<br />
            that convert.
          </h2>
          
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {testimonials.map((testimonial, index) => <Card key={index} className="bg-card border border-border/50 p-6 rounded-lg shadow-sm h-full">
              <StarRating rating={testimonial.rating} />
              <p className="text-lg font-medium mb-4">{testimonial.quote}</p>
              <div className="mt-4">
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </Card>)}
        </div>
      </div>
    </AnimatedTransition>;
};

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { UserCase } from '../UseCasesTypes';
interface EcommerceStoresProps {
  data: UserCase;
}
const EcommerceStoresCase = ({
  data
}: EcommerceStoresProps) => {
  return <div className="max-w-5xl mx-auto my-10">
      <div className="relative p-4 md:p-8 bg-white/10 backdrop-blur-sm rounded-xl">
        <div className="flex gap-4 mb-4">
          <div className="w-1/3 aspect-[4/5] bg-white/20 rounded-lg shadow-md overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <img alt="Product Showcase" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=600&fit=crop" />
          </div>
          <div className="w-2/3 aspect-[3/2] bg-white/20 rounded-lg shadow-md overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            <img alt="Shopping Experience" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop" />
          </div>
        </div>
        
        <div className="flex gap-4 relative">
          <div className="w-1/2 aspect-[3/2] bg-white/20 rounded-lg shadow-md overflow-hidden transform translate-y-0 hover:-translate-y-1 transition-transform duration-300">
            <img alt="Customer Reviews" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop" />
          </div>
          <div className="w-1/4 aspect-square bg-white/20 rounded-lg shadow-md overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <img alt="Flash Sales" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=400&fit=crop" />
          </div>
          <div className="w-1/4 bg-white/20 rounded-lg p-4 shadow-md">
            <p className="text-white font-medium text-lg mb-2">E-commerce</p>
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-6 rounded-full bg-[#FF6B35]"></div>
              <div className="h-6 w-6 rounded-full bg-[#F7931E]"></div>
              <div className="h-6 w-6 rounded-full bg-[#4ECDC4]"></div>
              <div className="h-6 w-6 rounded-full bg-[#45B7D1]"></div>
            </div>
          </div>
        </div>
        
        <div className="absolute right-8 top-1/3 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md transform rotate-3 hover:rotate-0 transition-transform duration-300 z-10">
          <p className="text-sm text-white font-medium">Store System</p>
        </div>
        
        <div className="absolute left-1/4 bottom-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full shadow-md flex items-center z-10">
          <span className="h-2 w-2 bg-orange-300 rounded-full mr-2"></span>
          <span className="text-xs text-white font-medium">Shop Mood</span>
        </div>
      </div>
    </div>;
};
export default EcommerceStoresCase;

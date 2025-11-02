
import { UserCase } from '../UseCasesTypes';
interface InfluencersProps {
  data: UserCase;
}
const InfluencersCase = ({
  data
}: InfluencersProps) => {
  return <div className="max-w-5xl mx-auto my-10">
      <div className="relative p-4 md:p-8 bg-white/10 backdrop-blur-sm rounded-xl">
        <div className="flex gap-4 mb-4">
          <div className="w-1/3 aspect-[4/5] bg-white/20 rounded-lg shadow-md overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <img alt="Content Creation" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&h=600&fit=crop" />
          </div>
          <div className="w-2/3 aspect-[3/2] bg-white/20 rounded-lg shadow-md overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            <img alt="Social Media" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=600&fit=crop" />
          </div>
        </div>
        
        <div className="flex gap-4 relative">
          <div className="w-1/2 aspect-[3/2] bg-white/20 rounded-lg shadow-md overflow-hidden transform translate-y-0 hover:-translate-y-1 transition-transform duration-300">
            <img alt="Lifestyle Content" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=600&h=400&fit=crop" />
          </div>
          <div className="w-1/4 aspect-square bg-white/20 rounded-lg shadow-md overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <img alt="Audience Growth" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop" />
          </div>
          <div className="w-1/4 bg-white/20 rounded-lg p-4 shadow-md">
            <p className="text-white font-medium text-lg mb-2">Content Calendar</p>
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-6 rounded-full bg-[#FF69B4]"></div>
              <div className="h-6 w-6 rounded-full bg-[#4ECDC4]"></div>
              <div className="h-6 w-6 rounded-full bg-[#45B7D1]"></div>
              <div className="h-6 w-6 rounded-full bg-[#96CEB4]"></div>
            </div>
          </div>
        </div>
        
        <div className="absolute right-8 top-1/3 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md transform rotate-3 hover:rotate-0 transition-transform duration-300 z-10">
          <p className="text-sm text-white font-medium">Content System</p>
        </div>
        
        <div className="absolute left-1/4 bottom-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full shadow-md flex items-center z-10">
          <span className="h-2 w-2 bg-purple-300 rounded-full mr-2"></span>
          <span className="text-xs text-white font-medium">Creator Mood</span>
        </div>
      </div>
    </div>;
};
export default InfluencersCase;

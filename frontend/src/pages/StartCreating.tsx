import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Image as ImageIcon, Clock, Play, Mic } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Scene {
  scene_number: number;
  title: string;
  scene_category: string;
  setting: string;
  color_palette: string;
  effect_graphics: string;
  camera: string;
  image_prompt: string;
  runway_video_prompt: string;
  voiceover_script: string;
  technical_notes: string;
  transition_to_next: string;
  // Fallback fields for backward compatibility
  video_prompt?: string;
  voiceover?: string;
}

interface PipelineResult {
  storyboard: { scenes: Scene[] };
  finalVideo?: {
    finalVideoUrl: string;
    metadata: {
      totalDuration: number;
      sceneCount: number;
      videoUrls: string[];
      audioUrls: string[];
      status: string;
    };
    instructions: {
      message: string;
      nextStep: string;
      estimatedCost: string;
      socialMediaReady: boolean;
    };
  };
  message?: string;
}

const StartCreating = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("15");
  const [voice, setVoice] = useState("af_bella");
  const [style, setStyle] = useState("luxury");
  const [brandPalette, setBrandPalette] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scenes, setScenes] = useState<Scene[] | null>(null);
  const [pipelineResult, setPipelineResult] = useState<PipelineResult | null>(null);
  const [usePipeline, setUsePipeline] = useState(false);
  const [pipelineProgress, setPipelineProgress] = useState<{
    currentStep: string;
    progress: number;
    details: string;
    isActive: boolean;
  }>({
    currentStep: '',
    progress: 0,
    details: '',
    isActive: false
  });

  const { user, session } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const downloadVideo = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const testImageUpload = async () => {
    if (!imageFile) {
      setError("Please upload an image first to test.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('test_image', imageFile);
      
      console.log('Testing image upload with:', imageFile.name, 'Size:', imageFile.size);
      
      const res = await fetch(`${API_URL}/api/test-upload`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        console.log('Test upload successful:', data);
        alert(`✅ Image upload test successful!\n\nFilename: ${data.details.filename}\nSize: ${data.details.size} bytes\nType: ${data.details.mimetype}\nBase64 length: ${data.details.base64Length}`);
      } else {
        throw new Error(data.error || 'Test failed');
      }
    } catch (e: any) {
      console.error('Test upload error:', e);
      setError(`Test upload failed: ${e.message}`);
    }
  };

  const testFullPipeline = async () => {
    if (!imageFile) {
      setError("Please upload an image first to test.");
      return;
    }

    if (!session?.access_token) {
      setError("You must be signed in to test the pipeline.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('test_image', imageFile);
      
      console.log('Testing full pipeline with:', imageFile.name, 'Size:', imageFile.size);
      
      const res = await fetch(`${API_URL}/api/test-pipeline`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.access_token}`
        },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        console.log('Pipeline test successful:', data);
        alert(`✅ FULL PIPELINE TEST SUCCESSFUL!\n\nAll services are working correctly.\n\n⚠️ This test cost money:\n- 1 Kimi K2 API call\n- 1 RunwayML Gen4 Image Turbo API call\n- 1 RunwayML Gen4 Turbo API call\n- 1 Kokoro TTS API call\n\nYou can now safely run the full pipeline!`);
      } else {
        throw new Error(data.error || 'Pipeline test failed');
      }
    } catch (e: any) {
      console.error('Pipeline test error:', e);
      setError(`Pipeline test failed: ${e.message}`);
    }
  };

  const checkBackendHealth = async () => {
    try {
      console.log('Checking backend health...');
      
      const res = await fetch(`${API_URL}/api/health`);
      const data = await res.json();
      
      if (res.ok && data.status === 'healthy') {
        console.log('Backend health check successful:', data);
        alert(`✅ BACKEND HEALTHY!\n\nAll services are ready:\n- Environment variables: ✅\n- Supabase connection: ✅\n- Replicate API: ✅\n\nYou can now safely test the pipeline!`);
      } else {
        console.error('Backend health check failed:', data);
        const errorDetails = Object.entries(data.services || {})
          .map(([service, status]: [string, any]) => `${service}: ${status.status}`)
          .join('\n');
        alert(`❌ BACKEND UNHEALTHY!\n\nService status:\n${errorDetails}\n\nPlease fix backend issues before testing.`);
      }
    } catch (e: any) {
      console.error('Health check error:', e);
      setError(`Health check failed: ${e.message}`);
    }
  };

  const checkPublicBackendHealth = async () => {
    try {
      console.log('Checking public backend health...');
      
      const res = await fetch(`${API_URL}/api/health/public`);
      const data = await res.json();
      
      if (res.ok && data.status === 'healthy') {
        console.log('Public backend health check successful:', data);
        alert(`✅ BACKEND HEALTHY!\n\nAll services are ready:\n- Environment variables: ✅\n- Supabase connection: ✅\n- Replicate API: ✅\n\nYou can now safely test the pipeline!`);
      } else {
        console.error('Public backend health check failed:', data);
        const errorDetails = Object.entries(data.services || {})
          .map(([service, status]: [string, any]) => `${service}: ${status.status}`)
          .join('\n');
        alert(`❌ BACKEND UNHEALTHY!\n\nService status:\n${errorDetails}\n\nPlease fix backend issues before testing.`);
      }
    } catch (e: any) {
      console.error('Public health check error:', e);
      setError(`Public health check failed: ${e.message}`);
    }
  };

  const testStoryboardGeneration = async () => {
    try {
      console.log('Testing storyboard generation...');
      
      const res = await fetch(`${API_URL}/api/test-storyboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: 'Test Product',
          product_description: 'A simple test product for validation',
          duration: 10
        })
      });

      const data = await res.json();
      if (res.ok) {
        console.log('Storyboard test successful:', data);
        alert(`✅ STORYBOARD TEST SUCCESSFUL!\n\nGenerated ${data.storyboard.scenes.length} scenes.\n\n⚠️ This test costs money:\n- 1 Kimi K2 API call (~$0.10-0.20)\n\nYou can now test the full pipeline!`);
      } else {
        throw new Error(data.error || 'Storyboard test failed');
      }
    } catch (e: any) {
      console.error('Storyboard test error:', e);
      setError(`Storyboard test failed: ${e.message}`);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setScenes(null);
    setPipelineResult(null);

    if (!productName.trim() || !description.trim()) {
      setError("Please provide a product name and description.");
      return;
    }

    if (usePipeline && !session?.access_token) {
      setError("You must be signed in to use the full pipeline.");
      return;
    }

    if (usePipeline && !imageFile) {
      setError("Please upload a product image to use the full pipeline.");
      return;
    }

    setIsLoading(true);
    setPipelineProgress({
      currentStep: 'Starting pipeline...',
      progress: 5,
      details: 'Initializing ad generation process',
      isActive: true
    });
    
    try {
      if (usePipeline) {
        // Use full pipeline endpoint with authentication and image upload
        const formData = new FormData();
        formData.append('product_name', productName.trim());
        formData.append('product_description', description.trim());
        formData.append('duration', duration);
        formData.append('voice', voice);
        formData.append('style', style);
        formData.append('brand_palette', brandPalette.trim());
        formData.append('ingredients', ingredients.trim());
        
        if (imageFile) {
          console.log('Uploading image:', imageFile.name, 'Size:', imageFile.size, 'Type:', imageFile.type);
          formData.append('product_image', imageFile);
        }

        console.log('Sending FormData with fields:', {
          product_name: productName.trim(),
          product_description: description.trim(),
          duration,
          voice,
          hasImage: !!imageFile
        });

        // Update progress for storyboard generation
        setPipelineProgress({
          currentStep: 'Generating storyboard...',
          progress: 15,
          details: 'Creating scene breakdown and prompts',
          isActive: true
        });

        const res = await fetch(`${API_URL}/api/pipeline`, {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${session?.access_token}`
          },
          body: formData
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          if (res.status === 401) {
            throw new Error("Authentication failed. Please sign in again.");
          }
          throw new Error(data.error || `Request failed with ${res.status}`);
        }

        // Update progress for completion
        setPipelineProgress({
          currentStep: 'Pipeline completed!',
          progress: 100,
          details: 'All assets generated successfully',
          isActive: true
        });

        const data = await res.json();
        setPipelineResult(data);
        setScenes(data.storyboard.scenes);
        
        // Show success message
        alert('✅ Ad generated successfully! Check your dashboard to view the final video.');
        
        // Hide progress after completion
        setTimeout(() => {
          setPipelineProgress({
            currentStep: '',
            progress: 0,
            details: '',
            isActive: false
          });
        }, 3000);
        
      } else {
        // Use storyboard endpoint only
        setPipelineProgress({
          currentStep: 'Generating storyboard...',
          progress: 50,
          details: 'Creating scene breakdown and prompts',
          isActive: true
        });
        
        const res = await fetch(`${API_URL}/api/generate-storyboard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_name: productName.trim(),
            product_description: description.trim(),
            duration: parseInt(duration, 10)
          })
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Request failed with ${res.status}`);
        }

        const data = await res.json();
        setScenes(data.scenes);
        
        // Update progress for completion
        setPipelineProgress({
          currentStep: 'Storyboard completed!',
          progress: 100,
          details: 'Scene breakdown generated successfully',
          isActive: true
        });
        
        // Hide progress after completion
        setTimeout(() => {
          setPipelineProgress({
            currentStep: '',
            progress: 0,
            details: '',
            isActive: false
          });
        }, 3000);
      }
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
      // Hide progress on error
      setPipelineProgress({
        currentStep: '',
        progress: 0,
        details: '',
        isActive: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[320px] bg-gradient-to-b from-primary/5 to-transparent -z-10"></div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-8 md:mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600">Start Creating</h1>
          <p className="mt-3 text-muted-foreground text-lg">Upload your product, add details, and choose your ad duration.</p>
        </div>

        <Card className="border-blue-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Create a new ad</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="productImage" className="mb-2 block">Product image</Label>
                  <div className="border-2 border-dashed border-blue-200 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-white">
                    {imagePreview ? (
                      <div className="w-full">
                        <img src={imagePreview} alt="Preview" className="w-full h-64 object-contain rounded-lg border border-blue-100 bg-white" />
                        <div className="mt-3 flex items-center justify-between">
                          <Button type="button" variant="outline" className="border-blue-200" onClick={() => { setImageFile(null); setImagePreview(null); }}>
                            Remove
                          </Button>
                          <Label htmlFor="productImage" className="cursor-pointer inline-flex items-center gap-2 text-blue-600">
                            <Upload size={18} />
                            Change image
                          </Label>
                          <Input id="productImage" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <ImageIcon className="mx-auto mb-3 text-blue-500" size={40} />
                        <p className="text-sm text-muted-foreground mb-3">Drag and drop your product image here, or click to browse</p>
                        <div className="flex items-center justify-center">
                          <Label htmlFor="productImage" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700">
                            <Upload size={18} />
                            Upload image
                          </Label>
                          <Input id="productImage" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="productName" className="mb-2 block">Product name</Label>
                  <Input id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g., GlowSkin Facewash" />
                </div>
                <div>
                  <Label htmlFor="description" className="mb-2 block">Product description</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the product, key benefits, target audience, and any must-have highlights." className="min-h-[160px]" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="style" className="mb-2 block">Ad Style</Label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="luxury">Luxury</SelectItem>
                        <SelectItem value="nature-inspired">Nature-Inspired</SelectItem>
                        <SelectItem value="minimalist">Minimalist</SelectItem>
                        <SelectItem value="energetic">Energetic</SelectItem>
                        <SelectItem value="elegant">Elegant</SelectItem>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="cinematic">Cinematic</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="brandPalette" className="mb-2 block">Brand Color Palette</Label>
                    <Input 
                      id="brandPalette" 
                      value={brandPalette} 
                      onChange={(e) => setBrandPalette(e.target.value)} 
                      placeholder="e.g., mint green, soft white, silver" 
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="ingredients" className="mb-2 block">Key Ingredients (Optional)</Label>
                  <Input 
                    id="ingredients" 
                    value={ingredients} 
                    onChange={(e) => setIngredients(e.target.value)} 
                    placeholder="e.g., aloe vera, green tea, vitamin C" 
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Ad duration</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 seconds</SelectItem>
                      <SelectItem value="10">10 seconds</SelectItem>
                      <SelectItem value="15">15 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <div className="inline-flex items-center gap-2">
                      <Clock size={16} /> Shorter ads often perform better on social feeds.
                    </div>
                    <div className="mt-1 text-amber-600">
                      Note: Each scene generates a 5-second video due to AI model constraints. 
                      The final ad will be optimized for social media engagement.
                      Your uploaded product image is used as a reference for image generation, 
                      then generated images are converted to videos.
                    </div>
                    <div className="mt-2 text-emerald-600 bg-emerald-50 p-2 rounded border border-emerald-200">
                      🔄 <strong>Reference Image Workflow:</strong> Your product image → Storyboard generation → AI generates multiple images (all using your image as reference) → Images converted to videos → Final ad assembly
                    </div>
                  </div>
                </div>

                {usePipeline && (
                  <div>
                    <Label className="mb-2 block">Voice</Label>
                    <Select value={voice} onValueChange={setVoice}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select voice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="af_bella">Bella (Female)</SelectItem>
                        <SelectItem value="af_nicole">Nicole (Female)</SelectItem>
                        <SelectItem value="am_echo">Echo (Male)</SelectItem>
                        <SelectItem value="am_eric">Eric (Male)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="pt-2 space-y-3">
                  {usePipeline && !user && (
                    <div className="text-amber-600 text-sm bg-amber-50 p-3 rounded-md border border-amber-200">
                      ⚠️ You must be signed in to use the full pipeline. Sign in to save your generated ads.
                    </div>
                  )}
                  
                  {usePipeline && !imageFile && (
                    <div className="text-amber-600 text-sm bg-amber-50 p-3 rounded-md border border-amber-200">
                      ⚠️ Please upload a product image to use the full pipeline. The image will be used as a reference for AI generation.
                    </div>
                  )}
                  
                  {usePipeline && imageFile && (
                    <div className="text-blue-600 text-sm bg-blue-50 p-3 rounded-md border border-blue-200">
                      ℹ️ Product image uploaded. The AI will use detailed prompts based on your image to generate consistent visuals.
                    </div>
                  )}
                  
                  {imageFile && (
                    <div className="text-emerald-600 text-sm bg-emerald-50 p-3 rounded-md border border-emerald-200">
                      🎯 <strong>Reference Image Active:</strong> Your uploaded product image will be used as a reference for ALL AI-generated images to ensure consistent product appearance across all scenes.
                    </div>
                  )}
                  
                  {imageFile && (
                    <div className="text-purple-600 text-sm bg-purple-50 p-3 rounded-md border border-purple-200">
                      🎬 <strong>Image-to-Video Process:</strong> Each AI-generated image will be converted to a 5-second video clip using RunwayML Gen4 Turbo, adding cinematic motion and effects based on scene-specific video prompts.
                    </div>
                  )}
                  
                  {imageFile && (
                    <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md border border-green-200">
                      💾 <strong>Permanent Storage:</strong> All generated assets (images, videos, audio) are automatically downloaded and stored permanently in Supabase Storage, ensuring your content never expires.
                    </div>
                  )}
                  
                  {imageFile && (
                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={testImageUpload}
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        🧪 Test Image Upload
                      </Button>
                      
                      {session?.access_token && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={testFullPipeline}
                          className="border-green-200 text-green-600 hover:bg-green-50"
                        >
                          🔬 Test Full Pipeline
                        </Button>
                      )}
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={checkBackendHealth}
                        className="border-purple-200 text-purple-600 hover:bg-purple-50"
                      >
                        💪 Check Backend Health
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={checkPublicBackendHealth}
                        className="border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                      >
                        🏥 Check Public Health
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={testStoryboardGeneration}
                        className="border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                      >
                        🎨 Test Storyboard Generation
                      </Button>
                      
                      <div className="text-xs text-muted-foreground self-center">
                        Test services before running expensive pipeline
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="usePipeline"
                        checked={usePipeline}
                        onChange={(e) => setUsePipeline(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="usePipeline" className="text-sm font-medium text-gray-700">
                        Generate full pipeline (images, videos, audio)
                      </label>
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isLoading || (usePipeline && !imageFile)} 
                      className="px-8 py-6 text-lg rounded-full bg-blue-600 hover:bg-blue-700 w-full"
                    >
                      {isLoading ? 'Generating…' : usePipeline ? 'Generate Full Ad' : 'Generate Storyboard'}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">{error}</div>
                )}

                {/* Pipeline Progress Display */}
                {pipelineProgress.isActive && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-blue-800">Pipeline Progress</h4>
                      <span className="text-sm text-blue-600">{pipelineProgress.progress}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${pipelineProgress.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-blue-700">
                      <div className="font-medium">{pipelineProgress.currentStep}</div>
                      <div className="text-blue-600">{pipelineProgress.details}</div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {scenes && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-blue-600 mb-6">Generated Storyboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scenes.map((scene, idx) => (
                <Card key={idx} className="border-blue-100 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-blue-600 text-lg">
                      Scene {scene.scene_number || idx + 1}: {scene.title}
                    </CardTitle>
                    <div className="text-xs text-blue-500 font-medium">
                      {scene.scene_category} • {scene.setting}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-semibold flex items-center gap-2 text-blue-700">
                          <ImageIcon size={16} />
                          Image Prompt
                        </div>
                        <div className="text-sm text-muted-foreground bg-blue-50 p-2 rounded">
                          {scene.image_prompt}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold flex items-center gap-2 text-green-700">
                          <Play size={16} />
                          Runway Video Prompt
                        </div>
                        <div className="text-sm text-muted-foreground bg-green-50 p-2 rounded">
                          {scene.runway_video_prompt || scene.video_prompt}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold flex items-center gap-2 text-purple-700">
                          <Mic size={16} />
                          Voiceover Script
                        </div>
                        <div className="text-sm text-muted-foreground bg-purple-50 p-2 rounded">
                          "{scene.voiceover_script || scene.voiceover}"
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="font-medium">Camera:</span> {scene.camera}
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="font-medium">Effects:</span> {scene.effect_graphics}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {pipelineResult && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-blue-600 mb-6">🎬 Your Final Video Ad</h2>
            
            {/* Final Merged Video Display */}
            {pipelineResult.finalVideo?.finalVideoUrl ? (
              <Card className="border-green-100 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-lg text-green-700">✅ Final Video Ready!</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Video Player */}
                    <div className="text-center">
                      <video 
                        controls 
                        className="w-full max-w-4xl mx-auto rounded-lg border-2 border-green-200 shadow-lg"
                        style={{ maxHeight: '70vh' }}
                      >
                        <source src={pipelineResult.finalVideo.finalVideoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    
                    {/* Video Info */}
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">Video Details:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Duration:</span>
                          <p className="text-green-700">{pipelineResult.finalVideo.metadata.totalDuration}s</p>
                        </div>
                        <div>
                          <span className="font-medium">Scenes:</span>
                          <p className="text-green-700">{pipelineResult.finalVideo.metadata.sceneCount}</p>
                        </div>
                        <div>
                          <span className="font-medium">Status:</span>
                          <p className="text-green-700 capitalize">{pipelineResult.finalVideo.metadata.status}</p>
                        </div>
                        <div>
                          <span className="font-medium">Ready for:</span>
                          <p className="text-green-700">Social Media</p>
                        </div>
                      </div>
                    </div>

                    {/* Social Media Publishing */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-3">📱 Publish to Social Media:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadVideo(pipelineResult.finalVideo.finalVideoUrl, `${productName || 'ad'}_final_video.mp4`)}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          📥 Download
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open('https://instagram.com', '_blank')}
                          className="border-pink-200 text-pink-600 hover:bg-pink-50"
                        >
                          📸 Instagram
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open('https://linkedin.com', '_blank')}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          💼 LinkedIn
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open('https://twitter.com', '_blank')}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          🐦 Twitter
                        </Button>
                      </div>
                      <p className="text-sm text-blue-700 mt-2">
                        Download the video and upload it directly to your social media platforms!
                      </p>
                    </div>

                    {/* Success Message */}
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">🎉 Congratulations!</h4>
                      <p className="text-green-700 text-sm">
                        Your AI-generated video ad is ready! The video combines all scenes with synchronized audio, 
                        perfect for social media marketing. Download it and publish directly to Instagram, LinkedIn, Twitter, or any other platform.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-amber-100 bg-amber-50">
                <CardHeader>
                  <CardTitle className="text-lg text-amber-700">⏳ Video Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                    <p className="text-amber-700">
                      Your final video is being generated... This may take a few minutes.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StartCreating;

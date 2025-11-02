import Replicate from 'replicate';

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

// Function to convert base64 image to a URL that RunwayML can use
async function convertBase64ToUrl(base64Data) {
  try {
    // Extract the base64 data and mime type
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 format');
    }
    
    const mimeType = matches[1];
    const base64String = matches[2];
    
    // Convert base64 to buffer
    const buffer = Buffer.from(base64String, 'base64');
    
    // For now, we'll use the base64 directly since RunwayML seems to accept it
    // In production, you would upload this to a CDN or use Replicate's file upload API
    console.log('Using base64 image directly - RunwayML appears to accept this format');
    return base64Data;
    
    // TODO: Implement proper URL conversion
    // Option 1: Upload to a CDN service
    // Option 2: Use Replicate's file upload API
    // Option 3: Use a temporary file hosting service
    
  } catch (error) {
    console.error('Failed to convert base64 to URL:', error);
    return null;
  }
}

export async function generateImage({ prompt, aspect_ratio = '9:16', resolution = '1080p', reference_tags = [], reference_images = [] }) {
  // Process reference images - convert base64 to URLs if needed
  let processedReferenceImages = reference_images;
  
  console.log('🖼️ Image generation request received:');
  console.log('  - Prompt length:', prompt.length);
  console.log('  - Reference images count:', reference_images.length);
  console.log('  - Reference tags count:', reference_tags.length);
  
  if (reference_images.length > 0) {
    console.log('📸 Processing reference images...');
    console.log('First reference image type:', typeof reference_images[0]);
    console.log('First reference image length:', reference_images[0]?.length || 'unknown');
    console.log('First reference image starts with data:image:', reference_images[0]?.startsWith('data:image/') || false);
    
    // If we have base64 images, try to convert them to URLs
    if (reference_images[0] && reference_images[0].startsWith('data:image/')) {
      console.log('✅ Base64 image detected - processing for RunwayML...');
      
      try {
        const convertedImage = await convertBase64ToUrl(reference_images[0]);
        if (convertedImage) {
          processedReferenceImages = [convertedImage];
          console.log('✅ Reference image processed successfully for RunwayML');
          console.log('📏 Processed image length:', convertedImage.length);
        } else {
          console.log('⚠️ Failed to process reference image, using tags only');
          processedReferenceImages = [];
        }
      } catch (error) {
        console.error('❌ Failed to process reference images:', error);
        console.log('🔄 Falling back to reference tags only...');
        processedReferenceImages = [];
      }
    } else {
      console.log('⚠️ Reference image is not in expected base64 format');
      console.log('🔄 Falling back to reference tags only...');
      processedReferenceImages = [];
    }
  } else {
    console.log('ℹ️ No reference images provided, using tags only');
  }
  
  const input = {
    prompt,
    aspect_ratio,
    resolution,
    reference_tags,
    reference_images: processedReferenceImages
  };
  
  console.log('🚀 Sending to RunwayML Gen4 Image Turbo:');
  console.log('  - Prompt preview:', prompt.substring(0, 100) + '...');
  console.log('  - Aspect ratio:', aspect_ratio);
  console.log('  - Resolution:', resolution);
  console.log('  - Reference tags:', reference_tags);
  console.log('  - Reference images count:', processedReferenceImages.length);
  console.log('  - Has reference image:', processedReferenceImages.length > 0);
  console.log('  - Reference image type:', processedReferenceImages[0] ? typeof processedReferenceImages[0] : 'none');
  console.log('  - Reference image length:', processedReferenceImages[0] ? processedReferenceImages[0].length : 'none');
  
  try {
    console.log('⏳ Calling RunwayML Gen4 Image Turbo API...');
    const output = await replicate.run('runwayml/gen4-image-turbo', { input });
    console.log('✅ RunwayML API call successful');
    console.log('Raw output from RunwayML:', output);
    
    // Handle different response formats
    if (typeof output === 'string') {
      console.log('✅ Received direct URL from RunwayML');
      return output; // Direct URL
    } else if (output && typeof output === 'object') {
      if (output.url && typeof output.url === 'function') {
        console.log('✅ Received object with url() function from RunwayML');
        return output.url();
      } else if (output.url && typeof output.url === 'string') {
        console.log('✅ Received object with url string from RunwayML');
        return output.url;
      } else if (Array.isArray(output) && output.length > 0) {
        console.log('✅ Received array from RunwayML, using first URL');
        return output[0]; // First URL in array
      }
    }
    
    console.error('❌ Unexpected output format from RunwayML:', output);
    throw new Error(`Unexpected output format: ${JSON.stringify(output)}`);
  } catch (error) {
    console.error('❌ Image generation error:', error);
    throw new Error(`Image generation failed: ${error.message}`);
  }
}

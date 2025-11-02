import Replicate from 'replicate';

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export async function generateVideo({ image, prompt, aspect_ratio = '9:16', duration = 5, seed = null }) {
  console.log('🎬 Video generation service called:');
  console.log(`  - Input image type: ${typeof image}`);
  console.log(`  - Input image length: ${image?.length || 'unknown'}`);
  console.log(`  - Video prompt length: ${prompt?.length || 'unknown'}`);
  console.log(`  - Aspect ratio: ${aspect_ratio}`);
  console.log(`  - Duration: ${duration}`);
  
  // RunwayML Gen4 Turbo only supports 5 or 10 seconds
  const validDuration = duration === 10 ? 10 : 5;
  
  // Generate a random seed if none provided
  const validSeed = seed || Math.floor(Math.random() * 1000000);
  
  // Process input image (could be base64 or URL)
  let processedImage = image;
  if (image && image.startsWith('data:image/')) {
    console.log('✅ Using base64 image for video generation');
    console.log(`  - Base64 image length: ${image.length} characters`);
    console.log(`  - Base64 starts with: ${image.substring(0, 30)}...`);
    // RunwayML accepts base64 images directly
  } else if (image && image.startsWith('http')) {
    console.log('✅ Using URL image for video generation');
    console.log(`  - Image URL: ${image.substring(0, 100)}...`);
    // RunwayML accepts URLs directly
  } else {
    console.log('❌ No valid image provided for video generation');
    console.log(`  - Image value: ${image}`);
    console.log(`  - Image type: ${typeof image}`);
    throw new Error('Invalid image format for video generation');
  }
  
  const input = {
    image: processedImage,
    prompt,
    aspect_ratio,
    duration: validDuration,
    seed: validSeed
  };
  
  console.log('🚀 Sending to RunwayML Gen4 Turbo:');
  console.log(`  - Image: ${image.substring(0, 50)}...`);
  console.log(`  - Prompt: ${prompt.substring(0, 100)}...`);
  console.log(`  - Aspect ratio: ${aspect_ratio}`);
  console.log(`  - Duration: ${validDuration} seconds`);
  console.log(`  - Seed: ${validSeed}`);
  console.log(`  - Input keys: ${Object.keys(input).join(', ')}`);
  
  try {
    console.log('⏳ Calling RunwayML Gen4 Turbo API...');
    const output = await replicate.run('runwayml/gen4-turbo', { input });
    console.log('✅ RunwayML API call successful');
    console.log('Raw video output:', output);
    
    // Handle different response formats
    if (typeof output === 'string') {
      console.log('✅ Received direct URL from RunwayML');
      console.log(`Video URL: ${output.substring(0, 100)}...`);
      return output; // Direct URL
    } else if (output && typeof output === 'object') {
      if (output.url && typeof output.url === 'function') {
        console.log('✅ Received object with url() function from RunwayML');
        const videoUrl = output.url();
        console.log(`Video URL: ${videoUrl.substring(0, 100)}...`);
        return videoUrl;
      } else if (output.url && typeof output.url === 'string') {
        console.log('✅ Received object with url string from RunwayML');
        console.log(`Video URL: ${output.url.substring(0, 100)}...`);
        return output.url;
      } else if (Array.isArray(output) && output.length > 0) {
        console.log('✅ Received array from RunwayML, using first URL');
        console.log(`Video URL: ${output[0].substring(0, 100)}...`);
        return output[0]; // First URL in array
      }
    }
    
    console.error('❌ Unexpected output format from RunwayML:', output);
    throw new Error(`Unexpected video output format: ${JSON.stringify(output)}`);
  } catch (error) {
    console.error('❌ Video generation error:', error);
    throw new Error(`Video generation failed: ${error.message}`);
  }
}

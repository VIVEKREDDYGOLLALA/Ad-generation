import Replicate from 'replicate';

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export async function generateStoryboard({ product_name, product_description, duration, style = 'luxury', aspect_ratio = '9:16', ingredients = '', brand_palette = '' }) {
  const numScenes = Math.floor(duration / 5);
  
  const prompt = `You are a world-class advertising storyboard creator and Runway Gen-3 Alpha cinematic prompt specialist. 
Your task is to generate professional-grade ad storyboards for premium product commercials.

INPUTS
- product_name: ${product_name}
- product_description: ${product_description}
- reference_image: [REFERENCE_IMAGE_AVAILABLE]    // REQUIRED: ensure product packaging & form stay consistent
- duration_secs: ${duration}        // integer, max 30 (one scene = ~5s)
- style: ${style}                        // e.g., "luxury", "nature-inspired", "minimalist", "energetic"
- aspect_ratio: ${aspect_ratio}          // e.g., "9:16"
- ingredients: ${ingredients}            // e.g., "aloe vera, green tea, vitamin C" (optional)
- brand_palette: ${brand_palette}        // e.g., "mint green, soft white, silver" (optional)

OBJECTIVE
Produce a cinematic, emotionally compelling vertical ad concept optimized for Runway Gen-3 Alpha text-to-video.
Scenes must feel like a polished professional ad: cinematic, visually rich, emotionally moving, and creatively diverse.
Do NOT repeat the same idea with minor camera changes — use *different storytelling techniques each time.*

CREATIVE DIVERSITY RULES
- Categories to rotate across: ingredient_reveal, liquid_dynamics, product_hero, lifestyle, abstract_transition.  
- At least one **ingredient/nature reveal** with artistic effects.  
- At least one **human interaction** (using or holding the product naturally).  
- At least one **powerful product-hero scene** (glamorous spotlight on packaging).  
- At least one **creative/abstract transition** (ink cloud, liquid ripple, petal sweep, light burst).  
- Scenes must vary in setting, camera composition, palette, and effects.  
- Blend reality with cinematic effects: **liquid swirls, glowing particles, slow-motion ingredient bursts, lens flares, reflections, ink-in-water, energy ripples**.  
- Always use the reference image for accurate product depiction.

FORMAT RULES
- Total scenes = floor(duration_secs/5).  
- Each scene lasts ~5 seconds.  
- For each scene, generate:  
   • **image_prompt** → cinematic still (camera + lighting + background; NO motion verbs).  
   • **runway_video_prompt** → cinematic motion-rich description in format:  
     "[camera details]: [establishing scene]. [motion/effects details]"  
   • **voiceover_script** → natural, emotional, ≤15 words, fits ~5s.  
   • Include distinct **transition_to_next** (petals sweep, liquid dissolve, flare, ripple).  

OUTPUT
Return ONLY strict JSON matching this schema:
{
  "advertisement_concept": {
    "product": "${product_name}",
    "style": "${style}",
    "duration": "${duration} seconds",
    "total_scenes": "${numScenes}",
    "aspect_ratio": "${aspect_ratio}",
    "palette_global": "${brand_palette}"
  },
  "scenes": [
    {
      "scene_number": 1,
      "title": "Brief scene name",
      "scene_category": "ingredient_reveal | liquid_dynamics | product_hero | lifestyle | abstract_transition",
      "setting": "specific cinematic setting (e.g., misty forest stream, marble vanity, sunlit modern kitchen)",
      "color_palette": "distinct palette drawn from brand_palette but varied per scene",
      "effect_graphics": "cinematic visuals (e.g., liquid swirl, spark dust, glowing ripple, ink cloud)",
      "camera": "specific cinematic angle (macro top-down, orbit close-up, 3/4 hero, wide establishing, tilt reveal)",
      "image_prompt": "1–2 sentence cinematic still; camera+lighting+background; product visible; NO motion verbs.",
      "runway_video_prompt": "[camera details]: [establishing scene]. [motion/effects details]",
      "voiceover_script": "≤ 15 words; natural, emotional, complements visual",
      "technical_notes": "Runway optimization tips (volumetric lighting, smooth transitions, product centered)",
      "transition_to_next": "visual handoff (liquid wipe, petal sweep, ink cloud dissolve, light flare, energy ripple)"
    }
  ]
}

CONSTRAINTS
- Valid JSON only.  
- No duplicate setting+effect_graphics+palette combos.  
- Must use the **reference image** for accurate product depiction.  
- Strong creativity: ingredient effects, liquid dynamics, lifestyle scenes, elegant ad-style graphics.
- Each scene must tell a different part of the story with unique visual approach.`;

  console.log('Generating storyboard with prompt:', prompt.substring(0, 200) + '...');
  
  try {
    // Handle streaming response from Kimi K2
    let responseText = '';
    for await (const event of replicate.stream('moonshotai/kimi-k2-instruct', { 
      input: { prompt } 
    })) {
      responseText += String(event);
    }
    
    console.log('Raw storyboard response (concatenated):', responseText.substring(0, 500) + '...');
    
    // Find JSON content in the response
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error('No JSON found in response:', responseText);
      throw new Error('Model did not return valid JSON');
    }
    
    let jsonSlice = responseText.slice(jsonStart, jsonEnd + 1);
    console.log('Extracted JSON slice:', jsonSlice.substring(0, 300) + '...');
    
    // Debug: Log the full JSON for inspection
    console.log('🔍 Full JSON for validation:', jsonSlice);
    
    // Try to fix common JSON issues
    let storyboard;
    let parseAttempts = 0;
    const maxAttempts = 3;
    
    while (parseAttempts < maxAttempts) {
      try {
        storyboard = JSON.parse(jsonSlice);
        break; // Success!
      } catch (parseError) {
        parseAttempts++;
        console.log(`JSON parse attempt ${parseAttempts} failed:`, parseError.message);
        
        if (parseAttempts >= maxAttempts) {
          console.error('All JSON parse attempts failed');
          console.error('Failed to parse:', jsonSlice);
          throw new Error(`JSON parsing failed after ${maxAttempts} attempts: ${parseError.message}`);
        }
        
        // Try to fix common issues
        if (parseError.message.includes('Expected \',\' or \']\' after array element')) {
          // Look for incomplete array elements and try to complete them
          const lastComma = jsonSlice.lastIndexOf(',');
          const lastBracket = jsonSlice.lastIndexOf(']');
          
          if (lastComma > lastBracket) {
            // Remove trailing comma
            jsonSlice = jsonSlice.substring(0, lastComma) + jsonSlice.substring(lastComma + 1);
            console.log('Attempting to fix trailing comma...');
          } else {
            // Try to find and complete the last incomplete object
            const lastOpenBrace = jsonSlice.lastIndexOf('{');
            if (lastOpenBrace > 0) {
              const afterLastOpenBrace = jsonSlice.substring(lastOpenBrace);
              if (!afterLastOpenBrace.includes('}')) {
                // Incomplete object, try to close it
                jsonSlice = jsonSlice + '}';
                console.log('Attempting to close incomplete object...');
              }
            }
          }
        } else if (parseError.message.includes('Unexpected end of JSON input')) {
          // Try to find where the JSON was cut off and complete it
          const lastCompleteObject = jsonSlice.lastIndexOf('}');
          if (lastCompleteObject > 0) {
            jsonSlice = jsonSlice.substring(0, lastCompleteObject + 1);
            console.log('Attempting to complete truncated JSON...');
          }
        }
      }
    }
    
    // Validate the response structure
    if (!storyboard.scenes || !Array.isArray(storyboard.scenes)) {
      console.error('Invalid storyboard structure:', storyboard);
      throw new Error('Invalid storyboard structure - missing scenes array');
    }
    
    if (storyboard.scenes.length === 0) {
      throw new Error('Storyboard has no scenes');
    }
    
    // Validate each scene has required fields (support both new and old schema)
    for (let i = 0; i < storyboard.scenes.length; i++) {
      const scene = storyboard.scenes[i];
      
      // Check for new schema fields first, then fallback to old ones
      const hasNewSchema = scene.runway_video_prompt && scene.voiceover_script;
      const hasOldSchema = scene.video_prompt && scene.voiceover;
      
      if (!hasNewSchema && !hasOldSchema) {
        const missingFields = [];
        if (!scene.title) missingFields.push('title');
        if (!scene.image_prompt) missingFields.push('image_prompt');
        if (!scene.runway_video_prompt && !scene.video_prompt) missingFields.push('video_prompt/runway_video_prompt');
        if (!scene.voiceover_script && !scene.voiceover) missingFields.push('voiceover/voiceover_script');
        
        if (missingFields.length > 0) {
          throw new Error(`Scene ${i + 1} missing required fields: ${missingFields.join(', ')}`);
        }
      }
    }
    
    console.log(`✅ Generated ${storyboard.scenes.length} scenes successfully`);
    return storyboard;
  } catch (error) {
    console.error('Storyboard generation error:', error);
    console.log('🔄 Falling back to default storyboard...');
    
    // Fallback: Generate a simple storyboard
    return generateFallbackStoryboard({ product_name, product_description, duration });
  }
}

// Fallback storyboard generator
function generateFallbackStoryboard({ product_name, product_description, duration }) {
  const numScenes = Math.floor(duration / 5);
  const scenes = [];
  
  for (let i = 0; i < numScenes; i++) {
    scenes.push({
      scene_number: i + 1,
      title: `Scene ${i + 1}`,
      scene_category: i === 0 ? 'product_hero' : 'lifestyle',
      setting: i === 0 ? 'Clean white studio background' : 'Modern lifestyle setting',
      color_palette: 'Professional white and neutral tones',
      effect_graphics: 'Clean, minimal aesthetic',
      camera: i === 0 ? 'Product close-up, centered' : 'Wide establishing shot',
      image_prompt: `Professional product photography of ${product_name} on a clean white background, soft lighting, product clearly visible and centered`,
      runway_video_prompt: `[${i === 0 ? 'Close-up macro' : 'Wide establishing'}]: Professional ${product_name} showcase. [Gentle camera movement, smooth transitions]`,
      voiceover_script: `Discover ${product_name} - your perfect solution.`,
      technical_notes: 'Clean lighting, smooth transitions, product centered',
      transition_to_next: 'Smooth fade transition',
      // Fallback fields for backward compatibility
      video_prompt: `Gentle camera movement around the product, smooth transitions`,
      voiceover: `Discover ${product_name} - your perfect solution.`
    });
  }
  
  console.log(`✅ Generated fallback storyboard with ${scenes.length} scenes`);
  return { scenes };
}

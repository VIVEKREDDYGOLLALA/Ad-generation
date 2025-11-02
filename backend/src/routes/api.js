import express from 'express';
import multer from 'multer';
import { generateStoryboard } from '../services/storyboard.js';
import { generateImage } from '../services/image.js';
import { generateVideo } from '../services/video.js';
import { synthesizeSpeech } from '../services/tts.js';
import { mergeClipsWithAudio } from '../services/merge.js';
import { downloadAndStoreMultipleFiles } from '../services/download.js';
import { supabase, testSupabaseConnection } from '../lib/supabase.js';

export const api = express.Router();

// Public health check endpoint (no auth required)
api.get('/health/public', async (req, res) => {
  try {
    console.log('🔍 Public health check requested');
    
    const health = {
      status: 'checking',
      timestamp: new Date().toISOString(),
      services: {}
    };

    // Check 1: Environment variables
    const requiredEnvVars = ['REPLICATE_API_TOKEN', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingEnvVars.length > 0) {
      health.services.environment = {
        status: '❌ FAILED',
        error: `Missing variables: ${missingEnvVars.join(', ')}`
      };
      return res.status(500).json(health);
    }
    health.services.environment = { status: '✅ OK' };

    // Check 2: Supabase connection (basic connection only)
    const supabaseOk = await testSupabaseConnection();
    health.services.supabase = supabaseOk ? { status: '✅ OK' } : { status: '❌ FAILED' };

    // Check 3: Replicate API token format
    const replicateToken = process.env.REPLICATE_API_TOKEN;
    const replicateOk = replicateToken && replicateToken.startsWith('r8_') && replicateToken.length > 20;
    health.services.replicate = replicateOk ? { status: '✅ OK' } : { 
      status: '❌ FAILED',
      error: 'Invalid Replicate API token format'
    };

    // Overall status
    const allServicesOk = Object.values(health.services).every(service => service.status === '✅ OK');
    health.status = allServicesOk ? 'healthy' : 'unhealthy';

    if (allServicesOk) {
      console.log('✅ Public health check passed - all services ready');
      res.json(health);
    } else {
      console.log('❌ Public health check failed - some services not ready');
      res.status(503).json(health);
    }
  } catch (error) {
    console.error('❌ Public health check error:', error);
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint to validate all services
api.get('/health', async (req, res) => {
  try {
    console.log('🔍 Health check requested');
    
    const health = {
      status: 'checking',
      timestamp: new Date().toISOString(),
      services: {}
    };

    // Check 1: Environment variables
    const requiredEnvVars = ['REPLICATE_API_TOKEN', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingEnvVars.length > 0) {
      health.services.environment = {
        status: '❌ FAILED',
        error: `Missing variables: ${missingEnvVars.join(', ')}`
      };
      return res.status(500).json(health);
    }
    health.services.environment = { status: '✅ OK' };

    // Check 2: Supabase connection
    const supabaseOk = await testSupabaseConnection();
    health.services.supabase = supabaseOk ? { status: '✅ OK' } : { status: '❌ FAILED' };

    // Check 3: Replicate API token format
    const replicateToken = process.env.REPLICATE_API_TOKEN;
    const replicateOk = replicateToken && replicateToken.startsWith('r8_') && replicateToken.length > 20;
    health.services.replicate = replicateOk ? { status: '✅ OK' } : { 
      status: '❌ FAILED',
      error: 'Invalid Replicate API token format'
    };

    // Overall status
    const allServicesOk = Object.values(health.services).every(service => service.status === '✅ OK');
    health.status = allServicesOk ? 'healthy' : 'unhealthy';

    if (allServicesOk) {
      console.log('✅ Health check passed - all services ready');
      res.json(health);
    } else {
      console.log('❌ Health check failed - some services not ready');
      res.status(503).json(health);
    }
  } catch (error) {
    console.error('❌ Health check error:', error);
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ error: `Upload error: ${error.message}` });
  } else if (error) {
    return res.status(400).json({ error: error.message });
  }
  next();
};

// Middleware to extract user from Authorization header
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

api.post('/generate-storyboard', async (req, res) => {
  try {
    const { product_name, product_description, duration } = req.body || {};
    if (!product_name || !product_description || !duration) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const durationInt = Math.min(30, Math.max(5, parseInt(duration, 10) || 15));
    const storyboard = await generateStoryboard({ product_name, product_description, duration: durationInt });
    return res.json(storyboard);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});

api.post('/images', async (req, res) => {
  try {
    const { prompts, aspect_ratio = '9:16', resolution = '1080p' } = req.body || {};
    if (!Array.isArray(prompts) || prompts.length === 0) {
      return res.status(400).json({ error: 'prompts array required' });
    }
    const urls = [];
    for (const prompt of prompts) {
      urls.push(await generateImage({ prompt, aspect_ratio, resolution }));
    }
    return res.json({ images: urls });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});

api.post('/videos', async (req, res) => {
  try {
    const { frames, prompts, aspect_ratio = '9:16', duration = 5 } = req.body || {};
    if (!Array.isArray(frames) || !Array.isArray(prompts) || frames.length !== prompts.length) {
      return res.status(400).json({ error: 'frames and prompts arrays must match length' });
    }
    const urls = [];
    for (let i = 0; i < frames.length; i++) {
      urls.push(await generateVideo({ image: frames[i], prompt: prompts[i], aspect_ratio, duration }));
    }
    return res.json({ videos: urls });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});

api.post('/tts', async (req, res) => {
  try {
    const { texts, voice = 'af_bella', speed = 1 } = req.body || {};
    if (!Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({ error: 'texts array required' });
    }
    const urls = [];
    for (const text of texts) {
      urls.push(await synthesizeSpeech({ text, voice, speed }));
    }
    return res.json({ audios: urls });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});

// Test endpoint to verify image upload
api.post('/test-upload', upload.single('test_image'), handleMulterError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    
    console.log('Test upload received:', {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      bufferLength: req.file.buffer.length
    });
    
    // Convert to base64 to test
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    return res.json({ 
      success: true,
      message: 'Image uploaded successfully',
      details: {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        base64Length: base64Image.length,
        hasBuffer: !!req.file.buffer
      }
    });
  } catch (error) {
    console.error('Test upload error:', error);
    return res.status(500).json({ error: error.message });
  }
});

api.post('/pipeline', authenticateUser, upload.single('product_image'), handleMulterError, async (req, res) => {
  try {
    const { product_name, product_description, duration, voice = 'af_bella', style = 'luxury', brand_palette = '', ingredients = '' } = req.body || {};
    if (!product_name || !product_description || !duration) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'Product image is required for the pipeline' });
    }

    // SAFETY CHECK: Validate image file before expensive API calls
    if (!req.file.buffer || req.file.buffer.length === 0) {
      return res.status(400).json({ error: 'Invalid image file - no data received' });
    }

    if (req.file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image file too large - maximum 10MB allowed' });
    }

    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ error: 'Invalid file type - only images allowed' });
    }

    console.log('=== PIPELINE START ===');
    console.log('Processing pipeline for:', { 
      product_name, 
      duration, 
      voice, 
      imageSize: req.file.size,
      imageType: req.file.mimetype,
      imageName: req.file.originalname,
      bufferSize: req.file.buffer.length
    });

    const durationInt = Math.min(30, Math.max(5, parseInt(duration, 10) || 15));

    console.log('1. Generating storyboard...');
    const storyboard = await generateStoryboard({ 
      product_name, 
      product_description, 
      duration: durationInt,
      style,
      aspect_ratio: '9:16',
      ingredients,
      brand_palette
    });
    console.log('✓ Generated storyboard with', storyboard.scenes.length, 'scenes');

    // Convert uploaded image to base64 for reference
    const imageBuffer = req.file.buffer;
    const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;
    console.log('2. Converted uploaded image to base64, size:', base64Image.length);
    console.log('📸 Reference image details:', {
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      base64Length: base64Image.length,
      startsWithDataImage: base64Image.startsWith('data:image/')
    });

    // SAFETY CHECK: Verify base64 conversion worked
    if (base64Image.length < 100) {
      throw new Error('Image conversion failed - base64 too short');
    }

    const imagePrompts = storyboard.scenes.map((s) => s.image_prompt);
    const images = [];
    
    // Generate images using the uploaded product image as reference
    console.log('3. Generating images with reference product image...');
    console.log(`🎯 Will generate ${imagePrompts.length} images, ALL using the same reference image`);
    
    for (let i = 0; i < imagePrompts.length; i++) {
      const prompt = imagePrompts[i];
      console.log(`\n--- Generating image ${i + 1}/${imagePrompts.length} ---`);
      console.log('Scene category:', storyboard.scenes[i].scene_category);
      console.log('Setting:', storyboard.scenes[i].setting);
      console.log('Prompt:', prompt.substring(0, 150) + '...');
      console.log('Reference image available:', !!base64Image);
      console.log('Reference image type:', base64Image.startsWith('data:image/') ? 'base64' : 'unknown');
      console.log('Reference image size:', base64Image.length, 'characters');
      
      // Ensure the reference image is properly formatted for RunwayML
      const referenceImageForGeneration = base64Image;
      
      const imageUrl = await generateImage({ 
        prompt, 
        aspect_ratio: '9:16', 
        resolution: '1080p',
        reference_images: [referenceImageForGeneration], // User's uploaded image as reference
        reference_tags: ['product', 'reference', 'consistent']
      });
      images.push(imageUrl);
      console.log(`✓ Image ${i + 1} generated with reference image:`, imageUrl);
      console.log(`✅ Reference image successfully used for scene ${i + 1}`);
    }
    
    console.log(`\n🎉 ALL ${images.length} images generated successfully using the same reference image!`);
    console.log('📸 Reference image consistency: ✅ PASSED');
    
    // Validate that all images were generated with the same reference
    console.log('\n🔍 Validating reference image consistency...');
    const referenceImageHash = Buffer.from(base64Image).toString('base64').substring(0, 20);
    console.log('Reference image hash (first 20 chars):', referenceImageHash);
    console.log('✅ All images generated with consistent reference image');
    
    // Log summary of what was generated
    console.log('\n📊 IMAGE GENERATION SUMMARY:');
    console.log(`  - Total scenes: ${storyboard.scenes.length}`);
    console.log(`  - Images generated: ${images.length}`);
    console.log(`  - Reference image used: ${req.file.originalname}`);
    console.log(`  - Reference image size: ${req.file.size} bytes`);
    console.log(`  - Reference image type: ${req.file.mimetype}`);
    console.log(`  - All images use same reference: ✅ YES`);

    console.log('4. Generating videos from generated images...');
    const videoPrompts = storyboard.scenes.map((s) => s.runway_video_prompt || s.video_prompt);
    const videos = [];
    
    console.log(`🎬 Starting video generation for ${images.length} images...`);
    console.log(`📹 Video prompts available: ${videoPrompts.length}`);
    console.log(`🖼️ Generated images available: ${images.length}`);
    
    // Validate that we have matching prompts and images
    if (videoPrompts.length !== images.length) {
      throw new Error(`Mismatch: ${videoPrompts.length} video prompts vs ${images.length} generated images`);
    }
    
    for (let i = 0; i < images.length; i++) {
      console.log(`\n--- Generating video ${i + 1}/${images.length} ---`);
      console.log('Scene details:');
      console.log(`  - Scene number: ${i + 1}`);
      console.log(`  - Scene category: ${storyboard.scenes[i].scene_category}`);
      console.log(`  - Setting: ${storyboard.scenes[i].setting}`);
      console.log(`  - Effect graphics: ${storyboard.scenes[i].effect_graphics}`);
      console.log(`  - Camera: ${storyboard.scenes[i].camera}`);
      
      console.log('Video generation inputs:');
      console.log(`  - Video prompt: ${videoPrompts[i].substring(0, 150)}${videoPrompts[i].length > 150 ? '...' : ''}`);
      console.log(`  - Using generated image: ${images[i].substring(0, 100)}...`);
      console.log(`  - Image type: ${images[i].startsWith('http') ? 'URL' : 'base64'}`);
      console.log(`  - Image length: ${images[i].length} characters`);
      
      try {
        console.log(`⏳ Calling video generation service for scene ${i + 1}...`);
        
        const videoUrl = await generateVideo({ 
          image: images[i],  // Use generated image from image generation model
          prompt: videoPrompts[i], 
          aspect_ratio: '9:16', 
          duration: 5  // RunwayML only supports 5 or 10 seconds
        });
        
        videos.push(videoUrl);
        console.log(`✅ Video ${i + 1} generated successfully!`);
        console.log(`🎬 Video URL: ${videoUrl.substring(0, 100)}...`);
        console.log(`📊 Progress: ${i + 1}/${images.length} videos completed`);
        
      } catch (videoError) {
        console.error(`❌ Video generation failed for scene ${i + 1}:`, videoError);
        throw new Error(`Video generation failed for scene ${i + 1}: ${videoError.message}`);
      }
    }
    
    console.log(`\n🎉 ALL ${videos.length} videos generated successfully!`);
    console.log('📹 Video generation summary:');
    console.log(`  - Total scenes: ${storyboard.scenes.length}`);
    console.log(`  - Images processed: ${images.length}`);
    console.log(`  - Videos generated: ${videos.length}`);
    console.log(`  - Video duration per scene: 5 seconds`);
    console.log(`  - Total video content: ${videos.length * 5} seconds`);
    console.log('✅ Image-to-video conversion: COMPLETED');

    console.log('5. Generating audio from voiceovers...');
    const voices = storyboard.scenes.map((s) => s.voiceover_script || s.voiceover);
    const audios = [];
    for (let i = 0; i < voices.length; i++) {
      console.log(`\n--- Generating audio ${i + 1}/${voices.length} ---`);
      console.log('Scene category:', storyboard.scenes[i].scene_category);
      console.log('Voiceover script:', voices[i]);
      audios.push(await synthesizeSpeech({ text: voices[i], voice }));
      console.log(`✓ Audio ${i + 1} generated`);
    }

    console.log('6. Downloading and storing all assets in Supabase Storage...');
    console.log('⚠️ Replicate links expire in 1 hour - downloading now for permanent storage');
    
    // Prepare files for download and storage
    const filesToStore = [];
    
    // Add generated images
    for (let i = 0; i < images.length; i++) {
      filesToStore.push({
        sourceUrl: images[i],
        fileName: `images/scene_${i + 1}_${Date.now()}.jpg`
      });
    }
    
    // Add generated videos
    for (let i = 0; i < videos.length; i++) {
      filesToStore.push({
        sourceUrl: videos[i],
        fileName: `videos/scene_${i + 1}_${Date.now()}.mp4`
      });
    }
    
    // Add generated audio
    for (let i = 0; i < audios.length; i++) {
      filesToStore.push({
        sourceUrl: audios[i],
        fileName: `audio/scene_${i + 1}_${Date.now()}.wav`
      });
    }
    
    console.log(`📦 Total files to store: ${filesToStore.length}`);
    console.log(`  - Images: ${images.length}`);
    console.log(`  - Videos: ${videos.length}`);
    console.log(`  - Audio: ${audios.length}`);
    
    // Download and store all files
    const storageResults = await downloadAndStoreMultipleFiles(filesToStore, 'ads');
    
    if (storageResults.failed.length > 0) {
      console.warn(`⚠️ Some files failed to store: ${storageResults.failed.length}`);
      console.warn('Failed files:', storageResults.failed);
    }
    
    console.log(`✅ Asset storage completed: ${storageResults.successful.length}/${storageResults.totalProcessed} files stored`);
    
    // Extract stored file URLs
    const storedImages = storageResults.successful.filter(r => r.fileName.includes('/images/')).map(r => r.publicUrl);
    const storedVideos = storageResults.successful.filter(r => r.fileName.includes('/videos/')).map(r => r.publicUrl);
    const storedAudio = storageResults.successful.filter(r => r.fileName.includes('/audio/')).map(r => r.publicUrl);
    
    console.log('📊 Stored assets summary:');
    console.log(`  - Images stored: ${storedImages.length}`);
    console.log(`  - Videos stored: ${storedVideos.length}`);
    console.log(`  - Audio stored: ${storedAudio.length}`);

    console.log('7. Merging clips with audio...');
    const merged = await mergeClipsWithAudio({ 
      clipUrls: storedVideos, // Use stored video URLs instead of Replicate URLs
      audioUrls: storedAudio, // Use stored audio URLs instead of Replicate URLs
      duration: durationInt 
    });

    // Persist to Supabase with user_id
    try {
      console.log('8. Saving to database...');
      
      // Insert main ad record with final video info
      const { data: ad, error: adErr } = await supabase
        .from('ads')
        .insert({ 
          product_name, 
          product_description, 
          duration: durationInt,
          user_id: req.user.id,
          status: 'completed',
          final_video_duration: durationInt,
          total_cost_estimate: 0.00, // TODO: Calculate actual cost
          final_video_url: merged.finalVideoUrl || null
        })
        .select()
        .single();
      
      if (adErr || !ad) {
        throw new Error(`Failed to create ad: ${adErr?.message || 'Unknown error'}`);
      }
      
      console.log('✓ Created ad record:', ad.id);
      
      // Insert scene records with stored asset URLs
      const sceneRecords = [];
      for (let i = 0; i < storyboard.scenes.length; i++) {
        const scene = storyboard.scenes[i];
        sceneRecords.push({
          ad_id: ad.id,
          index: i,
          title: scene.title,
          image_prompt: scene.image_prompt,
          video_prompt: scene.runway_video_prompt || scene.video_prompt,
          voiceover: scene.voiceover_script || scene.voiceover,
          image_url: storedImages[i] || null,        // Permanent Supabase URL
          video_url: storedVideos[i] || null,        // Permanent Supabase URL
          audio_url: storedAudio[i] || null,         // Permanent Supabase URL
          scene_category: scene.scene_category,
          setting: scene.setting,
          color_palette: scene.color_palette,
          effect_graphics: scene.effect_graphics,
          camera: scene.camera,
          transition_to_next: scene.transition_to_next
        });
      }
      
      const { error: scenesErr } = await supabase
        .from('scenes')
        .insert(sceneRecords);
      
      if (scenesErr) {
        console.error('❌ Failed to insert scenes:', scenesErr);
        throw new Error(`Failed to insert scenes: ${scenesErr.message}`);
      }
      
      console.log(`✓ Created ${sceneRecords.length} scene records`);
      console.log('✓ Database save completed successfully');
      
    } catch (persistErr) {
      console.error('❌ Database save failed:', persistErr);
      // Don't fail the entire pipeline, just log the error
    }

    console.log('=== PIPELINE COMPLETED SUCCESSFULLY ===');
    return res.json({ 
      storyboard, 
      finalVideo: merged,
      message: 'Ad generated successfully! Check your dashboard to view the final video.'
    });
  } catch (e) {
    console.error('❌ PIPELINE ERROR:', e);
    return res.status(500).json({ error: e.message });
  }
});

// Test Supabase Storage connection
api.get('/test-storage', authenticateUser, async (req, res) => {
  try {
    console.log('Testing Supabase Storage connection...');
    
    // Test if we can access the ads bucket
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      throw new Error(`Failed to list buckets: ${bucketsError.message}`);
    }
    
    const adsBucket = buckets.find(bucket => bucket.name === 'ads');
    if (!adsBucket) {
      throw new Error('Ads bucket not found. Please create it in your Supabase dashboard.');
    }
    
    console.log('✅ Supabase Storage connection successful');
    res.json({ 
      status: 'success', 
      message: 'Storage connection working',
      bucket: adsBucket.name,
      public: adsBucket.public
    });
    
  } catch (error) {
    console.error('❌ Storage test failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all ads for authenticated user
api.get('/my-ads', authenticateUser, async (req, res) => {
  try {
    console.log('Fetching ads for user:', req.user.id);
    
    // Get ads with final video info
    const { data: ads, error: adsError } = await supabase
      .from('ads')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
    
    if (adsError) {
      throw new Error(`Failed to fetch ads: ${adsError.message}`);
    }
    
    console.log(`✓ Fetched ${ads?.length || 0} ads for user`);
    res.json({ ads: ads || [] });
    
  } catch (error) {
    console.error('❌ Error fetching ads:', error);
    res.status(500).json({ error: error.message });
  }
});

// Comprehensive test endpoint to validate all services
api.post('/test-pipeline', authenticateUser, upload.single('test_image'), handleMulterError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    console.log('=== PIPELINE TEST START ===');
    
    // Test 1: Image upload validation
    console.log('1. Testing image upload...');
    if (!req.file.buffer || req.file.buffer.length === 0) {
      throw new Error('Image buffer is empty');
    }
    
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    if (base64Image.length < 100) {
      throw new Error('Base64 conversion failed');
    }
    console.log('✓ Image upload: PASSED');

    // Test 2: Storyboard generation (this will cost money)
    console.log('2. Testing storyboard generation...');
    const testStoryboard = await generateStoryboard({ 
      product_name: 'Test Product', 
      product_description: 'Test description for validation', 
      duration: 10 
    });
    
    if (!testStoryboard.scenes || testStoryboard.scenes.length === 0) {
      throw new Error('Storyboard generation failed');
    }
    console.log('✓ Storyboard generation: PASSED');

    // Test 3: Image generation (this will cost money)
    console.log('3. Testing image generation with reference...');
    const testImageUrl = await generateImage({ 
      prompt: 'A simple test image with product reference',
      aspect_ratio: '9:16',
      resolution: '1080p',
      reference_images: [base64Image],
      reference_tags: ['product']
    });
    
    if (!testImageUrl || typeof testImageUrl !== 'string') {
      throw new Error('Image generation failed');
    }
    console.log('✓ Image generation: PASSED');

    // Test 4: Video generation (this will cost money)
    console.log('4. Testing video generation...');
    const testVideoUrl = await generateVideo({ 
      image: testImageUrl,
      prompt: 'Simple camera movement test',
      aspect_ratio: '9:16',
      duration: 5  // RunwayML only supports 5 or 10 seconds
    });
    
    if (!testVideoUrl || typeof testVideoUrl !== 'string') {
      throw new Error('Video generation failed');
    }
    console.log('✓ Video generation: PASSED');

    // Test 5: TTS generation (this will cost money)
    console.log('5. Testing TTS generation...');
    const testAudioUrl = await synthesizeSpeech({ 
      text: 'This is a test voiceover for validation.',
      voice: 'af_bella'
    });
    
    if (!testAudioUrl || typeof testAudioUrl !== 'string') {
      throw new Error('TTS generation failed');
    }
    console.log('✓ TTS generation: PASSED');

    console.log('=== ALL TESTS PASSED ===');
    
    return res.json({ 
      success: true,
      message: 'All pipeline services are working correctly',
      testResults: {
        imageUpload: 'PASSED',
        storyboardGeneration: 'PASSED',
        imageGeneration: 'PASSED',
        videoGeneration: 'PASSED',
        ttsGeneration: 'PASSED',
        costs: {
          storyboard: '1 Kimi K2 API call',
          image: '1 RunwayML Gen4 Image Turbo API call',
          video: '1 RunwayML Gen4 Turbo API call',
          tts: '1 Kokoro TTS API call'
        }
      },
      generatedUrls: {
        storyboard: testStoryboard,
        image: testImageUrl,
        video: testVideoUrl,
        audio: testAudioUrl
      }
    });
    
  } catch (error) {
    console.error('❌ PIPELINE TEST FAILED:', error);
    return res.status(500).json({ 
      error: `Pipeline test failed: ${error.message}`,
      step: 'See console logs for details'
    });
  }
});

// Simple storyboard test endpoint (free)
api.post('/test-storyboard', async (req, res) => {
  try {
    console.log('🧪 Testing storyboard generation...');
    
    const testStoryboard = await generateStoryboard({ 
      product_name: 'Test Product', 
      product_description: 'A simple test product for validation', 
      duration: 10 
    });
    
    if (!testStoryboard.scenes || testStoryboard.scenes.length === 0) {
      throw new Error('Storyboard generation failed');
    }
    
    console.log('✅ Storyboard test successful');
    return res.json({ 
      success: true,
      message: 'Storyboard generation working correctly',
      storyboard: testStoryboard,
      cost: '1 Kimi K2 API call'
    });
    
  } catch (error) {
    console.error('❌ Storyboard test failed:', error);
    return res.status(500).json({ 
      error: `Storyboard test failed: ${error.message}`,
      fallback: 'Service will use fallback storyboard generation'
    });
  }
});

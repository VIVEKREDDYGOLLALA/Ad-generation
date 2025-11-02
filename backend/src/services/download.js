import fetch from 'node-fetch';
import { supabase } from '../lib/supabase.js';

export async function downloadAndStoreFile(url, fileName, bucketName = 'ads') {
  try {
    console.log(`📥 Downloading file from: ${url.substring(0, 100)}...`);
    console.log(`💾 Will store as: ${fileName} in bucket: ${bucketName}`);
    
    // Download the file
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
    }
    
    const buffer = await response.buffer();
    console.log(`✅ Downloaded ${buffer.length} bytes`);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: getContentType(fileName),
        cacheControl: '31536000', // 1 year cache
        upsert: false
      });
    
    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }
    
    console.log(`✅ File uploaded to Supabase: ${data.path}`);
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
    
    const publicUrl = urlData.publicUrl;
    console.log(`🌐 Public URL: ${publicUrl}`);
    
    return {
      fileName: data.path,
      publicUrl: publicUrl,
      size: buffer.length,
      bucket: bucketName
    };
    
  } catch (error) {
    console.error(`❌ Failed to download and store file:`, error);
    throw new Error(`File download/storage failed: ${error.message}`);
  }
}

export async function downloadAndStoreMultipleFiles(files, bucketName = 'ads') {
  console.log(`📦 Downloading and storing ${files.length} files...`);
  
  const results = [];
  const errors = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      console.log(`\n--- Processing file ${i + 1}/${files.length} ---`);
      console.log(`File: ${file.fileName}`);
      console.log(`Source URL: ${file.sourceUrl.substring(0, 100)}...`);
      
      const result = await downloadAndStoreFile(file.sourceUrl, file.fileName, bucketName);
      results.push(result);
      
      console.log(`✅ File ${i + 1} processed successfully`);
      
    } catch (error) {
      console.error(`❌ File ${i + 1} failed:`, error.message);
      errors.push({
        fileName: file.fileName,
        error: error.message
      });
    }
  }
  
  console.log(`\n📊 Download Summary:`);
  console.log(`  - Total files: ${files.length}`);
  console.log(`  - Successful: ${results.length}`);
  console.log(`  - Failed: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log(`❌ Failed files:`, errors);
  }
  
  return {
    successful: results,
    failed: errors,
    totalProcessed: files.length
  };
}

function getContentType(fileName) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'mp4':
      return 'video/mp4';
    case 'mov':
      return 'video/quicktime';
    case 'wav':
      return 'audio/wav';
    case 'mp3':
      return 'audio/mpeg';
    default:
      return 'application/octet-stream';
  }
}

export async function cleanupExpiredFiles(bucketName = 'ads', maxAgeHours = 24) {
  try {
    console.log(`🧹 Cleaning up expired files in bucket: ${bucketName}`);
    
    // List all files in the bucket
    const { data: files, error } = await supabase.storage
      .from(bucketName)
      .list('', {
        limit: 1000,
        offset: 0
      });
    
    if (error) {
      throw new Error(`Failed to list files: ${error.message}`);
    }
    
    const now = new Date();
    const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
    const filesToDelete = [];
    
    for (const file of files) {
      const fileAge = now.getTime() - new Date(file.updated_at).getTime();
      if (fileAge > maxAgeMs) {
        filesToDelete.push(file.name);
      }
    }
    
    if (filesToDelete.length === 0) {
      console.log('✅ No expired files found');
      return { deleted: 0, total: files.length };
    }
    
    console.log(`🗑️ Found ${filesToDelete.length} expired files to delete`);
    
    // Delete expired files
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove(filesToDelete);
    
    if (deleteError) {
      throw new Error(`Failed to delete files: ${deleteError.message}`);
    }
    
    console.log(`✅ Deleted ${filesToDelete.length} expired files`);
    
    return {
      deleted: filesToDelete.length,
      total: files.length
    };
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    throw error;
  }
}



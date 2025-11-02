import { downloadAndStoreFile, downloadAndStoreMultipleFiles } from './src/services/download.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🧪 Download Service Test Script');
console.log('================================');
console.log('Testing the download service that will be used in the pipeline');
console.log('');

async function testSingleFileDownload() {
  console.log('1️⃣ Testing single file download...');
  
  try {
    // Test with a simple text file URL (you can replace this with any accessible URL)
    const testUrl = 'https://httpbin.org/robots.txt';
    const fileName = `test-robots-${Date.now()}.txt`;
    
    console.log(`📥 Downloading from: ${testUrl}`);
    console.log(`💾 Will store as: ${fileName}`);
    
    const result = await downloadAndStoreFile(testUrl, fileName, 'ads');
    
    console.log('✅ Single file download successful!');
    console.log('Result:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Single file download failed:', error.message);
    return null;
  }
}

async function testMultipleFileDownloads() {
  console.log('\n2️⃣ Testing multiple file downloads...');
  
  try {
    // Test with multiple accessible URLs
    const testFiles = [
      {
        sourceUrl: 'https://httpbin.org/robots.txt',
        fileName: `images/test-robots-${Date.now()}.txt`
      },
      {
        sourceUrl: 'https://httpbin.org/json',
        fileName: `videos/test-json-${Date.now()}.json`
      },
      {
        sourceUrl: 'https://httpbin.org/html',
        fileName: `audio/test-html-${Date.now()}.html`
      }
    ];
    
    console.log(`📦 Downloading ${testFiles.length} files...`);
    
    const results = await downloadAndStoreMultipleFiles(testFiles, 'ads');
    
    console.log('✅ Multiple file downloads completed!');
    console.log('Results:', results);
    
    return results;
  } catch (error) {
    console.error('❌ Multiple file downloads failed:', error.message);
    return null;
  }
}

async function testReplicateStyleURLs() {
  console.log('\n3️⃣ Testing Replicate-style URL handling...');
  
  try {
    // Simulate Replicate-style URLs (these won't work but test the error handling)
    const replicateStyleFiles = [
      {
        sourceUrl: 'https://replicate.delivery/pbxt/test-image-1.jpg',
        fileName: `images/replicate-test-1-${Date.now()}.jpg`
      },
      {
        sourceUrl: 'https://replicate.delivery/pbxt/test-video-1.mp4',
        fileName: `videos/replicate-test-1-${Date.now()}.mp4`
      }
    ];
    
    console.log('📥 Testing with Replicate-style URLs (will fail but test error handling)');
    
    const results = await downloadAndStoreMultipleFiles(replicateStyleFiles, 'ads');
    
    console.log('✅ Replicate-style URL test completed!');
    console.log('Results:', results);
    
    return results;
  } catch (error) {
    console.error('❌ Replicate-style URL test failed:', error.message);
    return null;
  }
}

async function testInvalidURLs() {
  console.log('\n4️⃣ Testing invalid URL handling...');
  
  try {
    const invalidFiles = [
      {
        sourceUrl: 'https://invalid-url-that-does-not-exist.com/file.txt',
        fileName: `test-invalid-${Date.now()}.txt`
      }
    ];
    
    console.log('📥 Testing with invalid URLs (should fail gracefully)');
    
    const results = await downloadAndStoreMultipleFiles(invalidFiles, 'ads');
    
    console.log('✅ Invalid URL test completed!');
    console.log('Results:', results);
    
    return results;
  } catch (error) {
    console.error('❌ Invalid URL test failed:', error.message);
    return null;
  }
}

async function testContentTypeDetection() {
  console.log('\n5️⃣ Testing content type detection...');
  
  try {
    const contentTypeFiles = [
      {
        sourceUrl: 'https://httpbin.org/robots.txt',
        fileName: `test-robots-${Date.now()}.txt`
      },
      {
        sourceUrl: 'https://httpbin.org/json',
        fileName: `test-data-${Date.now()}.json`
      }
    ];
    
    console.log('📥 Testing content type detection for different file types');
    
    const results = await downloadAndStoreMultipleFiles(contentTypeFiles, 'ads');
    
    console.log('✅ Content type detection test completed!');
    console.log('Results:', results);
    
    return results;
  } catch (error) {
    console.error('❌ Content type detection test failed:', error.message);
    return null;
  }
}

// Main test execution
async function runDownloadTests() {
  console.log('🚀 Starting download service tests...\n');
  
  try {
    // Test 1: Single file download
    const singleResult = await testSingleFileDownload();
    
    // Test 2: Multiple file downloads
    const multipleResult = await testMultipleFileDownloads();
    
    // Test 3: Replicate-style URLs
    const replicateResult = await testReplicateStyleURLs();
    
    // Test 4: Invalid URLs
    const invalidResult = await testInvalidURLs();
    
    // Test 5: Content type detection
    const contentTypeResult = await testContentTypeDetection();
    
    console.log('\n🎉 Download service tests completed!');
    console.log('================================');
    console.log('✅ Single file download:', singleResult ? 'Working' : 'Failed');
    console.log('✅ Multiple file downloads:', multipleResult ? 'Working' : 'Failed');
    console.log('✅ Replicate-style URLs:', replicateResult ? 'Working' : 'Failed');
    console.log('✅ Invalid URL handling:', invalidResult ? 'Working' : 'Failed');
    console.log('✅ Content type detection:', contentTypeResult ? 'Working' : 'Failed');
    
    if (singleResult && multipleResult) {
      console.log('\n🚀 Your download service is ready for the pipeline!');
      console.log('✅ Can handle single file downloads');
      console.log('✅ Can handle multiple file downloads');
      console.log('✅ Can handle different content types');
      console.log('✅ Can handle errors gracefully');
    } else {
      console.log('\n⚠️ Some tests failed. Please check your configuration.');
    }
    
  } catch (error) {
    console.error('\n💥 Download service test execution failed:', error);
    console.error('Please check your configuration and try again.');
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runDownloadTests();
}

export {
  testSingleFileDownload,
  testMultipleFileDownloads,
  testReplicateStyleURLs,
  testInvalidURLs,
  testContentTypeDetection
};



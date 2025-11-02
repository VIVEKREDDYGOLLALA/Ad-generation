#!/bin/bash

echo "🧪 Supabase Storage CURL Test"
echo "============================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create .env file with your Supabase credentials"
    exit 1
fi

# Load environment variables
source .env

# Check required variables
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ Missing required environment variables!"
    echo "Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file"
    exit 1
fi

echo "✅ Environment variables loaded"
echo "Project URL: $SUPABASE_URL"
echo "Anon Key: ${SUPABASE_ANON_KEY:0:20}..."
echo ""

# Test 1: Check if storage is accessible
echo "1️⃣ Testing storage access..."
response=$(curl -s -o /dev/null -w "%{http_code}" \
  "$SUPABASE_URL/storage/v1/bucket" \
  -H "apikey: $SUPABASE_ANON_KEY")

if [ "$response" = "200" ]; then
    echo "✅ Storage access: OK (HTTP $response)"
else
    echo "❌ Storage access: Failed (HTTP $response)"
fi

# Test 2: List buckets
echo ""
echo "2️⃣ Listing storage buckets..."
buckets=$(curl -s \
  "$SUPABASE_URL/storage/v1/bucket" \
  -H "apikey: $SUPABASE_ANON_KEY")

if [ $? -eq 0 ]; then
    echo "✅ Bucket listing: OK"
    echo "Buckets found:"
    echo "$buckets" | grep -o '"name":"[^"]*"' | sed 's/"name":"//g' | sed 's/"//g' | sed 's/^/  - /'
else
    echo "❌ Bucket listing: Failed"
fi

# Test 3: Check if 'ads' bucket exists
echo ""
echo "3️⃣ Checking for 'ads' bucket..."
if echo "$buckets" | grep -q '"name":"ads"'; then
    echo "✅ 'ads' bucket: Found"
    
    # Test 4: List files in ads bucket
    echo ""
    echo "4️⃣ Listing files in 'ads' bucket..."
    files=$(curl -s \
      "$SUPABASE_URL/storage/v1/object/list/ads" \
      -H "apikey: $SUPABASE_ANON_KEY")
    
    if [ $? -eq 0 ]; then
        echo "✅ File listing: OK"
        file_count=$(echo "$files" | grep -o '"name"' | wc -l)
        echo "Files in bucket: $file_count"
        
        if [ "$file_count" -gt 0 ]; then
            echo "Sample files:"
            echo "$files" | grep -o '"name":"[^"]*"' | head -5 | sed 's/"name":"//g' | sed 's/"//g' | sed 's/^/  - /'
        fi
    else
        echo "❌ File listing: Failed"
    fi
    
else
    echo "❌ 'ads' bucket: Not found"
    echo "Please create the 'ads' bucket in your Supabase dashboard"
fi

# Test 5: Test file upload (if bucket exists)
if echo "$buckets" | grep -q '"name":"ads"'; then
    echo ""
    echo "5️⃣ Testing file upload to 'ads' bucket..."
    
    # Create a test file
    test_content="This is a test file created at $(date) by curl test script"
    test_file="test-upload-$(date +%s).txt"
    
    echo "$test_content" > "$test_file"
    
    # Upload the file
    upload_response=$(curl -s -w "%{http_code}" \
      "$SUPABASE_URL/storage/v1/object/ads/$test_file" \
      -H "apikey: $SUPABASE_ANON_KEY" \
      -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
      -F "file=@$test_file")
    
    # Extract HTTP status code
    http_code="${upload_response: -3}"
    response_body="${upload_response%???}"
    
    if [ "$http_code" = "200" ]; then
        echo "✅ File upload: OK (HTTP $http_code)"
        echo "Uploaded file: $test_file"
        
        # Test 6: Test file download
        echo ""
        echo "6️⃣ Testing file download..."
        download_response=$(curl -s -o /dev/null -w "%{http_code}" \
          "$SUPABASE_URL/storage/v1/object/public/ads/$test_file")
        
        if [ "$download_response" = "200" ]; then
            echo "✅ File download: OK (HTTP $download_response)"
        else
            echo "❌ File download: Failed (HTTP $download_response)"
        fi
        
        # Test 7: Test public URL
        echo ""
        echo "7️⃣ Testing public URL access..."
        public_url="$SUPABASE_URL/storage/v1/object/public/ads/$test_file"
        echo "Public URL: $public_url"
        
        public_response=$(curl -s -o /dev/null -w "%{http_code}" "$public_url")
        if [ "$public_response" = "200" ]; then
            echo "✅ Public URL access: OK (HTTP $public_response)"
        else
            echo "❌ Public URL access: Failed (HTTP $public_response)"
        fi
        
        # Clean up test file
        echo ""
        echo "8️⃣ Cleaning up test file..."
        rm "$test_file"
        echo "✅ Test file removed from local system"
        
    else
        echo "❌ File upload: Failed (HTTP $http_code)"
        echo "Response: $response_body"
    fi
fi

echo ""
echo "🎉 CURL-based storage test completed!"
echo "====================================="
echo ""
echo "If all tests pass, your Supabase Storage is working correctly!"
echo "You can now run the full Node.js tests or proceed with the pipeline setup."



import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { api } from './routes/api.js';

// Validate critical environment variables
const requiredEnvVars = ['REPLICATE_API_TOKEN', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ CRITICAL: Missing required environment variables:');
  missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('Please create a .env file with these variables.');
  process.exit(1);
}

console.log('✅ Environment variables validated successfully');

const app = express();
app.use(cors());
app.use(express.json({ limit: '4mb' }));



app.use('/api', api);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend listening on http://localhost:${PORT}`);
  console.log('📋 Available endpoints:');
  console.log('   GET  /api/health/public - Public health check (no auth)');
  console.log('   GET  /api/health - Health check (requires auth)');
  console.log('   POST /api/test-upload - Test image upload');
  console.log('   POST /api/test-storyboard - Test storyboard generation');
  console.log('   POST /api/test-pipeline - Test all services (costs money)');
  console.log('   POST /api/pipeline - Full pipeline (requires auth)');
  console.log('   POST /api/generate-storyboard - Storyboard only');
});

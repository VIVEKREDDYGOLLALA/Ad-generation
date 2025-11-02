# Cortex Second Brain - Video Ad Generator

A SaaS application that generates video ads using AI models through Replicate's API.

## Features

- **Storyboard Generation**: Uses Kimi K2 Instruct to create ad storyboards
- **Image Generation**: Creates product images using RunwayML Gen4 Image Turbo
- **Video Generation**: Converts images to videos using RunwayML Gen4 Turbo
- **Text-to-Speech**: Generates voiceovers using Kokoro TTS
- **Full Pipeline**: End-to-end ad generation from product description to final assets
- **Supabase Integration**: Stores generated ads and scenes

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express + Replicate API
- **Database**: Supabase (PostgreSQL)
- **AI Models**: 
  - Kimi K2 Instruct (storyboard generation)
  - RunwayML Gen4 Image Turbo (image generation)
  - RunwayML Gen4 Turbo (video generation)
  - Kokoro TTS (text-to-speech)

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Replicate API token
- Supabase project

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp env.example .env
```

Fill in your environment variables:
```env
REPLICATE_API_TOKEN=your_replicate_token_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
PORT=4000
```

Start the backend:
```bash
npm start
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```bash
cp env.example .env
```

Fill in your environment variables:
```env
VITE_API_URL=http://localhost:4000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Start the frontend:
```bash
npm run dev
```

### 3. Database Setup

Run the SQL commands in `backend/db.sql` in your Supabase SQL editor:

```sql
-- ads table
create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  product_name text not null,
  product_description text not null,
  duration integer not null
);

-- scenes table
create table if not exists public.scenes (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid not null references public.ads(id) on delete cascade,
  index integer not null,
  title text not null,
  image_prompt text not null,
  video_prompt text not null,
  voiceover text not null,
  image_url text,
  video_url text,
  audio_url text,
  created_at timestamp with time zone default now()
);

-- Helpful index
create index if not exists scenes_ad_id_idx on public.scenes(ad_id);
```

## API Endpoints

### Storyboard Generation
- `POST /api/generate-storyboard`
  - Generates storyboard using Kimi K2 Instruct
  - Body: `{ product_name, product_description, duration }`

### Image Generation
- `POST /api/images`
  - Generates images using RunwayML Gen4 Image Turbo
  - Body: `{ prompts: string[], aspect_ratio?, resolution? }`

### Video Generation
- `POST /api/videos`
  - Generates videos using RunwayML Gen4 Turbo
  - Body: `{ frames: string[], prompts: string[], aspect_ratio?, duration? }`

### Text-to-Speech
- `POST /api/tts`
  - Generates audio using Kokoro TTS
  - Body: `{ texts: string[], voice?, speed? }`

### Full Pipeline
- `POST /api/pipeline`
  - Runs the complete generation pipeline
  - Body: `{ product_name, product_description, duration, voice? }`
  - Returns: `{ storyboard, images, videos, audios, merged }`

## Usage

1. Navigate to `/start-creating`
2. Fill in product details (name, description, duration)
3. Choose between:
   - **Storyboard Only**: Generates storyboard with prompts
   - **Full Pipeline**: Generates storyboard → images → videos → audio → merges
4. Select voice for TTS (if using pipeline)
5. Click "Generate Ad" or "Generate Full Ad"

## Environment Variables

### Backend (.env)
- `REPLICATE_API_TOKEN`: Your Replicate API token
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (for writes)
- `PORT`: Server port (default: 4000)

### Frontend (.env)
- `VITE_API_URL`: Backend API URL (default: http://localhost:4000)
- `VITE_SUPABASE_URL`: Supabase project URL (optional, for auth)
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key (optional, for auth)

## Development

### Backend Structure
```
backend/
├── src/
│   ├── lib/
│   │   └── supabase.js      # Supabase client
│   ├── services/
│   │   ├── storyboard.js    # Kimi K2 storyboard generation
│   │   ├── image.js         # RunwayML image generation
│   │   ├── video.js         # RunwayML video generation
│   │   ├── tts.js           # Kokoro TTS
│   │   └── merge.js         # Asset merging (placeholder)
│   ├── routes/
│   │   └── api.js           # API endpoints
│   └── index.js             # Express server
├── package.json
└── db.sql                   # Database schema
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   └── landing/         # Landing page components
│   ├── pages/
│   │   └── StartCreating.tsx # Main ad creation page
│   └── ...
└── package.json
```

## Notes

- **Merging**: The merge service is currently a placeholder. In production, use ffmpeg or a video processing service to concatenate clips and add audio.
- **Error Handling**: The backend includes comprehensive error handling and validation.
- **Rate Limiting**: Consider adding rate limiting for production use.
- **File Storage**: Generated assets are stored as URLs from Replicate. Consider downloading and storing in your own storage for persistence.

## Troubleshooting

1. **Backend won't start**: Check environment variables and ensure Replicate token is valid
2. **CORS errors**: Ensure backend is running on the correct port
3. **Database errors**: Verify Supabase credentials and run the SQL schema
4. **Generation fails**: Check Replicate API quota and model availability

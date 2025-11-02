import Replicate from 'replicate';

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export async function synthesizeSpeech({ text, voice = 'af_bella', speed = 1 }) {
  const input = { text, voice, speed };
  
  console.log('Generating TTS with input:', { text: text.substring(0, 100) + '...', voice, speed });
  
  try {
    const output = await replicate.run('jaaari/kokoro-82m:f559560eb822dc509045f3921a1921234918b91739db4bf3daab2169b71c7a13', { input });
    console.log('Raw TTS output:', output);
    
    // Handle different response formats
    if (typeof output === 'string') {
      return output; // Direct URL
    } else if (output && typeof output === 'object') {
      if (output.url && typeof output.url === 'function') {
        return output.url();
      } else if (output.url && typeof output.url === 'string') {
        return output.url;
      } else if (Array.isArray(output) && output.length > 0) {
        return output[0]; // First URL in array
      }
    }
    
    throw new Error(`Unexpected TTS output format: ${JSON.stringify(output)}`);
  } catch (error) {
    console.error('TTS generation error:', error);
    throw new Error(`TTS generation failed: ${error.message}`);
  }
}

/**
 * Vercel Serverless Function: `GET /api/health`
 * Reports whether `GEMINI_API_KEY` and `GOOGLE_TTS_API_KEY` are configured on the server
 * so the frontend header badges show live status without ever exposing the keys.
 */

function isKeyPresent(raw) {
  const trimmed = (raw || '').trim();
  return Boolean(
    trimmed &&
      trimmed !== '...' &&
      trimmed !== 'your_gemini_api_key_here' &&
      trimmed !== 'your_google_cloud_tts_api_key_here'
  );
}

export default function handler(_req, res) {
  const geminiConfigured = isKeyPresent(
    process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY
  );
  const ttsConfigured = isKeyPresent(
    process.env.GOOGLE_TTS_API_KEY || process.env.VITE_GOOGLE_TTS_API_KEY
  );

  const payload = {
    geminiConfigured,
    ttsConfigured,
  };

  if (typeof res.status === 'function' && typeof res.json === 'function') {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(payload);
  }

  res.writeHead(200, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(payload));
}

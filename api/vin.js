// This is a Vercel serverless function.
// It runs on Vercel's server, not in the browser.
// Its job: receive a VIN from the browser, call auto.dev with our secret API key, return the result.

export default async function handler(req, res) {
  // Get the VIN from the request URL, e.g. /api/vin?vin=1FTFW3LDXRFB40317
  const { vin } = req.query;

  // Basic validation — a VIN is always exactly 17 characters
  if (!vin || vin.length !== 17) {
    return res.status(400).json({ error: 'Please provide a valid 17-character VIN.' });
  }

  // Read the API key from Vercel's environment variables — never hardcoded here
  const apiKey = process.env.AUTODEV_API_KEY;

  try {
    // Call auto.dev — the API key is sent in the Authorization header, not in the URL
    const response = await fetch(`https://api.auto.dev/vin/${vin}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Could not find that VIN. Please check and try again.' });
    }

    const data = await response.json();

    // Send the result back to the browser
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

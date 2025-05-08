// api/proxy.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Set CORS headers to allow your frontend to access this proxy
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Get the target endpoint from the query parameter
    const endpoint = req.query.endpoint;
    
    if (!endpoint) {
      return res.status(400).json({ error: 'Missing endpoint parameter' });
    }
    
    // Construct the full URL to the Render backend
    const targetUrl = `https://hellojakejohn.onrender.com/api/${endpoint}`;
    
    // Make the request to the Render backend
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://www.hellojakejohn.com'  // Use an origin that's allowed by the backend
      },
      ...(req.body && { body: JSON.stringify(req.body) })
    });
    
    // Get the response data
    const data = await response.text();
    
    // Try to parse as JSON
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (e) {
      jsonData = { rawData: data };
    }
    
    // Return the response from the backend
    res.status(response.status).json(jsonData);
  } catch (error) {
    console.error('API proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch data from backend', details: error.message });
  }
}
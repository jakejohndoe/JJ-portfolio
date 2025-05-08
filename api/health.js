// api/health.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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
    // Forward the request to your Render backend
    const response = await fetch('https://hellojakejohn.onrender.com/api/health', {
      headers: {
        'Origin': req.headers.origin || 'https://www.hellojakejohn.com',
        'Accept': 'application/json'
      }
    });
    
    // Get response data
    const data = await response.json();
    
    // Return the data
    res.status(200).json({
      ...data,
      proxy: {
        source: 'Vercel Serverless Function',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Health check proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch health data from backend', 
      details: error.message,
      proxy: {
        source: 'Vercel Serverless Function',
        timestamp: new Date().toISOString()
      }
    });
  }
}
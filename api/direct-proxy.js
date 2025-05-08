// api/direct-proxy.js - Direct API endpoint proxy

// Import required packages
import fetch from 'node-fetch';

// Helper function to read request body
async function readRequestBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : null);
      } catch (error) {
        resolve(body);
      }
    });
  });
}

export default async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Get the target endpoint from query params
  const endpoint = req.query.endpoint;
  
  if (!endpoint) {
    return res.status(400).json({ error: 'Missing endpoint parameter' });
  }
  
  try {
    // Construct target URL
    const targetUrl = `https://hellojakejohn.onrender.com/api/${endpoint}`;
    
    // Get request body for non-GET requests
    let body = null;
    if (req.method !== 'GET') {
      body = await readRequestBody(req);
    }
    
    // Prepare fetch options
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://www.hellojakejohn.com'
      }
    };
    
    // Add body if it exists
    if (body) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }
    
    // Make request to target
    const response = await fetch(targetUrl, fetchOptions);
    
    // Read response as text
    const responseText = await response.text();
    
    // Try to parse as JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { text: responseText };
    }
    
    // Return response to client
    res.status(response.status).json(responseData);
  } catch (error) {
    res.status(500).json({ 
      error: 'Proxy request failed', 
      details: error.message 
    });
  }
};
// api/proxy.js - Fixed version

// Import fetch for Node.js environment
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Set CORS headers
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
    // Log the request for debugging
    console.log('Proxy received request:', {
      method: req.method,
      endpoint: req.query.endpoint,
      headers: req.headers,
      body: req.body
    });

    // Get the target endpoint from the query parameter
    const endpoint = req.query.endpoint;
    
    if (!endpoint) {
      return res.status(400).json({ error: 'Missing endpoint parameter' });
    }
    
    // Construct the full URL to the Render backend
    const targetUrl = `https://hellojakejohn.onrender.com/api/${endpoint}`;
    console.log('Proxying request to:', targetUrl);
    
    // Prepare request options
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://www.hellojakejohn.com'  // Use an origin that's allowed by the backend
      }
    };
    
    // Add body for POST, PUT requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }
    
    console.log('Fetch options:', fetchOptions);
    
    // Make the request to the Render backend
    const response = await fetch(targetUrl, fetchOptions);
    console.log('Backend response status:', response.status);
    
    // Get the response data
    const responseBuffer = await response.buffer();
    let responseData;
    
    // Try to parse as JSON if the content type is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        responseData = JSON.parse(responseBuffer.toString());
      } catch (e) {
        console.error('Error parsing JSON response:', e);
        responseData = responseBuffer.toString();
      }
    } else {
      responseData = responseBuffer.toString();
    }
    
    console.log('Sending response back to client, status:', response.status);
    
    // Forward response headers
    response.headers.forEach((value, name) => {
      res.setHeader(name, value);
    });
    
    // Return the response from the backend
    res.status(response.status).json(responseData);
  } catch (error) {
    console.error('API proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch data from backend', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
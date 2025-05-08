// api/simple-proxy.js - A simpler implementation

export default async function handler(req, res) {
    try {
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
  
      // Get the endpoint from the query parameter
      const endpoint = req.query.endpoint || '';
      
      // Get the method from the query parameter or use the request method
      const method = req.query.method || req.method;
      
      // Build the target URL
      const targetUrl = `https://hellojakejohn.onrender.com/api/${endpoint}`;
      
      // Prepare the fetch options
      const fetchOptions = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'https://www.hellojakejohn.com'
        }
      };
      
      // Add body for non-GET requests if present
      if (method !== 'GET' && req.body) {
        fetchOptions.body = JSON.stringify(req.body);
      }
      
      // Make the request to the target API
      const response = await fetch(targetUrl, fetchOptions);
      
      // Get the response as text
      const text = await response.text();
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { text };
      }
      
      // Return the response
      res.status(response.status).json(data);
    } catch (error) {
      // Handle errors
      res.status(500).json({ 
        error: 'Error in proxy request', 
        message: error.message 
      });
    }
  }
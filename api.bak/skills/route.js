// api/skills/route.js
export const runtime = 'edge';

export async function GET(request) {
  try {
    console.log('Skills proxy called');
    
    const backendResponse = await fetch('https://hellojakejohn.onrender.com/api/skills', {
      headers: {
        'Origin': request.headers.get('origin') || 'https://www.hellojakejohn.com',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Backend responded with status:', backendResponse.status);
    
    if (!backendResponse.ok) {
      // If backend gave an error, return that error
      const errorText = await backendResponse.text();
      console.error('Backend error:', errorText);
      
      return new Response(errorText, {
        status: backendResponse.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'X-Proxy-Source': 'Vercel-Edge-Function'
        }
      });
    }

    const data = await backendResponse.json();
    console.log('Skills data received:', JSON.stringify(data).substring(0, 100) + '...');

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'X-Proxy-Source': 'Vercel-Edge-Function',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Skills proxy error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Skills proxy failed',
      details: error.message,
      stack: error.stack
    }), {
      status: 502,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
}
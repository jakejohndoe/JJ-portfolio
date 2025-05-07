// api/health/route.js
export const config = { runtime: 'edge' };

export default async function handler(request) {
  try {
    const backendResponse = await fetch('https://hellojakejohn.onrender.com/api/health', {
      headers: {
        'Origin': 'https://www.hellojakejohn.com'
      }
    });
    
    if (!backendResponse.ok) {
      throw new Error(`Backend responded with ${backendResponse.status}`);
    }

    const data = await backendResponse.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://www.hellojakejohn.com',
        'Access-Control-Allow-Credentials': 'true',
        'X-Proxy-Source': 'Vercel-Edge-Function'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Proxy failed',
      details: error.message 
    }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
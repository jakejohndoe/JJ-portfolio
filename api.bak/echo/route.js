// api/echo/route.js
export const runtime = 'edge';

export async function GET(request) {
  const responseData = {
    message: 'Echo function is working!',
    method: request.method,
    url: request.url,
    timestamp: new Date().toISOString(),
    headers: Object.fromEntries(request.headers)
  };

  // Get query parameters
  const url = new URL(request.url);
  responseData.query = Object.fromEntries(url.searchParams);

  return new Response(JSON.stringify(responseData, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'X-Proxy-Source': 'Vercel-Edge-Function'
    }
  });
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
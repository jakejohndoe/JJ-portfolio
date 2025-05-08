// api/echo/route.js
export const config = { runtime: 'edge' };

export default async function handler(request) {
  const responseData = {
    message: 'Echo function is working!',
    method: request.method,
    url: request.url,
    timestamp: new Date().toISOString(),
    headers: Object.fromEntries(request.headers),
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
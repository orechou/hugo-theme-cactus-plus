// Cloudflare Worker — NeoDB API Proxy
// Deploy: wrangler deploy
// Env var: NEODB_TOKEN (your NeoDB Bearer Token)
//
// Setup:
//   1. Go to https://neodb.social/settings/developer
//   2. Click "Test Access Token" then "Generate"
//   3. Copy the token
//   4. Set it as NEODB_TOKEN in your Worker's environment variables
//   5. Deploy with: wrangler deploy
//
// Usage:
//   GET /shelf/complete?category=book&page=1
//   GET /shelf/progress?category=movie&page=1
//   GET /shelf/wishlist?category=tv&page=1
//
// Categories: book, movie, tv, music, game, podcast, performance
// Types: wishlist, progress, complete

addEventListener('fetch', function (event) {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders()
    });
  }

  try {
    var url = new URL(request.url);
    var pathParts = url.pathname.split('/').filter(Boolean);

    // Route: /shelf/{type}
    if (pathParts.length >= 2 && pathParts[0] === 'shelf') {
      var type = pathParts[1];
      if (!['wishlist', 'progress', 'complete'].includes(type)) {
        return jsonResponse({ error: 'Invalid type. Use: wishlist, progress, complete' }, 400);
      }

      var category = url.searchParams.get('category') || '';

      var pageParam = url.searchParams.get('page') || '1';
      var pageNum = parseInt(pageParam, 10);
      if (!Number.isInteger(pageNum) || pageNum < 1 || pageNum > 1000) {
        return jsonResponse({ error: 'Invalid page. Must be an integer between 1 and 1000.' }, 400);
      }

      var apiUrl = 'https://neodb.social/api/me/shelf/' + type + '?page=' + pageNum;
      if (category) {
        apiUrl += '&category=' + encodeURIComponent(category);
      }

      var response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + NEODB_TOKEN
        }
      });

      if (!response.ok) {
        return jsonResponse({ error: 'NeoDB API returned ' + response.status }, response.status);
      }

      var data = await response.json();
      return jsonResponse(data, 200);
    }

    return jsonResponse({ error: 'Not found. Use /shelf/{type}?category={cat}&page={n}' }, 404);
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: Object.assign({
      'Content-Type': 'application/json'
    }, corsHeaders())
  });
}

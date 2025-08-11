// Copied from Claude AI, will hopefully change later once I understand better

exports.handler = async (event, context) => {
  // Enable CORS for your frontend
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { queryStringParameters } = event;
    
    // Handle Places Nearby Search (matches your current usage)
    if (event.path.includes('/nearby')) {
      const { lat, lng, radius, type } = queryStringParameters;
      
      if (!lat || !lng || !radius) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'lat, lng, and radius parameters are required' })
        };
      }

      const searchType = type || 'restaurant'; // Default to restaurant
      const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${searchType}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(apiUrl);
      const data = await response.json();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      };
    }

    // Default response for unmatched paths
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Endpoint not found. Use /nearby for places search.' })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
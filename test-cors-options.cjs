const https = require('https');

const options = {
  hostname: 'atap-api-production.up.railway.app',
  port: 443,
  path: '/api/v1/news-tasks',
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://atap.solar',
    'Access-Control-Request-Method': 'GET',
    'Access-Control-Request-Headers': 'Authorization'
  }
};

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
});

req.on('error', (e) => {
  console.error(e);
});

req.end();

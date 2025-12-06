const https = require('https');

const NEWS_ID = 'c16492ad-5e52-4152-93ab-69ab420eb3e2';

const options = {
  hostname: 'atap-api-production.up.railway.app',
  port: 443,
  path: `/api/v1/news/${NEWS_ID}`,
  method: 'GET',
  headers: {
    'Origin': 'https://atap.solar'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    try {
      const item = JSON.parse(data);
      console.log('--- Single Item Inspection ---');
      console.log('ID:', item.id);
      console.log('Category ID:', item.category_id);
      console.log('Category Object:', JSON.stringify(item.category, null, 2));
    } catch (e) {
      console.error('Failed to parse:', e);
    }
  });
});

req.end();

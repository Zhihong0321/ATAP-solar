const https = require('https');

const options = {
  hostname: 'atap-api-production.up.railway.app',
  port: 443,
  path: '/api/v1/news?published=true',
  method: 'GET',
  headers: {
    'Origin': 'https://atap.solar'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    if (res.statusCode === 200) {
      try {
        const json = JSON.parse(data);
        const items = json.data ?? json;
        
        console.log('--- Data Inspection ---');
        const item = items[0];
        if (item) {
          console.log('Keys available on first item:', Object.keys(item));
          console.log('Sample Item:', JSON.stringify(item, null, 2));
        } else {
          console.log('No items found.');
        }
        console.log('\n--- End Inspection ---');
        
      } catch (e) {
        console.error('Failed to parse JSON:', e);
      }
    } else {
      console.error(`Request failed with status ${res.statusCode}`);
    }
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.end();

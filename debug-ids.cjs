const https = require('https');

const options = {
  hostname: 'atap-api-production.up.railway.app',
  port: 443,
  path: '/api/v1/news?published=true',
  method: 'GET',
  headers: { 'Origin': 'https://atap.solar' }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    if (res.statusCode === 200) {
      const news = JSON.parse(data).data;
      
      // Fetch categories to compare
      const catReq = https.request({
        ...options,
        path: '/api/v1/categories'
      }, (catRes) => {
        let catData = '';
        catRes.on('data', (chunk) => { catData += chunk; });
        catRes.on('end', () => {
          const categories = JSON.parse(catData);
          const atapCat = categories.find(c => c.name === 'ATAP');
          
          console.log('--- ID Mismatch Debug ---');
          console.log(`ATAP Category ID: ${atapCat?.id}`);
          
          console.log('\nNews Items Check:');
          news.forEach(n => {
            if (n.title_en.includes('PETRA')) { // Check the article user mentioned
               console.log(`Article: ${n.title_en.substring(0, 30)}...`);
               console.log(`  Category ID (on news): ${n.category_id}`);
               console.log(`  Category Object (on news): ${JSON.stringify(n.category)}`);
               console.log(`  Match? ${n.category_id === atapCat?.id}`);
            }
          });
        });
      });
      catReq.end();
    }
  });
});

req.end();

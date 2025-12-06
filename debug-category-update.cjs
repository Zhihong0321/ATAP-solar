const https = require('https');

const TOKEN = '@Eternalgy2025';
const NEWS_ID = 'c16492ad-5e52-4152-93ab-69ab420eb3e2'; // Existing news item
const CAT_ID = 'bbd852e1-41ef-45f3-ac69-197f9b84a69e'; // "ATAP" Category

function updateNews(payloadLabel, payload) {
  return new Promise((resolve) => {
    console.log(`\n--- Testing ${payloadLabel} ---`);
    console.log('Sending Payload:', JSON.stringify(payload, null, 2));

    const req = https.request({
      hostname: 'atap-api-production.up.railway.app',
      port: 443,
      path: `/api/v1/news/${NEWS_ID}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
        'Origin': 'https://atap.solar'
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        try {
          const json = JSON.parse(data);
          const item = json.data ?? json;
          console.log('Response category_id:', item.category_id);
          console.log('Response category:', item.category ? 'Present' : 'NULL');
          resolve(item.category_id === CAT_ID);
        } catch (e) {
          console.log('Response Body:', data);
          resolve(false);
        }
      });
    });

    req.write(JSON.stringify(payload));
    req.end();
  });
}

async function run() {
  // 1. Fetch current state to get required fields (title, etc) to avoid validation errors
  // We'll just send a minimal update with category to see if it works, assuming PATCH-like behavior 
  // OR we send full required fields if PUT requires them.
  // Let's try sending the category fields along with required title/content to be safe.
  
  const basePayload = {
    title_en: "Malaysia Pushes For 70% Renewable Energy And Integrated Water Policy",
    title_cn: "Malaysia Pushes For 70% Renewable Energy And Integrated Water Policy",
    title_my: "Malaysia Pushes For 70% Renewable Energy And Integrated Water Policy",
    content_en: "Test Update Content",
    content_cn: "Test Update Content",
    content_my: "Test Update Content",
    news_date: "2025-12-06T07:09:56.529Z",
    sources: [],
    is_published: true,
    is_highlight: false
  };

  // Test 1: snake_case
  const success1 = await updateNews('category_id (snake_case)', {
    ...basePayload,
    category_id: CAT_ID
  });

  if (success1) {
    console.log('\n>>> CONCLUSION: Backend expects "category_id"');
    return;
  }

  // Test 3: Nested Object (Prisma style connect)
  const success3 = await updateNews('Nested Connect', {
    ...basePayload,
    category: { connect: { id: CAT_ID } }
  });

  if (success3) {
    console.log('\n>>> CONCLUSION: Backend expects "category: { connect: { id: ... } }"');
    return;
  }

  // Test 4: Top level "category" ID
  const success4 = await updateNews('category (string ID)', {
    ...basePayload,
    category: CAT_ID
  });

  if (success4) {
    console.log('\n>>> CONCLUSION: Backend expects "category" as ID string');
    return;
  }
}

run();

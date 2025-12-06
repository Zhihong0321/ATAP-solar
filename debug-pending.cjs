const API_BASE = 'https://atap-api-production.up.railway.app';

async function checkPendingNews() {
  const url = new URL('/api/v1/news', API_BASE);
  url.searchParams.set('content_status', 'empty');
  url.searchParams.set('limit', '5');

  console.log(`Fetching pending news from ${url.toString()}...`);

  try {
    const res = await fetch(url.toString());
    const data = await res.json();
    const items = data.data || data;

    if (Array.isArray(items) && items.length > 0) {
      console.log('Found pending items:', items.length);
      items.forEach((item, i) => {
        console.log(`\n--- Pending Item ${i + 1} ---`);
        console.log('ID:', item.id);
        console.log('Category ID:', item.category_id);
        console.log('Category Object:', item.category);
        console.log('Date:', item.news_date);
        console.log('Sources:', item.sources);
        if (item.sources && Array.isArray(item.sources) && item.sources.length > 0) {
             console.log('Source[0] type:', typeof item.sources[0]);
             if (typeof item.sources[0] === 'object') {
                 console.log('Source[0] is object:', JSON.stringify(item.sources[0]));
             }
        }
      });
    } else {
      console.log('No pending items found or not an array.');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

checkPendingNews();

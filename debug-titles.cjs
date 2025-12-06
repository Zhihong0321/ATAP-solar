// We need to handle the import because lib/news.ts uses ES syntax (import/export)
// but we are running a script. 
// Instead of complex setup, I will just replicate the fetch logic here to be safe and quick.

const API_BASE = 'https://atap-api-production.up.railway.app';

async function checkTitles() {
  const url = new URL('/api/v1/news', API_BASE);
  url.searchParams.set('published', 'true');
  url.searchParams.set('limit', '5');

  console.log(`Fetching from ${url.toString()}...`);

  try {
    const res = await fetch(url.toString());
    const data = await res.json();
    const items = data.data || data;

    if (Array.isArray(items)) {
      items.forEach((item, index) => {
        console.log(`\n--- Item ${index + 1} ---`);
        console.log(`Sources type: ${Array.isArray(item.sources) ? 'Array' : typeof item.sources}`);
        if (Array.isArray(item.sources) && item.sources.length > 0) {
            console.log(`First source:`, item.sources[0]);
            console.log(`Type of first source:`, typeof item.sources[0]);
        }
      });
    } else {
      console.log('No array returned', data);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

checkTitles();

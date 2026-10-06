const BASE = 'https://directus-dj3o.onrender.com';
const TOKEN = 'qoxRyGEhPzqgQKb8XenzdpXTpnXeua_D';
const PUBLIC_POLICY_ID = 'abf8a154-5b1c-4a46-ac9c-7300570f4f17';

async function testUsersPerm() {
  const res = await fetch(`${BASE}/permissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      collection: 'directus_users',
      action: 'read',
      policy: PUBLIC_POLICY_ID,
      fields: ['*']
    })
  });
  const data = await res.json();
  console.log('directus_users wildcard permission result:', JSON.stringify(data, null, 2));

  // Test unauthenticated fetch
  const testRes = await fetch(`${BASE}/items/blogs?fields=id,title,slug,author.first_name,author.last_name&limit=2`);
  const testData = await testRes.json();
  console.log('Unauthenticated result:', JSON.stringify(testData, null, 2));
}

testUsersPerm();

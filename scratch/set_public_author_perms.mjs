const BASE = 'https://directus-dj3o.onrender.com';
const TOKEN = 'qoxRyGEhPzqgQKb8XenzdpXTpnXeua_D';
const PUBLIC_POLICY_ID = 'abf8a154-5b1c-4a46-ac9c-7300570f4f17';

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${TOKEN}`,
};

async function api(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch (e) {
    return text;
  }
}

async function configurePublicAccess() {
  // 1. Directus Users read permission (public)
  const userPerm = await api('POST', '/permissions', {
    collection: 'directus_users',
    action: 'read',
    policy: PUBLIC_POLICY_ID,
    fields: ['id', 'first_name', 'last_name', 'title', 'description', 'avatar']
  });
  console.log('directus_users permission:', JSON.stringify(userPerm, null, 2));

  // 2. Directus Files read permission (public)
  const filesPerm = await api('POST', '/permissions', {
    collection: 'directus_files',
    action: 'read',
    policy: PUBLIC_POLICY_ID,
    fields: ['*']
  });
  console.log('directus_files permission:', JSON.stringify(filesPerm, null, 2));

  // 3. Test unauthenticated fetch with author relation
  const testRes = await fetch(`${BASE}/items/blogs?fields=id,title,slug,category,read_time,author.first_name,author.last_name,author.title&limit=3`);
  const testData = await testRes.json();
  console.log('\n--- Unauthenticated API Test Result ---');
  console.log('Status:', testRes.status);
  console.log('Data:', JSON.stringify(testData, null, 2));
}

configurePublicAccess();

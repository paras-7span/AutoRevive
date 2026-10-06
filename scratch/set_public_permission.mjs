const BASE = 'https://directus-dj3o.onrender.com';
const TOKEN = 'qoxRyGEhPzqgQKb8XenzdpXTpnXeua_D';

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

async function checkAndSetPublicPermission() {
  console.log('--- Inspecting Policies & Roles ---');
  const policies = await api('GET', '/policies');
  console.log('Policies:', JSON.stringify(policies?.data?.map(p => ({ id: p.id, name: p.name, admin: p.admin_access, app: p.app_access })), null, 2));

  const roles = await api('GET', '/roles');
  console.log('Roles:', JSON.stringify(roles?.data?.map(r => ({ id: r.id, name: r.name })), null, 2));

  const access = await api('GET', '/access');
  console.log('Access:', JSON.stringify(access?.data, null, 2));

  const permissions = await api('GET', '/permissions?filter[collection][_eq]=cars');
  console.log('Existing cars permissions:', JSON.stringify(permissions?.data, null, 2));

  // Find the policy used for public access or cars
  const publicPolicyId = permissions?.data?.[0]?.policy;
  console.log('Public Policy ID from cars:', publicPolicyId);

  if (publicPolicyId) {
    // Let's create permission for blogs on that policy
    const createRes = await api('POST', '/permissions', {
      collection: 'blogs',
      action: 'read',
      policy: publicPolicyId,
      fields: ['*']
    });
    console.log('Create permission response:', JSON.stringify(createRes, null, 2));
  } else {
    // Try creating with whatever policy has name Public
    const pubPolicy = policies?.data?.find(p => p.name?.toLowerCase().includes('public'));
    if (pubPolicy) {
      const createRes = await api('POST', '/permissions', {
        collection: 'blogs',
        action: 'read',
        policy: pubPolicy.id,
        fields: ['*']
      });
      console.log('Create permission response with pubPolicy:', JSON.stringify(createRes, null, 2));
    }
  }

  // Also check directus_users public read if author relationship needs first_name/last_name/avatar
  console.log('Checking directus_users permissions for public policy...');
  const userPerms = await api('GET', `/permissions?filter[collection][_eq]=directus_users&filter[policy][_eq]=${publicPolicyId}`);
  console.log('User perms on public policy:', JSON.stringify(userPerms?.data, null, 2));

  // Test unauthenticated fetch
  const testRes = await fetch(`${BASE}/items/blogs?fields=id,title,slug,author.first_name,author.last_name&limit=2`);
  const testData = await testRes.json();
  console.log('Unauthenticated /items/blogs response status:', testRes.status);
  console.log('Unauthenticated /items/blogs response body:', JSON.stringify(testData, null, 2));
}

checkAndSetPublicPermission();

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
  if (!res.ok) {
    console.error(`⚠️ ${method} ${path} → ${res.status}`);
    console.error(text.slice(0, 300));
    return null;
  }
  console.log(`✅ ${method} ${path} → ${res.status}`);
  try {
    return text ? JSON.parse(text) : null;
  } catch (e) {
    return text;
  }
}

async function getOrCreateAuthorUsers() {
  console.log('\n👥 Checking/Creating Author Role & Users...\n');
  
  // Check existing roles
  let rolesRes = await api('GET', '/roles');
  let roles = rolesRes?.data || [];
  let authorRole = roles.find(r => r.name.toLowerCase() === 'author' || r.name.toLowerCase() === 'editor');
  
  if (!authorRole) {
    const newRole = await api('POST', '/roles', {
      name: 'Author',
      icon: 'edit_note',
      description: 'Blog content authors and automotive journalists',
    });
    authorRole = newRole?.data;
  }

  // Check existing users
  const usersRes = await api('GET', '/users?limit=50');
  const existingUsers = usersRes?.data || [];

  const authorsToCreate = [
    {
      first_name: 'Vikram',
      last_name: 'Malhotra',
      email: 'vikram.malhotra@autorevive.in',
      title: 'Senior Automotive Journalist',
      description: '12+ years reviewing cars, testing powertrains, and breaking motorsport news.',
      role: authorRole?.id,
      status: 'active'
    },
    {
      first_name: 'Ananya',
      last_name: 'Sharma',
      email: 'ananya.sharma@autorevive.in',
      title: 'EV & Tech Specialist',
      description: 'Covering next-gen electric mobility, battery tech, and connected car ecosystems.',
      role: authorRole?.id,
      status: 'active'
    },
    {
      first_name: 'Rajesh',
      last_name: 'Verma',
      email: 'rajesh.verma@autorevive.in',
      title: 'Master Mechanic & DIY Lead',
      description: 'Certified master technician sharing maintenance hacks and vehicle longevity secrets.',
      role: authorRole?.id,
      status: 'active'
    }
  ];

  const authorIds = [];

  for (const authorData of authorsToCreate) {
    const found = existingUsers.find(u => u.email.toLowerCase() === authorData.email.toLowerCase());
    if (found) {
      authorIds.push(found.id);
      console.log(`Found existing user: ${found.first_name} ${found.last_name} (${found.id})`);
    } else {
      const created = await api('POST', '/users', authorData);
      if (created?.data?.id) {
        authorIds.push(created.data.id);
        console.log(`Created author: ${authorData.first_name} ${authorData.last_name} (${created.data.id})`);
      }
    }
  }

  // Fallback to me if no authors created
  if (authorIds.length === 0) {
    const me = await api('GET', '/users/me');
    if (me?.data?.id) authorIds.push(me.data.id);
  }

  return authorIds;
}

async function createBlogsCollection() {
  console.log('\n📦 Checking/Creating blogs collection on Render Directus...\n');
  
  // Check if collection already exists
  const collectionsRes = await api('GET', '/collections');
  const collections = collectionsRes?.data || [];
  const exists = collections.some(c => c.collection === 'blogs');

  if (exists) {
    console.log('Collection "blogs" already exists.');
    return;
  }

  const result = await api('POST', '/collections', {
    collection: 'blogs',
    meta: {
      collection: 'blogs',
      icon: 'article',
      note: 'AutoRevive Articles, News & Buyer Guides',
      hidden: false,
      singleton: false,
      accountability: 'all',
      sort_field: 'sort',
    },
    schema: {},
    fields: [
      {
        field: 'id',
        type: 'integer',
        schema: { is_primary_key: true, has_auto_increment: true },
        meta: { hidden: true, readonly: true, interface: 'input' },
      },
      {
        field: 'status',
        type: 'string',
        schema: { default_value: 'published', is_nullable: false },
        meta: {
          interface: 'select-dropdown',
          options: {
            choices: [
              { text: 'Published', value: 'published' },
              { text: 'Draft', value: 'draft' },
              { text: 'Archived', value: 'archived' },
            ],
          },
          display: 'labels',
          display_options: {
            showAsDot: true,
            choices: [
              { text: 'Published', value: 'published', foreground: '#FFFFFF', background: '#2ECDA7' },
              { text: 'Draft', value: 'draft', foreground: '#18222F', background: '#D3DAE4' },
              { text: 'Archived', value: 'archived', foreground: '#FFFFFF', background: '#A2B5CD' },
            ],
          },
          width: 'half',
        },
      },
      {
        field: 'sort',
        type: 'integer',
        schema: {},
        meta: { interface: 'input', hidden: true },
      },
      {
        field: 'date_created',
        type: 'timestamp',
        schema: {},
        meta: {
          special: ['date-created'],
          interface: 'datetime',
          readonly: true,
          hidden: true,
          width: 'half',
          display: 'datetime',
          display_options: { relative: true },
        },
      },
      {
        field: 'date_updated',
        type: 'timestamp',
        schema: {},
        meta: {
          special: ['date-updated'],
          interface: 'datetime',
          readonly: true,
          hidden: true,
          width: 'half',
          display: 'datetime',
          display_options: { relative: true },
        },
      },
      {
        field: 'title',
        type: 'string',
        schema: { is_nullable: false },
        meta: { interface: 'input', sort: 1, width: 'full', required: true },
      },
      {
        field: 'slug',
        type: 'string',
        schema: { is_unique: true, is_nullable: false },
        meta: { interface: 'input', sort: 2, width: 'half', required: true, note: 'URL slug' },
      },
      {
        field: 'excerpt',
        type: 'text',
        schema: {},
        meta: { interface: 'input-multiline', sort: 3, width: 'full', note: 'Summary snippet' },
      },
      {
        field: 'content',
        type: 'text',
        schema: {},
        meta: { interface: 'input-rich-text-html', sort: 4, width: 'full' },
      },
      {
        field: 'featured_image',
        type: 'uuid',
        schema: {},
        meta: { interface: 'file-image', special: ['file'], sort: 5, width: 'full' },
      },
      {
        field: 'category',
        type: 'string',
        schema: {},
        meta: {
          interface: 'select-dropdown',
          sort: 6,
          width: 'half',
          options: {
            choices: [
              { text: 'Maintenance Tips', value: 'maintenance' },
              { text: 'Buying Guide', value: 'buying-guide' },
              { text: 'Industry News', value: 'industry-news' },
              { text: 'Car Reviews', value: 'car-reviews' },
              { text: 'How-To', value: 'how-to' },
            ],
          },
        },
      },
      {
        field: 'tags',
        type: 'json',
        schema: {},
        meta: { interface: 'tags', sort: 7, width: 'half', special: ['cast-json'] },
      },
      {
        field: 'read_time',
        type: 'integer',
        schema: {},
        meta: { interface: 'input', sort: 8, width: 'half', note: 'Estimated reading duration in minutes' },
      },
      {
        field: 'date_published',
        type: 'timestamp',
        schema: {},
        meta: { interface: 'datetime', sort: 9, width: 'half', display: 'datetime' },
      },
    ],
  });

  // Setup author M2O relation
  console.log('\n🔗 Setting up author field and relationship...\n');
  await api('POST', '/fields/blogs', {
    field: 'author',
    type: 'uuid',
    schema: {},
    meta: {
      interface: 'select-dropdown-m2o',
      special: ['m2o'],
      sort: 10,
      width: 'half',
      display: 'related-values',
      display_options: { template: '{{ first_name }} {{ last_name }}' },
    },
  });

  await api('POST', '/relations', {
    collection: 'blogs',
    field: 'author',
    related_collection: 'directus_users',
    meta: { sort_field: null },
    schema: { on_delete: 'SET NULL' },
  });

  // Setup system audit fields
  await api('POST', '/fields/blogs', {
    field: 'user_created',
    type: 'uuid',
    schema: {},
    meta: { special: ['user-created'], interface: 'select-dropdown-m2o', readonly: true, hidden: true },
  });
  await api('POST', '/relations', {
    collection: 'blogs',
    field: 'user_created',
    related_collection: 'directus_users',
    schema: { on_delete: 'SET NULL' },
  });

  await api('POST', '/fields/blogs', {
    field: 'user_updated',
    type: 'uuid',
    schema: {},
    meta: { special: ['user-updated'], interface: 'select-dropdown-m2o', readonly: true, hidden: true },
  });
  await api('POST', '/relations', {
    collection: 'blogs',
    field: 'user_updated',
    related_collection: 'directus_users',
    schema: { on_delete: 'SET NULL' },
  });
}

async function setupPublicPermissions() {
  console.log('\n🔓 Ensuring Public Read Permissions for blogs...\n');
  
  // Get policies or permissions
  const permRes = await api('GET', '/permissions?filter[collection][_eq]=blogs');
  const existingPerms = permRes?.data || [];
  
  // Find public policy / role
  const rolesRes = await api('GET', '/roles');
  const publicRole = (rolesRes?.data || []).find(r => r.name?.toLowerCase() === 'public');
  
  const policiesRes = await api('GET', '/policies');
  const publicPolicy = (policiesRes?.data || []).find(p => p.name?.toLowerCase().includes('public') || p.id === null);

  const targetPolicyId = publicPolicy?.id || null;

  const hasPublicRead = existingPerms.some(p => p.action === 'read' && (!p.role || p.role === publicRole?.id || p.policy === targetPolicyId));

  if (!hasPublicRead) {
    await api('POST', '/permissions', {
      collection: 'blogs',
      action: 'read',
      policy: targetPolicyId,
      role: publicRole?.id || null,
      fields: ['*'],
      permissions: { status: { _eq: 'published' } },
    });
    console.log('Granted public read access to published blogs.');
  } else {
    console.log('Public read permission already present.');
  }
}

async function insertDemoBlogs(authorIds) {
  console.log('\n✍️ Inserting 14 comprehensive demo blog posts...\n');

  const a1 = authorIds[0] || authorIds[authorIds.length - 1];
  const a2 = authorIds[1] || a1;
  const a3 = authorIds[2] || a1;

  const blogs = [
    {
      status: 'published',
      title: 'Top 10 Used SUVs in India Under ₹15 Lakhs (2026 Edition)',
      slug: 'top-10-used-suvs-india-under-15-lakhs-2026',
      excerpt: 'Looking for a reliable pre-owned SUV that blends highway comfort, robust ground clearance, and reasonable maintenance? Here is our curated top 10 list.',
      category: 'buying-guide',
      tags: ['SUV', 'used cars', 'buying guide', 'budget', 'India'],
      read_time: 7,
      date_published: '2026-10-05T09:30:00Z',
      author: a1,
      content: `<h2>Finding the Perfect Pre-Owned SUV in 2026</h2>
<p>The pre-owned SUV market in India has seen unprecedented growth over the last three years. With new car waitlists stretching and vehicle prices escalating, certified used SUVs under ₹15 Lakhs represent phenomenal value for money.</p>

<h3>1. Hyundai Creta (2020-2023 1.5 Diesel AT)</h3>
<p>The benchmark compact SUV in India. Smooth torque converter automatic gearbox, punchy 1.5L CRDi engine returning 18+ kmpl on highways, and top-tier interior ergonomics make it our #1 recommendation.</p>

<h3>2. Kia Seltos (GT Line 1.4 Turbo Petrol)</h3>
<p>If spirited driving dynamics and cutting-edge tech are your priorities, a 2021-2022 Seltos GT Line with Bose audio, heads-up display, and 360-degree camera is tough to beat.</p>

<h3>3. Tata Harrier (2020+ Facelift BS6)</h3>
<p>Built on the Land Rover D8-derived OMEGArc platform, the Harrier delivers immense road presence, cavernous cabin space, and supreme high-speed stability across broken highways.</p>

<h3>4. Mahindra XUV700 (AX5 / AX7 Petrol or Diesel)</h3>
<p>Early 2022 models are now entering the ₹13-15 Lakh bracket. With 200 PS in mStallion turbo petrol and 185 PS in mHawk diesel, nothing touches it in straight-line grunt.</p>

<h3>5. Maruti Suzuki Grand Vitara Strong Hybrid</h3>
<p>Toyota-engineered strong hybrid powertrain offering 24-27 km/l in city traffic. Low depreciation and Maruti's pan-India service network make it a no-brainer for heavy city commuters.</p>

<h3>Key Pre-Purchase Inspection Tips</h3>
<ul>
<li><strong>Suspension Check:</strong> Inspect front lower control arms and strut bearings for wear.</li>
<li><strong>DPF Health (Diesel):</strong> Check service history for regeneration alerts or frequent short-trip usage.</li>
<li><strong>Infotainment & Electronics:</strong> Test all ADAS sensors, 360 camera feeds, and climate control actuators.</li>
</ul>`
    },
    {
      status: 'published',
      title: 'How to Inspect a Used Car Engine Like a Professional Mechanic',
      slug: 'how-to-inspect-used-car-engine-professional-mechanic',
      excerpt: 'Learn the exact cold-start checks, fluid evaluations, and acoustic diagnostics master mechanics use to spot engine troubles before signing the deal.',
      category: 'how-to',
      tags: ['mechanic tips', 'engine inspection', 'DIY', 'maintenance'],
      read_time: 6,
      date_published: '2026-10-04T11:00:00Z',
      author: a3,
      content: `<h2>The Heart of the Vehicle: Evaluating the Engine</h2>
<p>You don't need a portable dyno or an oscilloscope to catch 80% of serious engine defects. Follow this methodical checklist during your pre-purchase inspection.</p>

<h3>1. The Cold Start Test</h3>
<p>Always insist on inspecting the vehicle after the engine has sat cold for at least 4 hours. Touch the exhaust manifold or hood with the palm of your hand to verify it hasn't been pre-warmed.</p>
<ul>
<li>Listen for metallic valve ticking or timing chain slap during the first 30 seconds.</li>
<li>Watch the tailpipe for blue smoke (oil burning past piston rings/valve seals) or dense white smoke (coolant leak/head gasket failure).</li>
</ul>

<h3>2. The Under-Cap & Dipstick Inspection</h3>
<p>Pull the oil dipstick and examine the coloration. Amber or dark honey is healthy; pitch black is overdue for a service, but milky brown with frothy residue points to head gasket cross-contamination.</p>

<h3>3. The Oil Filler Cap "Blow-by" Test</h3>
<p>With the engine idling at normal operating temperature, remove the oil filler cap and rest it upside down over the opening. If excessive crankcase compression blows the cap off, excessive blow-by exists from worn cylinder rings.</p>

<h3>4. Check Auxiliary Belts & Pulley Alignment</h3>
<p>Look for micro-cracks along the serpentine belt ribs and check that alternator and AC compressor pulleys spin true without squeaking or lateral wobble.</p>`
    },
    {
      status: 'published',
      title: 'EV Battery Health (SoH) Explained: What Used EV Buyers Must Know',
      slug: 'ev-battery-health-soh-explained-used-ev-buyers-guide',
      excerpt: 'State of Health (SoH) is the single most critical metric when evaluating a pre-owned electric vehicle. Here is how degradation works and how to verify battery integrity.',
      category: 'buying-guide',
      tags: ['EV', 'battery health', 'State of Health', 'electric cars'],
      read_time: 8,
      date_published: '2026-10-02T14:15:00Z',
      author: a2,
      content: `<h2>Why Battery SoH Dictates Used EV Value</h2>
<p>In internal combustion vehicles, engine mileage and transmission condition determine mechanical worth. For Electric Vehicles (EVs), the traction battery pack represents 40% to 50% of the entire vehicle's residual value.</p>

<h3>What is State of Health (SoH)?</h3>
<p>SoH is a percentage rating comparing the battery pack's current usable energy capacity (kWh) against its factory nominal capacity when brand new. A 60 kWh pack degraded to 54 kWh operates at 90% SoH.</p>

<h3>Typical Degradation Curves</h3>
<ul>
<li><strong>Years 1-2:</strong> 3% - 5% initial settling degradation.</li>
<li><strong>Years 3-7:</strong> Linear, gradual degradation of approximately 1.2% - 1.8% per year under standard thermal management.</li>
<li><strong>LFP vs NMC Chemistries:</strong> Lithium Iron Phosphate (LFP) cells tolerate daily 100% charging cycles far better than Nickel Manganese Cobalt (NMC) packs.</li>
</ul>

<h3>How to Request an Official Battery Health Certificate</h3>
<p>When purchasing a pre-owned EV on AutoRevive, always ask for an OBD-II Battery Telemetry Scan. This report breaks down individual cell voltages, delta variance (should be under 15mV between highest and lowest cell), and thermal sensor status.</p>`
    },
    {
      status: 'published',
      title: 'Comprehensive Guide to Ceramic Coating vs Paint Protection Film (PPF)',
      slug: 'ceramic-coating-vs-ppf-complete-car-paint-protection-guide',
      excerpt: 'Unsure whether to invest in nano-ceramic coating or self-healing PPF for your car? We break down costs, longevity, scratch resistance, and real-world durability.',
      category: 'how-to',
      tags: ['paint protection', 'ceramic coating', 'PPF', 'detailing'],
      read_time: 5,
      date_published: '2026-09-30T16:00:00Z',
      author: a3,
      content: `<h2>Shielding Your Vehicle’s Clear Coat</h2>
<p>Indian driving conditions subject automotive paint to harsh UV rays, road debris, stone chips, bird droppings, and hard water minerals. Two protective treatments dominate detailing conversations: Ceramic Coatings and Paint Protection Film (PPF).</p>

<h3>Paint Protection Film (PPF)</h3>
<p>PPF is an elastomeric thermoplastic polyurethane (TPU) membrane applied directly to painted panels.</p>
<ul>
<li><strong>Pros:</strong> Physical barrier against stone chips, highway gravel, key scratches, and shopping cart dings. Top-tier films feature heat-activated self-healing top coats.</li>
<li><strong>Cons:</strong> High cost (₹60,000 to ₹1,80,000 for full body wraps) and requires master installers to avoid visible edge seams.</li>
</ul>

<h3>Nano-Ceramic Coatings</h3>
<p>Liquid polymer composed of Silicon Dioxide (SiO2) that chemically bonds with the factory clear coat to form a hydrophobic sacrificial layer.</p>
<ul>
<li><strong>Pros:</strong> Insane gloss, mirror reflections, water-beading contact angles exceeding 110 degrees, and effortless weekly wash maintenance.</li>
<li><strong>Cons:</strong> Does NOT protect against high-velocity rock chips or deep parking lot gouges.</li>
</ul>

<h3>The Recommended Hybrid Strategy</h3>
<p>For optimal value, apply self-healing PPF to high-impact zones (front bumper, hood, side mirrors, door edges) and 9H Ceramic Coating across the remaining roof, doors, and rear quarter panels.</p>`
    },
    {
      status: 'published',
      title: '2026 Indian Automobile Safety Norms: BNCAP vs Global NCAP Decoded',
      slug: '2026-indian-auto-safety-bncap-vs-global-ncap-decoded',
      excerpt: 'With Bharat NCAP fully established alongside 6 standard airbags and mandatory ESC, how should car buyers interpret 5-star crash ratings today?',
      category: 'industry-news',
      tags: ['Bharat NCAP', 'car safety', 'crash test', 'automotive news'],
      read_time: 6,
      date_published: '2026-09-28T08:45:00Z',
      author: a1,
      content: `<h2>The Revolution in Indian Car Safety</h2>
<p>Five years ago, budget vehicles in India frequently scored zero stars in baseline crash safety assessments. Today, structural integrity, 6 airbags as standard, electronic stability control (ESC), and child occupant protection have become non-negotiable buyer priorities.</p>

<h3>Understanding Bharat NCAP Testing Protocols</h3>
<p>Bharat NCAP (BNCAP) tests vehicles across three foundational pillars:</p>
<ol>
<li><strong>Adult Occupant Protection (AOP):</strong> Frontal offset crash test at 64 km/h into a deformable barrier, Side barrier impact at 50 km/h, and Side Pole impact at 29 km/h.</li>
<li><strong>Child Occupant Protection (COP):</strong> Performance of ISOFIX child restraint systems with Q1.5 and Q3 crash test dummies.</li>
<li><strong>Safety Assist Technologies (SAT):</strong> Seatbelt reminders for all seats, Electronic Stability Control (ESC), and pedestrian protection front-end profiles.</li>
</ol>

<h3>What This Means for Used Car Buyers</h3>
<p>Cars manufactured post-2022 generally feature reinforced ultra-high-strength steel passenger safety cages compared to pre-2018 generations. Prioritize models with proven 5-star safety ratings like the Tata Nexon, Mahindra Scorpio-N, VW Taigun, and Skoda Kushaq.</p>`
    },
    {
      status: 'published',
      title: 'Why Automatic Transmissions Outsold Manuals in 2026: AMT vs CVT vs DCT vs TC',
      slug: 'automatic-transmissions-guide-amt-cvt-dct-torque-converter',
      excerpt: 'City traffic has made automatic transmissions the new default. Understand the mechanical differences, reliability scores, and maintenance costs of each automatic gearbox type.',
      category: 'buying-guide',
      tags: ['automatic gearbox', 'CVT', 'DCT', 'Torque Converter', 'AMT'],
      read_time: 8,
      date_published: '2026-09-25T13:20:00Z',
      author: a1,
      content: `<h2>The Shifting Paradigm in Transmission Tech</h2>
<p>For decades, manual gearboxes reigned supreme in India due to fuel economy concerns and lower purchase costs. In 2026, automatic variants represent over 55% of all urban passenger vehicle sales. But not all automatics are built alike.</p>

<h3>1. Automated Manual Transmission (AMT / AGS)</h3>
<p>Standard manual gearbox paired with electronic actuators that handle clutch engagement and gear selection.</p>
<ul>
<li><strong>Best For:</strong> Budget buyers prioritizing maximum fuel economy and low repair expenses.</li>
<li><strong>Drawback:</strong> Noticeable head-nod jerk during 1st-to-2nd gear transitions under aggressive throttle.</li>
</ul>

<h3>2. Continuously Variable Transmission (CVT / e-CVT)</h3>
<p>Uses a belt and pulley system offering infinite step-less gear ratios.</p>
<ul>
<li><strong>Best For:</strong> Supreme city smoothness (Honda City, Nissan Magnite, Toyota Hybrids).</li>
<li><strong>Drawback:</strong> "Rubber-band effect" where engine revs flare before acceleration catches up.</li>
</ul>

<h3>3. Torque Converter (AT)</h3>
<p>Traditional hydraulic planetary gear system utilizing a fluid coupling torque converter.</p>
<ul>
<li><strong>Best For:</strong> Maximum long-term durability and heavy-duty torque handling (Hyundai 6AT, Mahindra 6AT, Aisin 6AT/8AT).</li>
<li><strong>Reliability:</strong> Gold standard for 200,000+ km longevity when fluid is changed every 60,000 km.</li>
</ul>

<h3>4. Dual-Clutch Transmission (DCT / DSG)</h3>
<p>Twin clutches controlling odd and even gears simultaneously for lightning-fast 200ms gear swaps.</p>
<ul>
<li><strong>Best For:</strong> Enthusiast drivers demanding razor-sharp performance (VW DSG, Hyundai DCT, Tata DCA).</li>
<li><strong>Maintenance Tip:</strong> In stop-and-go bumper-to-bumper crawl, shift to Neutral at traffic lights to prevent dry clutch pack overheating.</li>
</ul>`
    },
    {
      status: 'published',
      title: '5 Warning Signs Your Car Brake Pads and Rotors Need Immediate Replacement',
      slug: 'warning-signs-car-brake-pads-rotors-need-replacement',
      excerpt: 'Squeaking noises, spongy pedal feel, or steering wheel shudder under braking? Here is how to diagnose brake system wear before costly rotor damage occurs.',
      category: 'maintenance',
      tags: ['brakes', 'car maintenance', 'safety', 'rotors'],
      read_time: 5,
      date_published: '2026-09-22T10:00:00Z',
      author: a3,
      content: `<h2>Brake System Diagnostics Made Simple</h2>
<p>Your vehicle's braking system is its most vital safety asset. Neglecting worn brake pads not only compromises emergency stopping distances but also leads to scored brake rotors and caliper piston failure.</p>

<h3>1. High-Pitched Squealing or Metallic Grinding</h3>
<p>Brake pad manufacturers incorporate a metallic wear indicator tab. When the friction material drops below 3mm, this tab touches the spinning rotor, emitting an unmistakable acoustic warning. If you hear metal-on-metal grinding, the pad material is fully depleted!</p>

<h3>2. Steering Wheel Shudder Under High-Speed Braking</h3>
<p>If applying brakes at 80+ km/h causes vibrations through the steering column, your brake rotors have suffered thermal warping (uneven lateral runout exceeding 0.05mm).</p>

<h3>3. Spongy or Sinking Brake Pedal</h3>
<p>A brake pedal that travels excessively close to the floor before biting suggests air bubbles in the hydraulic brake lines, degraded hygroscopic brake fluid, or a failing master cylinder seal.</p>

<h3>4. Vehicle Pulling to One Side</h3>
<p>Uneven pad wear or a sticky guide pin on one caliper causes the car to drift towards the side with stronger bite during braking events.</p>`
    },
    {
      status: 'published',
      title: 'Monsoon Car Care Checklist: Waterproofing, Wipers & Electrical Protection',
      slug: 'monsoon-car-care-checklist-waterproofing-wipers-electrical',
      excerpt: 'Heavy rains and waterlogged roads can wreak havoc on vehicle underbodies and electronics. Follow our seasonal preparation guide to safeguard your vehicle.',
      category: 'maintenance',
      tags: ['monsoon', 'seasonal care', 'car wash', 'wipers'],
      read_time: 6,
      date_published: '2026-09-18T12:00:00Z',
      author: a3,
      content: `<h2>Preparing Your Vehicle for Severe Rainstorms</h2>
<p>Monsoon driving poses unique challenges ranging from reduced tire hydroplaning thresholds to water ingress in electronic control modules (ECUs). Here is your preventative checklist.</p>

<h3>1. Check Tire Tread Depth & Siping Channels</h3>
<p>Tires require a minimum of 3mm tread depth to evacuate standing water and prevent dangerous hydroplaning. Use a 1-rupee coin test or a digital depth gauge.</p>

<h3>2. Inspect Wiper Blades & Windshield Rain Repellent</h3>
<p>Replace wiper blades every 12 months. Apply a hydrophobic windshield treatment (such as Rain-X or ceramic glass sealant) so water droplets bead and fly off at highway speeds without constantly relying on high-speed wiper sweeps.</p>

<h3>3. Clean Sunroof Drain Tubes and Cowl Drains</h3>
<p>Leaves and road grime frequently clog cowl drain holes under the windshield wipers, causing rainwater to overflow directly into the cabin footwells and fuse boxes.</p>

<h3>4. Underbody Anti-Rust Rubberized Coating</h3>
<p>Road water mixed with atmospheric grime accelerates chassis oxidation. A bitumen or wax-based underbody sealant provides crucial corrosion resistance.</p>`
    },
    {
      status: 'published',
      title: 'Tata Curvv EV vs Hyundai Creta Electric: The Ultimate Mid-Size EV Shootout',
      slug: 'tata-curvv-ev-vs-hyundai-creta-electric-comparison',
      excerpt: 'We pit India’s hottest coupe EV against the electric incarnation of the country’s favorite SUV across real-world range, charging speeds, dynamics, and cabin luxury.',
      category: 'car-reviews',
      tags: ['Tata Curvv', 'Creta EV', 'EV shootout', 'car review'],
      read_time: 9,
      date_published: '2026-09-15T07:30:00Z',
      author: a2,
      content: `<h2>The Battle for Mid-Size EV Supremacy</h2>
<p>The 4.3-meter electric SUV segment in India is now the epicenter of technological warfare. On one side stands Tata's bold Curvv.ev coupe SUV with its 55 kWh battery pack; on the other, Hyundai's meticulously engineered Creta EV.</p>

<h3>Design & Aerodynamic Efficiency</h3>
<p>The Tata Curvv.ev commands attention with its sloping coupe roofline, flush door handles, and continuous LED light bars. The silhouette yields a low 0.28 Cd drag coefficient. The Creta EV opts for an upright, commanding SUV stance with aerodynamically optimized 17-inch aero wheels.</p>

<h3>Real-World Range Test (Highway + City Mix)</h3>
<ul>
<li><strong>Tata Curvv.ev (55 kWh Pack):</strong> 425 km real-world achievable range with dual-zone climate control on.</li>
<li><strong>Hyundai Creta EV (48 kWh Pack):</strong> 385 km real-world range, supported by class-leading regeneration paddle smoothness.</li>
</ul>

<h3>DC Fast Charging Performance</h3>
<p>Both vehicles support 10-80% DC fast charging in under 45 minutes on 60kW+ CCS2 chargers. Hyundai takes a slight lead with its thermal pre-conditioning system that readies the battery pack temperature when navigating toward a fast charger.</p>

<h3>The Verdict</h3>
<p>Choose the Curvv.ev for avant-garde styling and extra highway range; choose the Creta EV for legendary cabin space, pillowy suspension tuning, and bulletproof infotainment integration.</p>`
    },
    {
      status: 'published',
      title: 'How to Transfer Car Ownership in India: Parivahan Portal Step-by-Step (2026)',
      slug: 'how-to-transfer-car-ownership-parivahan-portal-step-by-step',
      excerpt: 'Step-by-step walkthrough of transferring vehicle RC ownership online using the Ministry of Road Transport Parivahan Sewa portal with required forms and fees.',
      category: 'how-to',
      tags: ['RC transfer', 'Parivahan', 'paperwork', 'ownership transfer'],
      read_time: 7,
      date_published: '2026-09-12T15:45:00Z',
      author: a1,
      content: `<h2>Streamlining Your RC Transfer Online</h2>
<p>Gone are the days of standing in endless RTO queues and relying on expensive middlemen. The digital Parivahan Sewa platform allows buyers and sellers to execute vehicle ownership transfers smoothly.</p>

<h3>Mandatory Documents Checklist</h3>
<ul>
<li><strong>Original RC (Registration Certificate)</strong></li>
<li><strong>Form 29:</strong> Notice of Transfer of Ownership (signed in duplicate)</li>
<li><strong>Form 30:</strong> Application for Intimation and Transfer of Ownership</li>
<li><strong>Valid Insurance Certificate</strong> in buyer's name or endorsement receipt</li>
<li><strong>Valid PUC (Pollution Under Control) Certificate</strong></li>
<li><strong>Address & Identity Proof of Buyer</strong> (Aadhaar, Passport, or Voter ID)</li>
<li><strong>NOC (No Objection Certificate)</strong> if transferring across state borders (Form 28)</li>
</ul>

<h3>Step-by-Step Online Submission Process</h3>
<ol>
<li>Navigate to <code>parivahan.gov.in</code> and select Online Services → Vehicle Related Services.</li>
<li>Enter vehicle registration number and chassis number last 5 digits.</li>
<li>Select "Transfer of Ownership" service and authenticate via Aadhaar OTP.</li>
<li>Upload scanned copies of signed Form 29/30, Insurance, and PUC.</li>
<li>Pay the statutory RTO fee online (typically ₹300-₹1,500 depending on state).</li>
<li>Book an appointment to submit physical documents or opt for speed-post verification where supported.</li>
</ol>`
    },
    {
      status: 'published',
      title: 'Unlocking Hidden Car Value: How to Maximize Resale Price When Selling Your Vehicle',
      slug: 'maximize-used-car-resale-value-expert-tips',
      excerpt: 'Simple detailing tricks, service record organization, and minor touch-ups that can boost your car’s trade-in or private resale appraisal by up to ₹50,000.',
      category: 'buying-guide',
      tags: ['resale value', 'selling car', 'valuation', 'tips'],
      read_time: 6,
      date_published: '2026-09-08T11:20:00Z',
      author: a1,
      content: `<h2>First Impressions Dictate Buyer Appraisals</h2>
<p>When selling your car—whether to an online platform like AutoRevive or a private buyer—the difference between an "average" condition rating and an "immaculate" rating can mean ₹40,000 to ₹70,000 in final valuation.</p>

<h3>1. Compile a Chronological Service Portfolio</h3>
<p>A stamped OEM service booklet with itemized invoices is worth its weight in gold. It proves the vehicle received genuine fluids, scheduled timing belt replacements, and authorized warranty recalls.</p>

<h3>2. Fix Minor Blemishes & PDR (Paintless Dent Repair)</h3>
<p>Small shopping cart dings and light bumper scratches can be repaired for ₹2,000-₹4,000 using Paintless Dent Repair techniques, preventing buyers from demanding ₹20,000 discounts on cosmetic grounds.</p>

<h3>3. Deep Interior Odor Elimination & Shampooing</h3>
<p>Nothing turns buyers away faster than tobacco smoke, pet odors, or damp mildew smell. Replace the cabin AC pollen filter and perform an ozone treatment before taking vehicle listing photos.</p>

<h3>4. Take Studio-Quality Listing Photos</h3>
<p>Park in an open, evenly-lit location during golden hour (early morning or late afternoon). Capture all 4 exterior 45-degree angles, tires, dashboard odometer, steering wheel, and clean trunk.</p>`
    },
    {
      status: 'published',
      title: 'Connected Car Tech Explained: ADAS Level 2, OTA Updates & Digital Key Fobs',
      slug: 'connected-car-technology-adas-level-2-ota-updates-explained',
      excerpt: 'From Adaptive Cruise Control and Lane Centering to smartphone telematics, discover how software-defined vehicles are transforming modern driving convenience.',
      category: 'industry-news',
      tags: ['connected car', 'ADAS', 'automotive tech', 'telematics'],
      read_time: 7,
      date_published: '2026-09-03T14:10:00Z',
      author: a2,
      content: `<h2>The Rise of Software-Defined Vehicles</h2>
<p>Automobiles are no longer purely mechanical machines; they are sophisticated computing platforms on wheels boasting dozens of ECUs interconnected via high-speed CAN-FD and automotive ethernet buses.</p>

<h3>Demystifying Level 2 ADAS (Advanced Driver Assistance Systems)</h3>
<p>Level 2 autonomy combines camera vision and millimeter-wave radar to simultaneously manage lateral steering and longitudinal acceleration/braking.</p>
<ul>
<li><strong>Adaptive Cruise Control (ACC) with Stop & Go:</strong> Automatically maintains safe follow distance behind lead cars in heavy highway traffic.</li>
<li><strong>Lane Keep Assist (LKA):</strong> Gently steers the vehicle back into center when unintended lane drift is detected.</li>
<li><strong>Autonomous Emergency Braking (AEB):</strong> Detects sudden pedestrian crossings or stopped vehicles and applies full hydraulic braking if the driver fails to react.</li>
</ul>

<h3>Over-The-Air (OTA) Firmware Updates</h3>
<p>Just like your smartphone, modern vehicles receive cloud firmware updates that refine battery charging curves, update navigation maps, and even unlock performance enhancements overnight.</p>`
    },
    {
      status: 'published',
      title: 'Synthetic Oil vs Mineral Oil: The Ultimate Engine Lubrication Guide',
      slug: 'synthetic-oil-vs-mineral-oil-engine-lubrication-guide',
      excerpt: 'Is fully synthetic engine oil worth the extra cost over conventional mineral oil? We analyze viscosity indexes, shear stability, and drain intervals.',
      category: 'maintenance',
      tags: ['engine oil', 'synthetic oil', 'maintenance', 'DIY'],
      read_time: 5,
      date_published: '2026-08-28T09:15:00Z',
      author: a3,
      content: `<h2>Understanding Modern Engine Lubrication</h2>
<p>Choosing the correct engine oil grade and formulation is critical for preventing internal friction, sludge accumulation, and premature turbocharger bearing failure.</p>

<h3>1. Mineral Engine Oil (Group I & II Base Oils)</h3>
<p>Refined directly from crude oil. Suitable for older naturally-aspirated commuter engines with wide internal tolerances. Typical drain interval: 5,000 km.</p>

<h3>2. Fully Synthetic Engine Oil (Group III, IV PAO & Group V Esters)</h3>
<p>Chemically synthesized molecular structure ensuring uniform molecule size and superior thermal breakdown resistance.</p>
<ul>
<li><strong>Extreme Cold Flow:</strong> 0W-20 and 5W-30 synthetic oils circulate instantly to valve trains upon cold morning ignition.</li>
<li><strong>High Thermal Stability:</strong> Resists oil coking inside 900°C turbocharger center housings.</li>
<li><strong>Extended Drain Interval:</strong> Protects up to 10,000 - 15,000 km between oil changes.</li>
</ul>

<h3>Which One Should You Choose?</h3>
<p>For any modern turbocharged petrol (TGDi) or common-rail diesel (CRDi) engine, always use manufacturer-spec API SP / ACEA C3 fully synthetic oil to preserve catalytic converters and diesel particulate filters (DPFs).</p>`
    },
    {
      status: 'draft',
      title: 'Upcoming Electric Cars Launching in India (2026-2027 Preview)',
      slug: 'upcoming-electric-cars-india-2026-2027-preview',
      excerpt: 'A comprehensive sneak peek at upcoming EV launches from Maruti Suzuki, Mahindra Born Electric, Hyundai, and Kia slated for late 2026 and 2027.',
      category: 'industry-news',
      tags: ['upcoming cars', 'EV preview', 'future cars', 'electric'],
      read_time: 6,
      date_published: null,
      author: a2,
      content: `<h2>The Next Wave of Electric Mobility</h2>
<p>The Indian EV market is gearing up for its biggest wave of product introductions yet, with dedicated skateboard architectures enabling unprecedented range-to-price ratios.</p>

<h3>1. Maruti Suzuki eVX Production Model</h3>
<p>Maruti's 60 kWh modular platform developed in partnership with Toyota promises 500+ km of range with dual-motor AWD variants on top trims.</p>

<h3>2. Mahindra BE.07 and XEV 9e</h3>
<p>Built on the INGLO platform with ultra-fast 175 kW DC charging support, semi-active suspension, and triple panoramic dashboard displays.</p>

<h3>3. Kia EV3</h3>
<p>Kia's global compact EV bringing EV9 flagship design language and vehicle-to-load (V2L) bidirectional charging down to the mass market.</p>`
    }
  ];

  let successCount = 0;
  for (const b of blogs) {
    const res = await api('POST', '/items/blogs', b);
    if (res?.data?.id) {
      successCount++;
    }
  }

  console.log(`\n🎉 Successfully inserted ${successCount} blogs!\n`);
}

async function main() {
  try {
    const authorIds = await getOrCreateAuthorUsers();
    await createBlogsCollection();
    await setupPublicPermissions();
    await insertDemoBlogs(authorIds);
    console.log('✅ Remote Directus setup finished successfully!');
  } catch (err) {
    console.error('Fatal error during setup:', err);
  }
}

main();

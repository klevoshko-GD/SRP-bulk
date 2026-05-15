export const PROJECTS = [
  { id: 'beta',    name: 'Boston Global Mobile Application Refactor',       billingModel: 'Fixed Price',     description: 'Mobile App Engineering / Quality & Performance Engineering' },
  { id: 'alpha',   name: 'A&A Capital Management SOW-01',                  billingModel: 'POD per Team',    description: 'Cloud and App Platforms · App Development & Modernization (Misc)' },
  { id: 'gamma',   name: 'Boston Global HCP Web Experience',                billingModel: 'POD per Engineer',description: 'Digital · Web Experience' },
  { id: 'delta',   name: 'Boston Scientific DevOps Platform',               billingModel: 'POD per Team',    description: 'Cloud and App Platforms · DevOps & Infrastructure' },
  { id: 'opp-101', name: 'Opportunity — BSI Data Modernization (OPP-101)',  billingModel: 'T&M',             description: 'Data & Analytics · Modernization' },
  { id: 'opp-102', name: 'Opportunity — BSI Cloud Migration (OPP-102)',     billingModel: 'Fixed Price',     description: 'Cloud and App Platforms · Migration' },
]

export const projectById = (id) => PROJECTS.find(p => p.id === id)

export const SRP_PROFILES = [
  'Junior Java Developer', 'Middle Java Developer', 'Senior Java Developer', 'Lead Java Developer',
  'Junior Python Developer', 'Middle Python Developer', 'Senior Python Developer',
  'Junior QA Engineer', 'Middle QA Engineer', 'Senior QA Engineer', 'QA Automation Engineer',
  'Middle DevOps Engineer', 'Senior DevOps Engineer',
  'Junior Frontend Developer', 'Middle Frontend Developer', 'Senior Frontend Developer',
  'Tech Lead', 'Engineering Manager', 'Product Owner', 'Business Analyst',
  'UX Designer', 'Scrum Master',
]

export const BOOKING_TO_SRP = {
  'Java / Backend / Senior':          'Senior Java Developer',
  'Java / Backend / Middle':          'Middle Java Developer',
  'Java / Backend / Junior':          'Junior Java Developer',
  'Python / Backend / Senior':        'Senior Python Developer',
  'Python / Backend / Middle':        'Middle Python Developer',
  'QA / Manual / Middle':             'Middle QA Engineer',
  'QA / Automation / Senior':         'QA Automation Engineer',
  'Frontend / React / Middle':        'Middle Frontend Developer',
  'Frontend / React / Senior':        'Senior Frontend Developer',
  'DevOps / Infrastructure / Senior': 'Senior DevOps Engineer',
  'Delivery / Tech Lead / Principal': 'Tech Lead',
}

export const mapProfile = (bookingProfile) => BOOKING_TO_SRP[bookingProfile] || null

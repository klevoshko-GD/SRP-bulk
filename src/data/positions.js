export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const a = (arr) => arr

export const POSITIONS = [
  // ── Project Alpha (T&M) ──────────────────────────────────────────────────
  { id: 'p1',  projectId: 'alpha', scenario: 'P',
    employeeName: 'Anna Kowalski',        employeeId: 'e1',
    bookingProfile: 'Java / Backend / Senior', profile: null,
    wdc: 'GD-PL', location: 'Warsaw, PL',   rate: 85,  involvement: 100,
    alloc: a([1,1,1,1,1,1,0.5,0,0,0,0,0]) },
  { id: 'p2',  projectId: 'alpha', scenario: 'P',
    employeeName: 'Mateusz Nowak',        employeeId: 'e2',
    bookingProfile: 'Python / Backend / Middle', profile: null,
    wdc: 'GD-PL', location: 'Kraków, PL',   rate: 65,  involvement: 100,
    alloc: a([1,1,1,1,0.5,0,0,0,0,0,0,0]) },
  { id: 'p3',  projectId: 'alpha', scenario: 'P',
    employeeName: 'Jakub Wiśniewski',     employeeId: 'e3',
    bookingProfile: 'Frontend / React / Middle', profile: null,
    wdc: 'GD-PL', location: 'Gdańsk, PL',   rate: 60,  involvement: 100,
    alloc: a([1,1,1,0,0,0,0,0,0,0,0,0]) },
  { id: 'p4',  projectId: 'alpha', scenario: 'R',
    employeeName: 'Zofia Dąbrowska',      employeeId: 'e4',
    profile: 'Senior QA Engineer',
    wdc: 'GD-PL', location: 'Warsaw, PL',   rate: 70,  involvement: 100,
    alloc: a([0,0,0,1,1,1,1,1,1,0,0,0]) },
  { id: 'p5',  projectId: 'alpha', scenario: 'O',
    employeeName: 'Unassigned',           employeeId: 'unassigned',
    profile: 'Middle Java Developer',
    wdc: 'GD-PL', location: 'Warsaw, PL',   rate: 55,  involvement: 100,
    alloc: a([0,0,0,0,1,1,1,1,1,1,0,0]) },
  { id: 'p6',  projectId: 'alpha', scenario: 'P',
    employeeName: 'Karolina Lewandowska', employeeId: 'e5',
    bookingProfile: 'Delivery / Tech Lead / Principal', profile: null,
    wdc: 'GD-PL', location: 'Warsaw, PL',   rate: 110, involvement: 50,
    alloc: a([0.5,0.5,0.5,0.5,0.5,0.5,0,0,0,0,0,0]) },
  { id: 'p7',  projectId: 'alpha', scenario: 'P',
    employeeName: 'Piotr Wójcik',         employeeId: 'e6',
    bookingProfile: 'Python / Backend / Senior', profile: null,
    wdc: 'GD-PL', location: 'Warsaw, PL',   rate: 90,  involvement: 100,
    alloc: a([1,1,0,0,0,0,0,0,0,0,0,0]), onlyPast: true },

  // ── Project Beta (Fixed Price) ────────────────────────────────────────────
  { id: 'p8',  projectId: 'beta',  scenario: 'R',
    employeeName: 'Agnieszka Kamińska',   employeeId: 'e7',
    profile: 'Senior Python Developer',
    wdc: 'GD-UA', location: 'Kyiv, UA',    rate: null, involvement: 100,
    alloc: a([1,1,1,1,1,1,0,0,0,0,0,0]) },
  { id: 'p9',  projectId: 'beta',  scenario: 'O',
    employeeName: 'Unassigned',           employeeId: 'unassigned',
    profile: 'Senior Java Developer',
    wdc: 'GD-UA', location: 'Lviv, UA',    rate: null, involvement: 100,
    alloc: a([0,0,0,0,0,1,1,1,1,1,1,1]) },
  { id: 'p10', projectId: 'beta',  scenario: 'P',
    employeeName: 'Tomasz Kowalczyk',     employeeId: 'e8',
    bookingProfile: 'Data Science / NLP / Lead', profile: null,
    wdc: 'GD-UA', location: 'Kyiv, UA',    rate: null, involvement: 100,
    alloc: a([1,1,1,1,0.5,0,0,0,0,0,0,0]) },

  // ── Project Gamma (POD per Engineer) ─────────────────────────────────────
  { id: 'p11', projectId: 'gamma', scenario: 'R',
    employeeName: 'Elena Ivanova',        employeeId: 'e11',
    profile: 'Middle QA Engineer',
    wdc: 'GD-IN', location: 'Bangalore, IN', rate: 50, involvement: 100,
    alloc: a([1,1,1,1,1,1,1,1,0,0,0,0]) },
  { id: 'p12', projectId: 'gamma', scenario: 'P',
    employeeName: 'Rajesh Kumar',         employeeId: 'e14',
    bookingProfile: 'DevOps / Infrastructure / Senior', profile: null,
    wdc: 'GD-IN', location: 'Hyderabad, IN', rate: 55, involvement: 100,
    alloc: a([1,1,1,1,1,0,0,0,0,0,0,0]) },
]

export function endDateOf(pos) {
  const idx = pos.alloc.map((v,i) => v > 0 ? i : -1).filter(x => x >= 0)
  if (!idx.length) return '—'
  return `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][idx[idx.length-1]]} 2026`
}

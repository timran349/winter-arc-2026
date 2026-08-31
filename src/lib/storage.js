/**
 * Persistence layer for Winter Arc 2026 (LocalStorage + Demo seed state)
 */

const STORAGE_KEYS = {
  PROFILE: 'winter_arc_profile_v1',
  COMMITMENTS: 'winter_arc_commitments_v1',
  CHECK_INS: 'winter_arc_checkins_v1',
  REVIEWS: 'winter_arc_reviews_v1',
  SIMULATED_DAY: 'winter_arc_sim_day_v1'
};

// Seed default demo data for instant prototype visualization
export const DEMO_PROFILE = {
  id: 'usr_demo_01',
  name: 'Marcus Vance',
  email: 'marcus@winterarc.com',
  startDate: '2026-10-01',
  duration: 90,
  intention: 'Get focused & build momentum',
  isOnboarded: true,
  createdAt: new Date().toISOString()
};

export const DEMO_COMMITMENTS = [
  { id: 'c1', name: 'Train 45 mins', category: 'BODY' },
  { id: 'c2', name: 'Read 20 pages', category: 'MIND' },
  { id: 'c3', name: 'No phone before 9 AM', category: 'FOCUS' },
  { id: 'c4', name: 'Deep work 60 mins', category: 'FOCUS' },
  { id: 'c5', name: 'Sleep 7+ hours', category: 'BODY' }
];

// Helper to seed realistic check-in data up to Day 17
export function generateDemoCheckIns(startDate = '2026-10-01', currentDay = 18) {
  const checkIns = {};
  const commitments = DEMO_COMMITMENTS;

  for (let day = 1; day <= currentDay; day++) {
    const d = new Date(startDate + 'T00:00:00');
    d.setDate(d.getDate() + (day - 1));
    const dateStr = d.toISOString().split('T')[0];

    if (day === 18) {
      // Day 18 partially complete
      checkIns[dateStr] = {
        completedIds: ['c1', 'c2', 'c3', 'c4'],
        saved: true,
        updatedAt: new Date().toISOString()
      };
    } else if (day === 12 || day === 5) {
      // Missed day
      checkIns[dateStr] = {
        completedIds: [],
        saved: true,
        isMissed: true,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Completed day (all or majority)
      const isFull = day % 3 !== 0;
      const completed = isFull 
        ? commitments.map(c => c.id)
        : commitments.slice(0, 4).map(c => c.id);
      
      checkIns[dateStr] = {
        completedIds: completed,
        saved: true,
        updatedAt: new Date().toISOString()
      };
    }
  }

  return checkIns;
}

export const DEMO_REVIEWS = [
  {
    weekNumber: 1,
    wentWell: 'Maintained early morning workout routine consistently. Kept phone out of bedroom.',
    obstacles: 'Felt tired on Wednesday after a late work call. Almost missed reading.',
    nextWeek: 'Prepare workout gear the night before to reduce friction.',
    createdAt: '2026-10-07T20:00:00.000Z'
  },
  {
    weekNumber: 2,
    wentWell: 'Deep work sessions yielded major progress on personal project.',
    obstacles: 'Weekend social events distracted evening sleep schedule.',
    nextWeek: 'Set strict bedtime alarm on Sundays.',
    createdAt: '2026-10-14T21:30:00.000Z'
  }
];

// Profile storage
export function getProfile() {
  const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

export function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

// Commitments storage
export function getCommitments() {
  const data = localStorage.getItem(STORAGE_KEYS.COMMITMENTS);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export function saveCommitments(commitments) {
  localStorage.setItem(STORAGE_KEYS.COMMITMENTS, JSON.stringify(commitments));
}

// Daily check-ins storage
export function getCheckIns() {
  const data = localStorage.getItem(STORAGE_KEYS.CHECK_INS);
  if (!data) return {};
  try {
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

export function saveCheckIns(checkIns) {
  localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(checkIns));
}

export function saveSingleCheckIn(dateStr, completedIds) {
  const current = getCheckIns();
  current[dateStr] = {
    completedIds,
    saved: true,
    isMissed: completedIds.length === 0,
    updatedAt: new Date().toISOString()
  };
  saveCheckIns(current);
  return current;
}

// Weekly reviews storage
export function getWeeklyReviews() {
  const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export function saveWeeklyReview(review) {
  const current = getWeeklyReviews();
  const filtered = current.filter(r => r.weekNumber !== review.weekNumber);
  const updated = [...filtered, review].sort((a, b) => a.weekNumber - b.weekNumber);
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
  return updated;
}

// Simulated Day override
export function getSimulatedDay() {
  const val = localStorage.getItem(STORAGE_KEYS.SIMULATED_DAY);
  return val ? parseInt(val, 10) : 18; // default to day 18 for demo
}

export function saveSimulatedDay(dayNum) {
  localStorage.setItem(STORAGE_KEYS.SIMULATED_DAY, dayNum.toString());
}

// Initialize Demo Data
export function loadDemoData() {
  saveProfile(DEMO_PROFILE);
  saveCommitments(DEMO_COMMITMENTS);
  saveCheckIns(generateDemoCheckIns('2026-10-01', 18));
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(DEMO_REVIEWS));
  saveSimulatedDay(18);
}

// Clear all data
export function resetAllData() {
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
  localStorage.removeItem(STORAGE_KEYS.COMMITMENTS);
  localStorage.removeItem(STORAGE_KEYS.CHECK_INS);
  localStorage.removeItem(STORAGE_KEYS.REVIEWS);
  localStorage.removeItem(STORAGE_KEYS.SIMULATED_DAY);
}

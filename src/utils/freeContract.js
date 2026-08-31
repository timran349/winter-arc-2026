/**
 * Free Contract Local Storage Helper
 * Persists the user's unauthenticated free contract configuration across page refreshes.
 */

const STORAGE_KEY = 'winter_arc_free_contract';

export function saveFreeContract(data) {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      name: data.name || 'Tushar',
      startDate: data.startDate || '2026-10-01',
      endDate: data.endDate || '2026-12-29',
      duration: Number(data.duration) || 90,
      intention: data.intention || 'Get focused',
      commitments: data.commitments || [],
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Error saving free contract to localStorage:', err);
  }
}

export function getFreeContract() {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : null;
  } catch (err) {
    console.error('Error reading free contract from localStorage:', err);
    return null;
  }
}

export function clearFreeContract() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing free contract from localStorage:', err);
  }
}

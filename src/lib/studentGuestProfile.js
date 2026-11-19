import { supabase } from './supabase';

const storageKey = 'hostel_student_browser_key';
let browserKey;

function getBrowserKey() {
  if (!browserKey) {
    try {
      const stored = localStorage.getItem(storageKey);
      if (/^[0-9a-f]{64}$/.test(stored ?? '')) browserKey = stored;
    } catch {
      // A browser with storage disabled can still save during this page session.
    }
  }
  return browserKey;
}

export async function saveStudentGuestProfile({ name, room, phone }) {
  if (!getBrowserKey()) {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    browserKey = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    try {
      localStorage.setItem(storageKey, browserKey);
    } catch {}
  }

  const { error } = await supabase.rpc('save_student_guest_profile', {
    browser_key: browserKey,
    full_name: name,
    room_number: room,
    mobile: phone
  });
  if (error) throw error;
}

export async function clearStudentGuestProfile() {
  const key = getBrowserKey();
  if (!key) return;
  const { error } = await supabase.rpc('clear_student_guest_profile', { browser_key: key });
  if (error) throw error;
}

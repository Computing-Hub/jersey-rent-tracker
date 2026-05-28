// ============================================================
// Firebase Configuration for Jersey Rent Tracker
// Replace with your own Firebase project credentials
// ============================================================
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, Timestamp }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// TODO: Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let db = null;
let useFirebase = false;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  // Quick test - if config is placeholder, fall back to localStorage
  if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    useFirebase = true;
    console.log('[RentTracker] Firebase connected');
  } else {
    console.log('[RentTracker] Firebase not configured, using localStorage');
  }
} catch (e) {
  console.log('[RentTracker] Firebase init failed, using localStorage', e);
}

const COLLECTION = 'rent_submissions';
const LOCAL_KEY = 'jrt_submissions';

// ---- WRITE ----
export async function saveSubmission(entry) {
  const record = { ...entry, ts: Date.now() };
  if (useFirebase) {
    try {
      await addDoc(collection(db, COLLECTION), {
        ...record,
        createdAt: Timestamp.now()
      });
      // Also cache locally
      _localSave(record);
      return true;
    } catch (e) {
      console.error('[RentTracker] Firestore write failed', e);
      _localSave(record);
      return true;
    }
  } else {
    _localSave(record);
    return true;
  }
}

// ---- READ ----
export async function getSubmissions() {
  if (useFirebase) {
    try {
      const q = query(collection(db, COLLECTION), orderBy('ts', 'desc'), limit(500));
      const snap = await getDocs(q);
      const results = [];
      snap.forEach(doc => results.push(doc.data()));
      // Update local cache
      localStorage.setItem(LOCAL_KEY, JSON.stringify(results));
      return results;
    } catch (e) {
      console.error('[RentTracker] Firestore read failed, using cache', e);
      return _localGet();
    }
  }
  return _localGet();
}

// ---- LOCAL FALLBACK ----
function _localSave(record) {
  const data = _localGet();
  data.unshift(record);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
}

function _localGet() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
  } catch {
    return [];
  }
}

export { useFirebase };

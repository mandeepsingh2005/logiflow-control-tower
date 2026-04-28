// utils.js - helper functions for LogiFlow dashboard

// Generate a unique shipment ID
export function generateId() {
  return 'SHIP_' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Format a Date object as YYYY-MM-DD HH:mm
export function formatDate(date) {
  const pad = (n) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Simple debounce to limit rapid calls
export function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Theme handling: toggle, save, load
export function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  btn.addEventListener('click', () => {
    root.classList.toggle('dark');
    const isDark = root.classList.contains('dark');
    localStorage.setItem('logiflow-theme', isDark ? 'dark' : 'light');
    // swap icons
    document.getElementById('sun-icon').classList.toggle('hidden', !isDark);
    document.getElementById('moon-icon').classList.toggle('hidden', isDark);
  });
}

// Persistence (optional) – store shipments array in localStorage
export function saveShipments(shipments) {
  try {
    localStorage.setItem('logiflow-shipments', JSON.stringify(shipments));
  } catch (e) { console.warn('Unable to save shipments', e); }
}

export function loadShipments() {
  try {
    const data = localStorage.getItem('logiflow-shipments');
    return data ? JSON.parse(data) : null;
  } catch (e) { console.warn('Unable to load shipments', e); return null; }
}

// Generate mock shipment data with random ETA (within next 2‑5 minutes)
export function generateMockShipments(count = 5) {
  const origins = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'];
  const destinations = ['London', 'Paris', 'Berlin', 'Tokyo', 'Sydney'];
  const now = new Date();
  const shipments = [];
  for (let i = 0; i < count; i++) {
    const eta = new Date(now.getTime() + (2 + Math.random() * 3) * 60 * 1000);
    shipments.push({
      id: generateId(),
      origin: origins[Math.floor(Math.random() * origins.length)],
      destination: destinations[Math.floor(Math.random() * destinations.length)],
      eta: eta.toISOString(),
      status: 'in_transit',
    });
  }
  return shipments;
}

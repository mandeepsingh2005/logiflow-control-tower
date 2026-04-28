import {
  generateMockShipments,
  loadShipments,
  saveShipments,
  formatDate,
  initThemeToggle,
  generateId
} from './utils.js';

import {
  initMap,
  highlightShipment,
  updateShipmentPositions,
  addMarkerForShipment
} from './map.js';

import { initCharts, updateCharts } from './charts.js';

let shipments = [];

// DOM elements
const tableBody = document.getElementById('shipment-table-body');
const totalCountEl = document.getElementById('total-count');
const delayedCountEl = document.getElementById('delayed-count');
const deliveredCountEl = document.getElementById('delivered-count');
const alertsList = document.getElementById('alerts-list');
const addBtn = document.getElementById('add-shipment');

function init() {
  const stored = loadShipments();
  shipments = stored && stored.length ? stored : generateMockShipments(7);

  saveShipments(shipments);

  initThemeToggle();
  initMap(shipments);
  initCharts(shipments);

  renderAll();
  scheduleRefresh();

  addBtn.addEventListener('click', addShipment);
}

function renderAll() {
  renderTable();
  renderKPIs();
  renderAlerts();
  updateCharts(shipments);
}

function renderTable() {
  tableBody.innerHTML = '';

  shipments.forEach(s => {
    const tr = document.createElement('tr');

    tr.className =
      'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition';

    tr.innerHTML = `
      <td class="px-2 py-1">${s.id}</td>
      <td class="px-2 py-1">${s.origin}</td>
      <td class="px-2 py-1">${s.destination}</td>
      <td class="px-2 py-1">${formatDate(new Date(s.eta))}</td>
      <td class="px-2 py-1">
        <span class="badge ${badgeClass(s.status)}">
          ${displayStatus(s.status)}
        </span>
      </td>
    `;

    tr.addEventListener('click', () => highlightShipment(s.id));

    tableBody.appendChild(tr);
  });
}

function badgeClass(status) {
  if (status === 'delayed') return 'delayed';
  if (status === 'delivered') return 'delivered';
  return 'in-transit';
}

function displayStatus(status) {
  return status.replace('_', ' ');
}

function renderKPIs() {
  totalCountEl.textContent = shipments.length;

  const delayed = shipments.filter(s => s.status === 'delayed').length;
  const delivered = shipments.filter(s => s.status === 'delivered').length;

  delayedCountEl.textContent = delayed;
  deliveredCountEl.textContent = delivered;
}

function renderAlerts() {
  const delayedShipments = shipments.filter(s => s.status === 'delayed');

  alertsList.innerHTML = '';

  if (delayedShipments.length === 0) {
    alertsList.innerHTML =
      `<li class="text-green-500">✅ No issues detected</li>`;
    return;
  }

  delayedShipments.forEach(s => {
    const li = document.createElement('li');
    li.className = 'text-red-500 flex items-center gap-2';

    li.innerHTML = `
      ⚠ Shipment <strong>${s.id}</strong> is delayed
    `;

    alertsList.appendChild(li);
  });
}

function scheduleRefresh() {
  setInterval(() => {
    smartTrackingEngine();
    updateShipmentPositions();
    renderAll();
    saveShipments(shipments);
  }, 3000);
}

function smartTrackingEngine() {
  const now = new Date();

  shipments.forEach(s => {
    if (s.status === 'in_transit' && new Date(s.eta) <= now) {
      s.status = 'delayed';
    }

    if (s.status !== 'delivered' && Math.random() < 0.05) {
      s.status = 'delivered';
    }
  });
}

function addShipment() {
  const origin = prompt('Enter origin');
  const destination = prompt('Enter destination');

  if (!origin || !destination) return;

  const eta = new Date(Date.now() + 3 * 60000);

  const newShipment = {
    id: generateId(),
    origin,
    destination,
    eta: eta.toISOString(),
    status: 'in_transit'
  };

  shipments.push(newShipment);

  // FIXED: map marker handled in map.js
  addMarkerForShipment(newShipment);

  renderAll();
  saveShipments(shipments);
}

init();
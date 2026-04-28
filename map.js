let map;
let shipmentMarkers = {};

function randomLatLng() {
  const lat = -30 + Math.random() * 120;
  const lng = -180 + Math.random() * 360;
  return [lat, lng];
}

export function initMap(shipments) {
  map = L.map('map').setView([20, 0], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  shipments.forEach(addMarkerForShipment);
}

export function addMarkerForShipment(s) {
  const [lat, lng] = randomLatLng();

  const marker = L.marker([lat, lng]).addTo(map);

  marker.bindTooltip(`${s.id}: ${s.status}`);

  shipmentMarkers[s.id] = { marker, lat, lng };
}

export function highlightShipment(id) {
  const entry = shipmentMarkers[id];
  if (!entry) return;

  const { marker, lat, lng } = entry;

  map.setView([lat, lng], 5);
  marker.openTooltip();
}

export function updateShipmentPositions() {
  Object.values(shipmentMarkers).forEach(entry => {
    entry.lat += (Math.random() - 0.5) * 0.5;
    entry.lng += (Math.random() - 0.5) * 0.5;

    entry.marker.setLatLng([entry.lat, entry.lng]);
  });
}
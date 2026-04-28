// charts.js - Chart.js integration for LogiFlow

let statusPieChart;
let updatesLineChart;

export function initCharts(shipments) {
  const ctxPie = document.getElementById('status-pie').getContext('2d');
  const ctxLine = document.getElementById('updates-line').getContext('2d');

  const statusCounts = getStatusCounts(shipments);
  statusPieChart = new Chart(ctxPie, {
    type: 'pie',
    data: {
      labels: ['In Transit', 'Delayed', 'Delivered'],
      datasets: [{
        data: [statusCounts.in_transit, statusCounts.delayed, statusCounts.delivered],
        backgroundColor: ['#93c5fd', '#fca5a5', '#86efac'],
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: true, text: 'Shipment Status Distribution' },
      },
    },
  });

  updatesLineChart = new Chart(ctxLine, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Updates Over Time',
        data: [],
        fill: false,
        borderColor: '#3b82f6',
        tension: 0.1,
      }],
    },
    options: {
      responsive: true,
      scales: { x: { display: true, title: { display: true, text: 'Time' } }, y: { display: true, title: { display: true, text: '# Updates' } } },
      plugins: { legend: { display: false } },
    },
  });
}

export function updateCharts(shipments) {
  const counts = getStatusCounts(shipments);
  // Update pie chart
  if (statusPieChart) {
    statusPieChart.data.datasets[0].data = [counts.in_transit, counts.delayed, counts.delivered];
    statusPieChart.update();
  }
  // Update line chart with cumulative updates count
  if (updatesLineChart) {
    const now = new Date();
    updatesLineChart.data.labels.push(now.toLocaleTimeString());
    const total = shipments.length;
    updatesLineChart.data.datasets[0].data.push(total);
    // keep last 20 points
    if (updatesLineChart.data.labels.length > 20) {
      updatesLineChart.data.labels.shift();
      updatesLineChart.data.datasets[0].data.shift();
    }
    updatesLineChart.update();
  }
}

function getStatusCounts(shipments) {
  const counts = { in_transit: 0, delayed: 0, delivered: 0 };
  shipments.forEach(s => {
    if (s.status === 'in_transit') counts.in_transit++;
    else if (s.status === 'delayed') counts.delayed++;
    else if (s.status === 'delivered') counts.delivered++;
  });
  return counts;
}

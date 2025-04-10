window.addEventListener('DOMContentLoaded', async () => {
  const ctx = document.getElementById('analyticsChart').getContext('2d');
  let analytics = [];
  try {
    const res = await fetch('/api/analytics');
    analytics = await res.json();
  } catch {
    console.warn('Failed to fetch analytics data');
  }

  // Aggregate events by date
  const counts = {};
  analytics.forEach(e => {
    const day = new Date(e.timestamp).toISOString().split('T')[0];
    counts[day] = (counts[day] || 0) + 1;
  });

  const labels = Object.keys(counts).sort();
  const data = labels.map(d => counts[d]);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Events per Day',
        data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Radiation Admin Activity' }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
});
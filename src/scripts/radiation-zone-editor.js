const canvas = document.getElementById('zone-visualization');
const ctx = canvas.getContext('2d');
const panel = document.getElementById('zone-editor-panel');

let zones = [];
let selectedZone = null;
let debugVisible = true;

// Load zones from localStorage if available
function loadZones() {
  const saved = localStorage.getItem('radiationZones');
  if (saved) {
    zones = JSON.parse(saved);
  } else {
    zones = [];
  }
  selectedZone = null;
  renderZones();
  updateForm();
}

// Save zones to localStorage
function saveZones() {
  localStorage.setItem('radiationZones', JSON.stringify(zones));
}

// Add a new default zone
function addZone() {
  const newZone = {
    id: 'zone' + (zones.length + 1),
    shape: 'circle',
    position: { x: 100, y: 100 },
    radius: 50,
    width: 80,
    height: 60,
    points: [],
    intensity: 1.0,
    falloff: 0.5,
    active: true
  };
  zones.push(newZone);
  selectedZone = newZone;
  updateForm();
  renderZones();
}

// Update form inputs based on selected zone
function updateForm() {
  if (!selectedZone) return;
  document.getElementById('zone-id').value = selectedZone.id;
  document.getElementById('zone-shape').value = selectedZone.shape;
  document.getElementById('zone-pos-x').value = selectedZone.position.x;
  document.getElementById('zone-pos-y').value = selectedZone.position.y;
  document.getElementById('zone-radius').value = selectedZone.radius || 0;
  document.getElementById('zone-width').value = selectedZone.width || 0;
  document.getElementById('zone-height').value = selectedZone.height || 0;
  document.getElementById('zone-intensity').value = selectedZone.intensity;
  document.getElementById('zone-falloff').value = selectedZone.falloff;
  document.getElementById('zone-active').checked = selectedZone.active;
}

// Read form inputs into selected zone
function updateZoneFromForm() {
  if (!selectedZone) return;
  selectedZone.id = document.getElementById('zone-id').value;
  selectedZone.shape = document.getElementById('zone-shape').value;
  selectedZone.position.x = parseFloat(document.getElementById('zone-pos-x').value);
  selectedZone.position.y = parseFloat(document.getElementById('zone-pos-y').value);
  selectedZone.radius = parseFloat(document.getElementById('zone-radius').value);
  selectedZone.width = parseFloat(document.getElementById('zone-width').value);
  selectedZone.height = parseFloat(document.getElementById('zone-height').value);
  selectedZone.intensity = parseFloat(document.getElementById('zone-intensity').value);
  selectedZone.falloff = parseFloat(document.getElementById('zone-falloff').value);
  selectedZone.active = document.getElementById('zone-active').checked;
  renderZones();
}

// Render all zones on canvas
function renderZones() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!debugVisible) return;
  zones.forEach(zone => {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = zone.active ? 'red' : 'gray';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    if (zone.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(zone.position.x, zone.position.y, zone.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (zone.shape === 'rectangle') {
      ctx.fillRect(zone.position.x, zone.position.y, zone.width, zone.height);
      ctx.strokeRect(zone.position.x, zone.position.y, zone.width, zone.height);
    } else if (zone.shape === 'polygon' && zone.points.length > 2) {
      ctx.beginPath();
      ctx.moveTo(zone.points[0].x, zone.points[0].y);
      for (let i = 1; i < zone.points.length; i++) {
        ctx.lineTo(zone.points[i].x, zone.points[i].y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  });
}

// Toggle debug visualization
function toggleDebug() {
  debugVisible = !debugVisible;
  renderZones();
}

// Event listeners
document.getElementById('add-zone-btn').onclick = addZone;
document.getElementById('save-zones-btn').onclick = () => {
  updateZoneFromForm();
  saveZones();
};
document.getElementById('load-zones-btn').onclick = loadZones;
document.getElementById('toggle-debug-btn').onclick = toggleDebug;

// Update zone on form change
['zone-id', 'zone-shape', 'zone-pos-x', 'zone-pos-y', 'zone-radius', 'zone-width', 'zone-height', 'zone-intensity', 'zone-falloff', 'zone-active'].forEach(id => {
  const el = document.getElementById(id);
  if (el.type === 'checkbox') {
    el.onchange = updateZoneFromForm;
  } else {
    el.oninput = updateZoneFromForm;
  }
});

// Expose zones globally for integration
window.getRadiationZones = () => zones;

// Initialize
loadZones();
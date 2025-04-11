import { io } from 'https://cdn.socket.io/4.7.2/socket.io.esm.min.js';

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const zoneList = document.getElementById('zone-list');
  const addZoneBtn = document.getElementById('add-zone-btn');
  const versionList = document.getElementById('version-list');
  const presetList = document.getElementById('preset-list');
  const savePresetBtn = document.getElementById('save-preset-btn');

  let zones = [];
  let socket;

  async function init() {
    setupSocket();
    await loadZones();
    await loadVersions();
    await loadPresets();
  }

  function setupSocket() {
    socket = io(); // assumes same origin server
    socket.on('connect', () => {});
    socket.on('zonesUpdated', async () => {
        await loadZones();
    });
    socket.on('presetsUpdated', async () => {
      await loadPresets();
    });
    socket.on('versionsUpdated', async () => {
      await loadVersions();
    });
  }

  async function loadZones() {
    try {
      const res = await fetch('/api/radiation-zones');
      zones = await res.json();
    } catch {
      const saved = localStorage.getItem('radiationZones');
      zones = saved ? JSON.parse(saved) : [];
    }
    updateGlobalZones();
    renderZones();
  }

  async function saveZones(emit = true) {
    try {
      await fetch('/api/radiation-zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(zones),
      });
    } catch {
      localStorage.setItem('radiationZones', JSON.stringify(zones));
    }
    updateGlobalZones();
    await saveVersion(false);
    renderZones();
    if (emit && socket) socket.emit('updateZones');
    trackEvent('saveZones');
  }

  function updateGlobalZones() {
    window.getRadiationZones = () => zones;
  }

  function resolveZone(zone) {
    if (!zone.templateId) return zone;
    const template = zones.find(z => z.id === zone.templateId);
    if (!template) return zone;
    return { ...template, ...zone, templateId: zone.templateId };
  }

  function renderZones() {
    zoneList.innerHTML = '';
    zones.forEach((zoneRaw, index) => {
      const zone = resolveZone(zoneRaw);
      const div = document.createElement('div');
      div.className = 'zone-item';
      div.innerHTML = `
        <strong>${zone.id}</strong> (${zone.shape}) - Intensity: ${zone.intensity} - Active: ${zone.active}
        <button data-action="edit" data-index="${index}">Edit</button>
        <button data-action="delete" data-index="${index}">Delete</button>
      `;
      zoneList.appendChild(div);
    });
  }

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
      active: true,
      templateId: null
    };
    zones.push(newZone);
    saveZones();
    trackEvent('addZone');
  }

  function editZone(index) {
    const zone = zones[index];
    const id = prompt('Zone ID:', zone.id);
    if (id === null) return;
    const shape = prompt('Shape (circle, rectangle, polygon):', zone.shape);
    if (shape === null) return;
    const x = parseFloat(prompt('Position X:', zone.position.x));
    const y = parseFloat(prompt('Position Y:', zone.position.y));
    const radius = parseFloat(prompt('Radius:', zone.radius));
    const width = parseFloat(prompt('Width:', zone.width));
    const height = parseFloat(prompt('Height:', zone.height));
    const intensity = parseFloat(prompt('Intensity:', zone.intensity));
    const falloff = parseFloat(prompt('Falloff:', zone.falloff));
    const active = confirm('Is Active? (OK=true, Cancel=false)');
    const templateId = prompt('Template ID to inherit from (blank for none):', zone.templateId || '') || null;

    zone.id = id;
    zone.shape = shape;
    zone.position = { x, y };
    zone.radius = radius;
    zone.width = width;
    zone.height = height;
    zone.intensity = intensity;
    zone.falloff = falloff;
    zone.active = active;
    zone.templateId = templateId;

    saveZones();
    trackEvent('editZone');
  }

  function deleteZone(index) {
    if (!confirm('Delete this zone?')) return;
    zones.splice(index, 1);
    saveZones();
    trackEvent('deleteZone');
  }

  async function saveVersion(emit = true) {
    try {
      await fetch('/api/radiation-versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          zones
        }),
      });
    } catch {
      const history = JSON.parse(localStorage.getItem('radiationZonesHistory') || '[]');
      history.push({
        timestamp: new Date().toISOString(),
        zones: JSON.parse(JSON.stringify(zones))
      });
      localStorage.setItem('radiationZonesHistory', JSON.stringify(history));
    }
    await loadVersions();
    if (emit && socket) socket.emit('updateVersions');
    trackEvent('saveVersion');
  }

  async function loadVersions() {
    let history;
    try {
      const res = await fetch('/api/radiation-versions');
      history = await res.json();
    } catch {
      history = JSON.parse(localStorage.getItem('radiationZonesHistory') || '[]');
    }
    versionList.innerHTML = '';
    history.forEach((entry, index) => {
      const div = document.createElement('div');
      div.className = 'version-item';
      div.innerHTML = `
        <span>${new Date(entry.timestamp).toLocaleString()}</span>
        <button data-action="rollback" data-index="${index}">Rollback</button>
      `;
      versionList.appendChild(div);
    });
  }

  async function rollbackVersion(index) {
    let history;
    try {
      const res = await fetch('/api/radiation-versions');
      history = await res.json();
    } catch {
      history = JSON.parse(localStorage.getItem('radiationZonesHistory') || '[]');
    }
    if (!history[index]) return;
    zones = JSON.parse(JSON.stringify(history[index].zones));
    await saveZones();
    trackEvent('rollbackVersion');
  }

  async function savePreset() {
    const name = prompt('Preset name:');
    if (!name) return;
    try {
      await fetch('/api/radiation-presets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          zones
        }),
      });
    } catch {
      const presets = JSON.parse(localStorage.getItem('radiationPresets') || '[]');
      presets.push({
        name,
        zones: JSON.parse(JSON.stringify(zones))
      });
      localStorage.setItem('radiationPresets', JSON.stringify(presets));
    }
    await loadPresets();
    if (socket) socket.emit('updatePresets');
    trackEvent('savePreset');
  }

  async function loadPresets() {
    let presets;
    try {
      const res = await fetch('/api/radiation-presets');
      presets = await res.json();
    } catch {
      presets = JSON.parse(localStorage.getItem('radiationPresets') || '[]');
    }
    presetList.innerHTML = '';
    presets.forEach((preset, index) => {
      const div = document.createElement('div');
      div.className = 'preset-item';
      div.innerHTML = `
        <strong>${preset.name}</strong>
        <button data-action="load-preset" data-index="${index}">Load</button>
        <button data-action="delete-preset" data-index="${index}">Delete</button>
      `;
      presetList.appendChild(div);
    });
  }

  async function loadPreset(index) {
    let presets;
    try {
      const res = await fetch('/api/radiation-presets');
      presets = await res.json();
    } catch {
      presets = JSON.parse(localStorage.getItem('radiationPresets') || '[]');
    }
    if (!presets[index]) return;
    zones = JSON.parse(JSON.stringify(presets[index].zones));
    await saveZones();
    trackEvent('loadPreset');
  }

  async function deletePreset(index) {
    let presets;
    try {
      const res = await fetch('/api/radiation-presets');
      presets = await res.json();
    } catch {
      presets = JSON.parse(localStorage.getItem('radiationPresets') || '[]');
    }
    if (!presets[index]) return;
    if (!confirm('Delete this preset?')) return;
    presets.splice(index, 1);
    try {
      await fetch('/api/radiation-presets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(presets),
      });
    } catch {
      localStorage.setItem('radiationPresets', JSON.stringify(presets));
    }
    await loadPresets();
    if (socket) socket.emit('updatePresets');
    trackEvent('deletePreset');
  }

  function trackEvent(eventName) {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: eventName, timestamp: new Date().toISOString() }),
    }).catch(() => {});
  }

  // Event listeners
  addZoneBtn.onclick = addZone;
  savePresetBtn.onclick = savePreset;

  zoneList.onclick = (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const index = parseInt(btn.dataset.index);
    if (btn.dataset.action === 'edit') editZone(index);
    else if (btn.dataset.action === 'delete') deleteZone(index);
  };

  versionList.onclick = (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const index = parseInt(btn.dataset.index);
    if (btn.dataset.action === 'rollback') rollbackVersion(index);
  };

  presetList.onclick = (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const index = parseInt(btn.dataset.index);
    if (btn.dataset.action === 'load-preset') loadPreset(index);
    else if (btn.dataset.action === 'delete-preset') deletePreset(index);
  };

  init();
});
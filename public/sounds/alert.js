// Generate alert sound using Web Audio API
const generateAlertSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const alertBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.5, audioContext.sampleRate);
  const alertData = alertBuffer.getChannelData(0);
  
  // Create a Fallout-style alert sound with oscillating frequency
  const baseFreq = 800; // Base frequency in Hz
  const freqRange = 400; // Frequency range for oscillation
  const oscillationSpeed = 15; // Speed of oscillation
  
  for (let i = 0; i < alertBuffer.length; i++) {
    const t = i / audioContext.sampleRate; // Time in seconds
    
    // Oscillating frequency
    const freq = baseFreq + Math.sin(t * oscillationSpeed) * freqRange;
    
    // Generate sine wave with oscillating frequency
    alertData[i] = 0.5 * Math.sin(2 * Math.PI * freq * t);
    
    // Apply envelope (attack, decay, sustain, release)
    if (t < 0.05) {
      // Attack
      alertData[i] *= t / 0.05;
    } else if (t > 0.4) {
      // Release
      alertData[i] *= (0.5 - t) / 0.1;
    }
    
    // Add some distortion for that Fallout terminal feel
    if (Math.random() < 0.05) {
      alertData[i] *= 0.8 + Math.random() * 0.4;
    }
  }
  
  // Export to WAV
  const wavData = audioBufferToWav(alertBuffer);
  const blob = new Blob([wavData], { type: 'audio/wav' });
  
  // Download the file
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'alert.wav';
  a.click();
  URL.revokeObjectURL(url);
};

// Convert AudioBuffer to WAV format
function audioBufferToWav(buffer) {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2;
  const sampleRate = buffer.sampleRate;
  const wavBuffer = new ArrayBuffer(44 + length);
  const view = new DataView(wavBuffer);
  
  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(view, 8, 'WAVE');
  
  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // subchunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numOfChan, true); // num of channels
  view.setUint32(24, sampleRate, true); // sample rate
  view.setUint32(28, sampleRate * numOfChan * 2, true); // byte rate
  view.setUint16(32, numOfChan * 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  
  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, length, true);
  
  // Write the PCM samples
  const data = buffer.getChannelData(0);
  let offset = 44;
  for (let i = 0; i < data.length; i++) {
    const sample = Math.max(-1, Math.min(1, data[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    offset += 2;
  }
  
  return wavBuffer;
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// Call the function to generate the sound
generateAlertSound();

// Generate click sound using Web Audio API
const generateClickSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const clickBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.1, audioContext.sampleRate);
  const clickData = clickBuffer.getChannelData(0);
  
  // Create a short, sharp click sound
  for (let i = 0; i < clickBuffer.length; i++) {
    // Initial sharp attack
    if (i < clickBuffer.length * 0.01) {
      clickData[i] = Math.random() * 0.5;
    } 
    // Quick decay
    else {
      clickData[i] = Math.random() * 0.5 * Math.exp(-i / (clickBuffer.length * 0.05));
    }
  }
  
  // Export to WAV
  const wavData = audioBufferToWav(clickBuffer);
  const blob = new Blob([wavData], { type: 'audio/wav' });
  
  // Download the file
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'click.wav';
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
generateClickSound();

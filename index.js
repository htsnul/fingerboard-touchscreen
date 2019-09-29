var gAudioCtx = null;
var gGainNode = null;
var gTones = [];
var columnCount = 0;

class Tone {
  constructor(rowIndex, columnIndex) {
    this.scale = [-5, -10, -14, -19, -24, -29][rowIndex] + columnIndex;
    var scaleInOctave = (this.scale + 48) % 12;
    this.isBlackKey =  [1, 4, 6, 9, 11].indexOf(scaleInOctave) != -1;
    this.element = document.createElement('td');
    this.element.style.backgroundColor = this.isBlackKey ? '#eee' : '#fff';
    this.element.ontouchstart = (event) => {
      this.start();
      event.preventDefault();
    };
    this.element.ontouchend = (event) => {
      this.stop();
      event.preventDefault();
    };
    this.element.ontouchcancel = this.element.ontouchend;
    this.element.onmousedown = (event) => {
      this.start();
      event.preventDefault();
    }
    document.querySelectorAll('tr')[rowIndex].appendChild(this.element);
  }
  start() {
    if (this.oscillator) {
      return;
    }
    this.oscillator = gAudioCtx.createOscillator();
    this.oscillator.type = 'square';
    this.oscillator.frequency.value = 440 * Math.pow(2, this.scale / 12);
    this.oscillator.connect(gGainNode);
    this.oscillator.start();
    this.element.style.backgroundColor = this.isBlackKey ? '#edd' : '#fee';
  }
  stop() {
    if (!this.oscillator) {
      return;
    }
    this.oscillator.stop();
    this.oscillator = null;
    this.element.style.backgroundColor = this.isBlackKey ? '#eee' : '#fff';
  }
}

function start() {
  gAudioCtx = new AudioContext();
  gGainNode = gAudioCtx.createGain();
  gGainNode.gain.value = 0.25;
  gGainNode.connect(gAudioCtx.destination);
  columnCount = parseInt(document.querySelector('.column-count-div input:checked').value);
  var y, x;
  for (y = 0; y < 6; ++y) {
    for (x = 0; x < columnCount; ++x) {
      gTones.push(new Tone(y, x));
    }
  }
  document.querySelector('table').onmouseup = (event) => {
    gTones.forEach(tone => tone.stop());
  };
  document.querySelector('.setting-div').hidden = true;
  document.querySelector('.fingerboard-table').hidden = false;
}

onload = () => {
  document.querySelector('button').onclick = start;
};


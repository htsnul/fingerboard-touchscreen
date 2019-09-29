'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

if (!window.AudioContext) {
  window.AudioContext = webkitAudioContext;
}

var gAudioCtx = null;
var gGainNode = null;
var gTones = [];

var Tone = (function () {
  function Tone(rowIndex, columnIndex) {
    var _this = this;

    _classCallCheck(this, Tone);

    this.scale = [-5, -10, -14, -19, -24, -29][rowIndex] + columnIndex;
    var scaleInOctave = (this.scale + 48) % 12;
    this.isBlackKey = [1, 4, 6, 9, 11].indexOf(scaleInOctave) != -1;
    this.element = document.createElement('td');
    this.element.style.backgroundColor = this.isBlackKey ? '#eee' : '#fff';
    this.element.ontouchstart = function (event) {
      _this.start();
      event.preventDefault();
    };
    this.element.ontouchend = function (event) {
      _this.stop();
      event.preventDefault();
    };
    this.element.ontouchcancel = this.element.ontouchend;
    this.element.onmousedown = function (event) {
      _this.start();
      event.preventDefault();
    };
    document.querySelectorAll('tr')[rowIndex].appendChild(this.element);
  }

  _createClass(Tone, [{
    key: 'start',
    value: function start() {
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
  }, {
    key: 'stop',
    value: function stop() {
      if (!this.oscillator) {
        return;
      }
      this.oscillator.stop();
      this.oscillator = null;
      this.element.style.backgroundColor = this.isBlackKey ? '#eee' : '#fff';
    }
  }]);

  return Tone;
})();

onload = function () {
  document.querySelector('button').onclick = function () {
    gAudioCtx = new AudioContext();
    gGainNode = gAudioCtx.createGain();
    gGainNode.gain.value = 0.25;
    gGainNode.connect(gAudioCtx.destination);
    var y, x;
    for (y = 0; y < 6; ++y) {
      for (x = 0; x < 23; ++x) {
        gTones.push(new Tone(y, x));
      }
    }
    document.querySelector('table').onmouseup = function (event) {
      gTones.forEach(function (tone) {
        return tone.stop();
      });
    };
    document.querySelector('button').hidden = true;
    document.querySelector('table').hidden = false;
  };
};


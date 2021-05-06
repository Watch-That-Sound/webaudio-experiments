class DetectorProcessor extends AudioWorkletProcessor {
  constructor(...args) {
    super(...args);
    console.log("inside detector", args);
    this.port.onmessage = (e) => {
      console.log(e.data);
      this.detectMute = e.data.detect === "mute";
      this.startTime = Date.now();
    };
  }
  process(inputs, outputs, params) {
    // console.log(this.startTime, inputs.length);
    const sumSqr = inputs[0][0].reduce((sumSqr, val) => sumSqr + val * val, 0);
    const rms = Math.sqrt(sumSqr / 128);
    this.port.postMessage({ volume: rms });
    if (this.startTime) {
      if (this.detectMute) {
        if (rms < 0.05) {
          console.log("found silence", sumSqr, rms);
          this.startTime = undefined;
        }
      }
    }
    return true;
  }
}

registerProcessor("detector", DetectorProcessor);

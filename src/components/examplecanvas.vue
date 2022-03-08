<template>
  <div>
    <div class="thumb-box">
      <div class="thumb-box-outer" :style="bg">
        <div class="thumb-box-inner">
          <canvas class="thumb" width="224" height="224" ref="thumb"></canvas>
        </div>
        <button
          class="record-button"
          ref="btn"
          @mousedown="handler"
          @mouseup="mouseUp"
        >
          <span>Add Sample</span>
        </button>
      </div>
      <p>
        <span>{{ total }}</span> examples
      </p>
    </div>
  </div>
</template>

<script>
import * as tfd from "@tensorflow/tfjs-data";
import * as tf from "@tensorflow/tfjs";
//@mousedown="handler" @mouseup="mouseUp"
export default {
  name: "examplecanvas",
  props: ["do", "label", "TMN", "dataset"],
  data() {
    return {
      btn: "",
      total: 0,
      bg: {background: 'conic-gradient(from '+ this.label*90 +'deg, hsl(162, 100%, 58%), hsl(270, 73%, 53%), hsl(162, 100%, 58%))'},
    };
  },
  methods: {
    async getImage() {
      let webcam = await tfd.webcam(this.do);
      const img = await webcam.capture();
      const processedImg = tf.tidy(() =>
        img.expandDims(0).toFloat().div(127).sub(1)
      );
      img.dispose();
      return processedImg;
    },
    async photo() {
      let dom = this.$refs["thumb"];
      let img = await this.getImage();
      this.dataset.addExample(this.TMN.predict(img), +this.label);
      this.draw(img, dom);
      img.dispose();
    },
    //Uncaught (in promise) DOMException: The play() request was interrupted by a new load request
    async handler(e) {
      mouseDown = true;
      while (mouseDown) {
        await this.photo();
        //document.body.setAttribute('data-active', CONTROLS[label]);  //点击样式
        //this.total = ++totals[this.label];
        ++this.total;
        await tf.nextFrame();
      }
      //document.body.removeAttribute('data-active');  //同上
    },
    draw(image, canvas) {
      const [width, height] = [224, 224];
      const ctx = canvas.getContext("2d");
      const imageData = new ImageData(width, height);
      const data = image.dataSync();
      for (let i = 0; i < height * width; ++i) {
        const j = i * 4;
        imageData.data[j + 0] = (data[i * 3 + 0] + 1) * 127;
        imageData.data[j + 1] = (data[i * 3 + 1] + 1) * 127;
        imageData.data[j + 2] = (data[i * 3 + 2] + 1) * 127;
        imageData.data[j + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
    },
    mouseUp() {
      mouseDown = false;
    },
  },
  mounted() {
    //this.bg = {background: 'blue'}
    //this.btn = this.refs["btn"];
    //this.btn.addEventListener("mousedown", () => handler(this.label));
    //this.btn.addEventListener("mouseup", () => (this.mouseDown = false));
  },
};

//const CONTROLS = ["up", "down", "left", "right"];
let mouseDown = false;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
button {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  color: transparent;
}
button span {
  background: #111;
  border: 1px solid #585858;
  border-radius: 3px;
  bottom: 9px;
  color: #f8f8f8;
  display: block;
  font-size: 8px;
  left: 9px;
  position: absolute;
  right: 9px;
  opacity: 0.5;
}
</style>
<template>
  <div @submitvalue="bindpara">
    <!---- loading页面 ---->
    <loading :class="{ none: !loading }"></loading>
    <!---- 游戏和训练页面 ---->
    <div ref="controller">
      <!--- 游戏界面 --->
      <iframe
        ref="game"
        title="Inline Frame Example"
        src="./static/web-mobile/index.html"
        frameborder="0"
      >
      </iframe>
      <!--- 训练界面 --->
      <div class="controller-panels colorful">
        <div class="panel-background">
          <div class="panel">
            <!-- 显示模型状态和loss -->
            <div class="loss">
              <p>{{ lossLabel }}</p>
            </div>
            <div class="panel-row params-webcam-row big-buttons">
              <selectlist :paralist="para" @submitvalue="bindpara"></selectlist>
              <div class="button-box">
                <tpbutton ButtonValue="训练模型" @event="train"></tpbutton>
                <tpbutton ButtonValue="准备游戏" @event="play"></tpbutton>

                <!-- 帮助指引，下同 -->
                <div class="help help-3">
                  <p>
                    3. 点击训练模型<br />按钮训练模型，<br />点击准备游戏后<br />即可点击上方的<br />PLAY开始游戏
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="sample-canvas-panel">
            <div class="sample-canvas-row panel-row">
              <div class="panel-cell-fill panel-cell help help-1">
                <p>
                  1. 点击这里的<br />上下左右四个<br />框框，对各个<br />方向的手势进行<br />拍照采样
                </p>
              </div>
              <!-- 采样按钮，下同 -->
              <examplecanvas
                class="panel-cell top"
                ref="hi"
                @click="test"
                :do="this.videodom"
                :label="0"
                :TMN="this.truncatedMobileNet"
                :dataset="this.controllerDataset"
              ></examplecanvas>
              <div class="panel-cell-fill panel-cell"></div>
            </div>
            <div class="sample-canvas-row panel-row">
              <examplecanvas
                class="panel-cell left"
                ref="hi"
                @click="test"
                :do="this.videodom"
                :label="3"
                :TMN="this.truncatedMobileNet"
                :dataset="this.controllerDataset"
              ></examplecanvas>
              <div class="panel-cell panel-cell-fill">
                <img height="128" width="128" src="../assets/joystick.png" />
              </div>
              <examplecanvas
                class="panel-cell right"
                ref="hi"
                @click="test"
                :do="this.videodom"
                :label="1"
                :TMN="this.truncatedMobileNet"
                :dataset="this.controllerDataset"
              ></examplecanvas>
            </div>
            <div class="sample-canvas-row panel-row">
              <div class="panel-cell-fill panel-cell"></div>
              <examplecanvas
                class="panel-cell bottom"
                ref="hi"
                @click="test"
                :do="this.videodom"
                :label="2"
                :TMN="this.truncatedMobileNet"
                :dataset="this.controllerDataset"
              ></examplecanvas>
              <div class="panel-cell-fill panel-cell"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- 摄像头实时显示画面 -->
      <div class="webcam-box-outer" ref="hello">
        <div class="webcam-box-inner">
          <video
            autoplay
            playsinline
            muted
            width="224"
            height="224"
            ref="video"
          ></video>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tpbutton from "./tpbutton";
import cam from "./cam";
import selectlist from "./selectlist";
import examplecanvas from "./examplecanvas";
import loading from "./loading";
import * as tfd from "@tensorflow/tfjs-data";
import * as tf from "@tensorflow/tfjs";
import { ControllerDataset } from "../controller_dataset";

export default {
  name: "page",
  components: {
    tpbutton: tpbutton,             //开始训练和准备游戏的按钮
    cam: cam,                       //摄像头实时显示的画面
    selectlist: selectlist,         //参数选择下拉列表
    examplecanvas: examplecanvas,   //采样按钮
    loading: loading,               //loading页面
  },
  data() {
    return {
      para: [
        { name: "Learning rate", para: [0.001, 0.0001, 0.00001] },
        { name: "Batch size", para: [0.05, 0.1, 0.4, 1] },
        { name: "Epochs", para: [10, 20, 40] },
        { name: "Hidden units", para: [10, 100, 200] },
      ],
      trainingpara: [0.001, 0.05, 10, 10],
      label: ['top', 'right', 'bottom', 'left'],
      videodom: "",
      truncatedMobileNet: "",
      controllerDataset: "",
      model: "",
      lossLabel: "The model is not ever trained",
      loss: 0,
      isPredicting: false,
      identified: "not playing",
      webcam: "",
      loading: true,
      none: { display: "none" },      
    };
  },
  methods: {
    //监听训练参数的变化
    bindpara(e) {
      this.trainingpara = e;
    },
    //启动摄像头
    camerainitial() {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then((success) => {
          this.isnotbtn = true;
          // 摄像头开启
          this.$refs["video"].srcObject = success;
          // 实时拍照效果
          this.$refs["video"].play();
        })
        .catch((error) => {
          this.$message.error(
            "摄像头开启失败，请检查摄像头是否可用！或者打开摄影头"
          );
        });
      console.log(this.$refs["video"]);
      this.videodom = this.$refs["video"];
    },
    //初始化模型
    async datasetinitial() {
      this.webcam = await tfd.webcam(this.videodom);
      this.truncatedMobileNet = await this.loadTruncatedMobileNet();
      this.controllerDataset = new ControllerDataset(4);
      const screenShot = await this.webcam.capture();
      this.truncatedMobileNet.predict(screenShot.expandDims(0));
      this.loading = false;
      this.$refs["controller"].style.display = "";
    },
    //使用在线模型，需要连接VPN
    async loadTruncatedMobileNet() {
      const mobilenet = await tf.loadLayersModel(
        "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json"
      );

      const layer = mobilenet.getLayer("conv_pw_13_relu");
      return tf.model({ inputs: mobilenet.inputs, outputs: layer.output });
    },
    //开始训练
    async train() {
      console.log("begin");
      if (this.controllerDataset.xs == null) {
        throw new Error("Add some examples before training!");
      }

      this.model = tf.sequential({
        layers: [
          tf.layers.flatten({
            inputShape: this.truncatedMobileNet.outputs[0].shape.slice(1),
          }),

          tf.layers.dense({
            units: this.trainingpara[3],
            activation: "relu",
            kernelInitializer: "varianceScaling",
            useBias: true,
          }),

          tf.layers.dense({
            units: 4,
            kernelInitializer: "varianceScaling",
            useBias: false,
            activation: "softmax",
          }),
        ],
      });

      const optimizer = tf.train.adam(this.trainingpara[0]);

      this.model.compile({
        optimizer: optimizer,
        loss: "categoricalCrossentropy",
      });

      const batchSize = Math.floor(
        this.controllerDataset.xs.shape[0] * this.trainingpara[1]
      );
      if (!(batchSize > 0)) {
        throw new Error(
          `Batch size is 0 or NaN. Please choose a non-zero fraction.`
        );
      }

      await this.model.fit(
        this.controllerDataset.xs,
        this.controllerDataset.ys,
        {
          batchSize,
          epochs: this.trainingpara[2],
          callbacks: {
            onBatchEnd: async (batch, logs) => {
              this.lossLabel = "Training Loss: " + logs.loss.toFixed(5);
              this.loss = logs.loss.toFixed(5);
            },
          },
        }
      );
      window.isTrained = true;
    },
    //准备游戏
    async play() {
      if(!window.isTrained) {
        alert('请先完成训练！');
        return;
      }
      this.isPredicting = true;
      window.isPlaying = true;
      this.lossLabel = "Playing in Loss: " + this.loss;
      while (this.isPredicting) {
        const img = await this.getImage();

        const embeddings = this.truncatedMobileNet.predict(img);

        const predictions = this.model.predict(embeddings);

        const predictedClass = predictions.as1D().argMax();
        const classId = (await predictedClass.data())[0];
        img.dispose();
        if(this.identified != classId) {
          document.body.removeAttribute('data-active');
          document.body.setAttribute('data-active', this.label[classId]);
        }
        this.identified = classId;
        window.modelResult = this.identified;
        console.log(classId);       
        await tf.nextFrame();
      }
    },
    //使用摄像头拍照
    async getImage() {
      const img = await this.webcam.capture();
      //使用tidy函数清除中间张量
      const processedImg = tf.tidy(() =>
        img.expandDims(0).toFloat().div(127).sub(1)
      );
      img.dispose();
      return processedImg;
    },
  },
  //启动摄像头，模型初始化
  mounted() {
    this.camerainitial();
    this.datasetinitial();
    window.isPlaying = false;
  },
};
</script>

<style>
@import "../../static/style.css";

video {
  height: 160px;
  transform: scaleX(-1);
}

button {
  background: none;
  border: none;
  box-sizing: border-box;
  cursor: pointer;
  margin: 0;
  padding: 0;
}

iframe {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #fff;
  overflow-y: hidden;
  width: 960px;
  height: 640px;
  margin: 0 auto;
  border-bottom: 1px dotted #2c2c2c;
}

.none {
  display: none;
}
</style>


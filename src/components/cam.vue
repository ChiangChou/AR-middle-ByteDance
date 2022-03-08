<template>
  <div class="webcam-box-outer">
    <div class="webcam-box-inner">
      <video autoplay playsinline muted width="224" height="224" ref="video"></video>
    </div>
  </div>
</template>

<script>
export default {
  name: "cam",
  mounted() {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then((success) => {
          this.isnotbtn = true;
          // 摄像头开启成功
          this.$refs["video"].srcObject = success;
          // 实时拍照效果
          this.$refs["video"].play();
        })
        .catch((error) => {
          this.$message.error(
            "摄像头开启失败，请检查摄像头是否可用！或者打开摄影头"
          );
          console.error("摄像头开启失败，请检查摄像头是否可用！");
        });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
video {
  height: 160px;
  transform: scaleX(-1);
}
</style>
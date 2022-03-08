<template>
   <div class="loading">
      <div class="pic">
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </div>
    </div>
</template>

<script>
export default {
  name: 'loading',
  data () {
    return {
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loading {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  background: #ffffff;
}
.loading .pic {
  width: 64px;
  height: 64px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.loading .pic i {
  display: block;
  float: left;
  width: 6px;
  height: 50px;
  background: #1E90FF;
  margin: 0 2px;
  transform: scaleY(0.4);
  animation: load 1.5s infinite;
}
.loading .pic i:nth-child(1) {
  animation-delay: 0.1s;
}
.loading .pic i:nth-child(2) {
  animation-delay: 0.2s;
}
.loading .pic i:nth-child(3) {
  animation-delay: 0.3s;
}
.loading .pic i:nth-child(4) {
  animation-delay: 0.4s;
}
.loading .pic i:nth-child(5) {
  animation-delay: 0.5s;
}

@keyframes load {
  0% {
    transform: scaleY(0.4);
  }
  30% {
    transform: scaleY(1);
  }
  80%{
    transform: scaleY(0.4);
  }
}
</style>

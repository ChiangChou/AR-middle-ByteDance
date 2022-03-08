<template>
  <button @click="train">
    <span>{{ ButtonValue }}</span>
  </button>
</template>

<script>
export default {
  name: "tpbutton",
  props: ["ButtonValue"],
  methods:{
    train(){
      this.$emit("event");
    }
  },
  data(){
    return{

    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
button{
  margin-top: 20px;
}
</style>
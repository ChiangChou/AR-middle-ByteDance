<template>
  <div class="dropdown">
    <label>{{ label }}</label>
    <div class="select">
      <select @change="getval" ref="value">
        <option v-for="(item, index) in optionlist" :key="index">
          {{ item }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>

export default {
  name: "selectlabel",
  props: ["optionlist", "label", "idx"],
  methods: {
    getval(){
      //这个+很关键，否则传的是string
      let val = {v:+this.$refs["value"].value, i:this.idx};
      this.$emit('getvalue', val)
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dropdown {
  flex-direction: column;
  width: 125px;
  margin-bottom: 10px;
}
.dropdown label {
  color: #2c2c2c;
  font-size: 14px;
  display: block;
  font-weight: 300;
}
.dropdown .select {
  position: relative;
}
.dropdown .select select {
  /* 隐藏原生样式 */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;
  border: none;
  border-bottom: dotted 1px #2c2c2c;
  border-radius: 0;
  color: #8f8f8f;
  display: block;
  font-size: 14px;
  outline: none;
  padding: 5px 0;
  width: 100%;
}
.dropdown .select::after {
  content: '';
  background-image: url('~@/assets/dropdown.png');
  background-size: 100% 100%;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 2px;
  right: 0;
  display: inline-block;
  pointer-events: none;
}
</style>
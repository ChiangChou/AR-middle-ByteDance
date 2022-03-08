<template>
  <div>
    <!-- 将几个select整合起来 -->
    <selectlabel
      v-for="(item, index) in paralist"
      :key="index"
      :optionlist="item.para"
      :label="item.name"
      :idx="index"
      @getvalue="submitvalue"
    ></selectlabel>
    <div class="help help-2">
      <p>
        2.调整训练参数
      </p>
    </div>
  </div>
</template>

<script>
import selectlabel from "./select";

export default {
  name: "selectlist",
  props: ["paralist"],
  components: {
    selectlabel: selectlabel,
  },
  methods: {
    submitvalue(e) {
      this.list[e.i] = e.v;
      this.$emit("submitvalue", this.list);
    },
  },
  data() {
    return {
      list: [0.1, 0.05, 10, 10],
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  display: flex;
  flex-direction: column;
}
</style>
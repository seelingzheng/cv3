<template>
  <div class="panel" :style="{'left':left+'px','top':top+'px'}">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "",

  props: ["left", "top"],
  data() {
    return {};
  },

  methods: {}
};
</script>

<style lang = 'scss' scoped >
.panel {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  min-width: 300px;
  min-height: 30px;
  z-index: 1;
  border-radius: 5px;
  border: 1px solid #ccc;
}
</style>
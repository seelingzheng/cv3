<template>
  <div>
    <base-cesium @getViewer="getViewer" :imgurl="imgurl"></base-cesium>
  </div>
</template>

<script>
import Cesium from "cesium/Cesium";
import {BaseCesium} from "@/components";

export default {
  components: {
    BaseCesium
  },
  data() {
    return {
      viewer: null,
      imgurl: "" //"/images/world.jpg"
    };
  },

  mounted() {},
  methods: {
    getViewer(v) {
      this.viewer = v;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
</style>


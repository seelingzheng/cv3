<template>
  <div>
    <base-cesium @getViewer="getViewer">
      <split-layer></split-layer>
    </base-cesium>
  </div>
</template>

<script>
import Cesium from "cesium/Cesium";
import { BaseCesium } from "@/components";
import { SplitLayer } from "@/components/cesiumExtend";

export default {
  components: {
    BaseCesium,
    SplitLayer
  },
  data() {
    return {
      viewer: null
      // imgurl: "/images/world.jpg"
    };
  },

  mounted() {},
  methods: {
    getViewer(v) {
      this.viewer = v;
      v.imageryLayers.remove(v.imageryLayers.get(0));
      v.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url:
            "https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
          subdomains: ["1", "2", "3", "4"]
        })
      );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
</style>


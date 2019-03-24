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
    },
    loadModel() {
      this.viewer.entities.add({
        name: "Spider",
        position: Cesium.Cartesian3.fromDegrees(104.063321, 30.59552, 0),
        orientation: Cesium.Transforms.headingPitchRollQuaternion(
          Cesium.Cartesian3.fromDegrees(104.063321, 30.59552, 0),
          new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(135), 0, 0)
        ),
        model: {
          uri: "/data/gltf/Spider.gltf",
          minimumPixelSize: 28,
          maximumScale: 200
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
</style>


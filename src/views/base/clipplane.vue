<template>
  <div>
    <base-cesium @getViewer="getViewer" :imgurl="imgurl"></base-cesium>
  </div>
</template>

<script>
import Cesium from "cesium/Cesium";
import { BaseCesium } from "@/components";

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
      this.viewer.scene.globe.depthTestAgainstTerrain = true;
      var position = Cesium.Cartesian3.fromDegrees(128.055, 42.006, 500.0);
      var entity = this.viewer.entities.add({
        position: position,
        box: {
          dimensions: new Cesium.Cartesian3(1400.0, 1400.0, 2800.0),
          material: Cesium.Color.WHITE.withAlpha(0.3),
          outline: true,
          outlineColor: Cesium.Color.WHITE
        }
      });

      var globe = this.viewer.scene.globe;
      globe.depthTestAgainstTerrain = true;
      globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
        modelMatrix: entity.computeModelMatrix(Cesium.JulianDate.now()),
        planes: [
          new Cesium.Plane(new Cesium.Cartesian3(1.0, 0.0, 0.0), -700.0),
          new Cesium.Plane(new Cesium.Cartesian3(-1.0, 0.0, 0.0), -700.0),
          new Cesium.Plane(new Cesium.Cartesian3(0.0, 1.0, 0.0), -700.0),
          new Cesium.Plane(new Cesium.Cartesian3(0.0, -1.0, 0.0), -700.0)
        ],
        edgeWidth: 1.0,
        edgeColor: Cesium.Color.WHITE
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
</style>


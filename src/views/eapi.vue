<template>
  <div>
    <base-cesium @getViewer="getViewer"></base-cesium>
  </div>
</template>

<script>
import Cesium from "cesium/Cesium";
import BaseCesium from "../components/BaseCesium";

export default {
  name: "HelloCessium",
  components: {
    BaseCesium
  },
  data() {
    return {
      viewer: null
    };
  },

  mounted() {},
  methods: {
    getViewer(v) {
      this.viewer = v;
      // v.terrainProvider = Cesium.createWorldTerrain({
      //   requestWaterMask: true, // required for water effects
      //   requestVertexNormals: true // required for terrain lighting
      // });
      // 打开深度检测，那么在地形以下的对象不可见
      // v.scene.globe.depthTestAgainstTerrain = true;
      // 开启全球光照
      // v.scene.globe.enableLighting = true;

      this.addEntity();
    },
    addEntity() {
      var wyoming = this.viewer.entities.add({
        name: "Wyoming",
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray([
            -109.080842,
            45.002073,
            -105.91517,
            45.002073,
            -104.058488,
            44.996596,
            -104.053011,
            43.002989,
            -104.053011,
            41.003906,
            -105.728954,
            40.998429,
            -107.919731,
            41.003906,
            -109.04798,
            40.998429,
            -111.047063,
            40.998429,
            -111.047063,
            42.000709,
            -111.047063,
            44.476286,
            -111.05254,
            45.002073
          ]),

          height: 10000, //离地高度
          extrudedHeight: 1000, //物体高度
          material: Cesium.Color.RED.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK
        }
      });

      this.viewer.zoomTo(wyoming);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

<template>
  <div>
    <base-cesium @getViewer="getViewer" :imgurl="imgurl"></base-cesium>
  </div>
</template>

<script>
import Cesium from "cesium/Cesium";
import BaseCesium from "@/components/BaseCesium";

export default {
  components: {
    BaseCesium
  },
  data() {
    return {
      viewer: null,
      imgurl: "/images/world.jpg"
    };
  },

  mounted() {},
  methods: {
    getViewer(v) {
      // 删除默认的影像图层
      // v.imageryLayers.remove(v.imageryLayers.get(0));
      // 增加谷歌影像底图
      // v.imageryLayers.addImageryProvider(
      //   new Cesium.UrlTemplateImageryProvider({
      //     url: "http://www.google.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}",
      //     tilingScheme: new Cesium.WebMercatorTilingScheme()
      //   })
      // );
      v.terrainProvider = Cesium.createWorldTerrain({
        requestWaterMask: true, // required for water effects
        requestVertexNormals: true // required for terrain lighting
      });
      // 打开深度检测，那么在地形以下的对象不可见
      v.scene.globe.depthTestAgainstTerrain = true;
      // 开启全球光照
      v.scene.globe.enableLighting = true;
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

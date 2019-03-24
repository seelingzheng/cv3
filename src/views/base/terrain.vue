<template>
  <div>
    <div class="btn-box">
      <div
        v-for="(item, index) in Object.keys(terrainType)"
        :key="index"
        class="btn-box-item"
        :class="{'btn-box-item-selected':curName==item}"
        @click="getTerrain(item)"
      >{{item}}</div>
    </div>
    <base-cesium @getViewer="getViewer"></base-cesium>
  </div>
</template>
<script>
import Cesium from "cesium/Cesium";
import {BaseCesium} from "@/components";
export default {
  data() {
    return {
      viewer: null,
      curName: "create",
      terrainType: {
        create: {
          name: "createWorldTerrain",
          option: { requestVertexNormals: true, requestWaterMask: true }
        },
        ellipsoid: { name: "EllipsoidTerrainProvider" },
        cesiumTerrain: {
          name: "CesiumTerrainProvider",
          option: {
            url: "https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles",
            requestWaterMask: true,
            requestVertexNormals: true
          }
        },
        // vr: {
        //   name: "VRTheWorldTerrainProvider",
        //   option: {
        //     url: "http://www.vr-theworld.com/vr-theworld/tiles1.0.0/73/"
        //   }
        // }
      },
      terrains: {}
    };
  },
  components: {
    BaseCesium
  },
  methods: {
    getViewer(v) {
      this.viewer = v;
      var terrainProvider = Cesium.createWorldTerrain({
        requestVertexNormals: true,
        requestWaterMask: true
      });
      // 打开深度检测，那么在地形以下的对象不可见
      this.viewer.scene.globe.depthTestAgainstTerrain = true;
      this.viewer.terrainProvider = terrainProvider;
      this.viewer.scene.globe.enableLighting = true;
      this.flyto();
    },
    getTerrain(name) {
      let terrain = this.terrains[name];
      if (!terrain) {
        let terrainObj = this.terrainType[name];
        if (terrainObj.option) {
          terrain = new Cesium[terrainObj.name](terrainObj.option);
        } else {
          terrain = new Cesium[terrainObj.name]();
        }
        this.terrains[name] = terrain;
      }
      this.curName = name;
      this.viewer.terrainProvider = terrain;
      this.flyto();
    },
    flyto() {
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          83.093521,
          33.474684,
          5000.0
        ),
        orientation: {
          heading: Cesium.Math.toRadians(175.0),
          pitch: Cesium.Math.toRadians(-35.0),
          roll: 0.0
        }
      });
    }
  }
};
</script>
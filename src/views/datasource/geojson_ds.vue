<template>
  <div>
    <div class="btn-box">
      <div
        v-for="(item, index) in cityList "
        :key="index"
        class="btn-box-item"
        :class="{'btn-box-item-selected':curName==item}"
        @click="getGeoJSON(item)"
      >{{item}}</div>
    </div>
    <div class="btn-box" style="top:60px">
      <div
        class="btn-box-item"
        :class="{'btn-box-item-selected':curStyleName=='basic'}"
        @click="getStyleType('basic')"
      >Basic Style</div>
      <div
        class="btn-box-item"
        :class="{'btn-box-item-selected':curStyleName=='default'}"
        @click="getStyleType('default')"
      >Default Style</div>
      <div
        class="btn-box-item"
        :class="{'btn-box-item-selected':curStyleName=='custom'}"
        @click="getStyleType('custom')"
      >Custom Style</div>
    </div>
    <base-cesium @getViewer="getViewer"></base-cesium>
  </div>
</template>

<script>
import Cesium from "cesium/Cesium";
import {BaseCesium} from "@/components";
import * as turf from "@turf/turf";
export default {
  components: {
    BaseCesium
  },
  data() {
    return {
      viewer: null,
      cityList: [],
      curName: "",
      dataSources: {},
      curDataSource: null,
      curStyleName: "basic",
      folder: "data/datasource/china-geojson"
    };
  },

  beforeMount() {
    let vm = this;
    let fullpath = `${vm.folder}`;
    console.log(fullpath);
    let files = require.context(
      "../../../public/data/datasource/china-geojson",
      true,
      /\.json$/
    );
    console.log(files.keys());
    vm.cityList = _.map(files.keys(), item => {
      return item
        .split("/")
        .pop()
        .split(".")
        .shift();
    });
    console.log(vm.cityList);
  },
  mounted() {},
  methods: {
    getViewer(v) {
      this.viewer = v;
      v.terrainProvider = Cesium.createWorldTerrain({
        requestWaterMask: false, // required for water effects
        requestVertexNormals: false // required for terrain lighting
      });
      // 打开深度检测，那么在地形以下的对象不可见
      v.scene.globe.depthTestAgainstTerrain = false;
      // 开启全球光照
      v.scene.globe.enableLighting = true;
    },
    getGeoJSON(name) {
      let vm = this;
      vm.curName = name;
      let geourl = `${vm.folder}/${name}.json`;

      //清空全部
      vm.viewer.dataSources.removeAll();
      vm.viewer.entities.removeAll();
      vm.curDataSource = vm.dataSources[name];

      if (vm.curDataSource) {
        vm.viewer.dataSources.add(vm.curDataSource);
        vm.viewer.zoomTo(vm.curDataSource);
      } else {
        var dataSource = null;
        if (vm.curStyleName == "basic") {
          dataSource = Cesium.GeoJsonDataSource.load(geourl, {
            stroke: Cesium.Color.HOTPINK,
            fill: Cesium.Color.PINK.withAlpha(0.5),
            strokeWidth: 3
          });
        } else {
          var dataSource = Cesium.GeoJsonDataSource.load(
            `${vm.folder}/${name}.json`
          );
        }

        dataSource.then(res => {
          if (vm.curStyleName == "custom") {
            vm.resetEntity(res);
          }
          vm.viewer.dataSources.add(res);
          vm.viewer.zoomTo(res);
          vm.dataSources[name] = res;
        });
      }
      vm.addLabel(name);
    },
    getStyleType(type) {
      this.curStyleName = type;
      this.dataSources = {};
    },
    addLabel(name) {
      let vm = this;
      let polygonData = require(`../../../public/data/datasource/china-geojson/${name}.json`); //加载本地的json文件
      polygonData.features.forEach(f => {
        let info = f.properties;
        let center = turf.center(f);
        let lableEntity = this.viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(
            ...center.geometry.coordinates
          ),
          label: {
            text: info.name,
            font: "24px Helvetica",
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 垂直方向以底部来计算标签的位置

            fillColor: Cesium.Color.SKYBLUE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            HeightReference: 100000,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            translucencyByDistance: new Cesium.NearFarScalar(
              1.5e2,
              1.0,
              1.5e8,
              0.0
            )
          }
        });
        // lableEntity.label.pixelOffset = new Cesium.Cartesian2(20, 2000);
      });
    },
    resetEntity(dataSource) {
      //Get the array of entities
      var entities = dataSource.entities.values;

      var colorHash = {};
      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        var name = entity.name;

        var color = colorHash[name];
        if (!color) {
          color = Cesium.Color.fromRandom({
            alpha: 1.0
          });
          colorHash[name] = color;
        }
        entity.polygon.height = 0;
        //Set the polygon material to our random color.
        entity.polygon.material = color;
        //Remove the outlines.
        entity.polygon.outline = false;

        // entity.polygon.extrudedHeight = entity.properties.Population / 50.0;
        entity.polygon.extrudedHeight = Math.random() * 100000;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

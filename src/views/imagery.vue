<template>
  <div>
    <div class="btn-box">
      <div
        v-for="(item, index) in Object.keys(imgProviders)"
        :key="index"
        class="btn-box-item"
        :class="{'btn-box-item-selected':curName==item}"
        @click="getImageryProvider(item)"
      >{{item}}</div>
    </div>
    <panel left="245" top="30">
      <div class="panel-item">
        <label>brightness:</label>

        <el-slider class="slider" :min="0" :max="3" :step="0.02" v-model="layerColor.brightness"></el-slider>
      </div>
      <div class="panel-item">
        <label>contrast:</label>
        <el-slider class="slider" :min="0" :max="3" :step="0.02" v-model="layerColor.contrast"></el-slider>
      </div>
      <div class="panel-item">
        <label>hue:</label>
        <el-slider class="slider" :min="0" :max="3" :step="0.02" v-model="layerColor.hue"></el-slider>
      </div>
      <div class="panel-item">
        <label>saturation:</label>
        <el-slider class="slider" :min="0" :max="3" :step="0.02" v-model="layerColor.saturation"></el-slider>
      </div>
      <div class="panel-item">
        <label>gamma:</label>
        <el-slider class="slider" :min="0" :max="3" :step="0.02" v-model="layerColor.gamma"></el-slider>
      </div>
    </panel>
    <base-cesium @getViewer="getViewer" :imgurl="imgurl"></base-cesium>
  </div>
</template>

<script>
import Cesium from "cesium/Cesium";
import { BaseCesium, Panel } from "@/components";
export default {
  name: "",
  components: {
    BaseCesium,
    Panel
  },
  watch: {
    layerColor: {
      handler(n, o) {
        if (n != null) {
          this.resetLayerColor();
        }
      },
      deep: true
    }
  },
  data() {
    return {
      imgurl: "",
      viewer: null,
      curName: null,
      viewerLayers: null,
      layerColor: null,
      imgProviders: {
        arcgis: {
          name: "ArcGisMapServerImageryProvider",
          option: {
            url:
              "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
            enablePickFeatures: false
          }
        },
        ion: {
          name: "IonImageryProvider",
          option: {
            assetId: 3954
          }
        },

        osm: {
          name: "createOpenStreetMapImageryProvider",
          option: { url: "https://a.tile.openstreetmap.org/" }
        },
        ctms: {
          name: "createTileMapServiceImageryProvider",
          option: {
            url: "http://cesiumjs.org/tilesets/imagery/blackmarble"
            // proxy: new Cesium.DefaultProxy("/proxy/"),
            // maximumLevel: 8,
            // credit: "Black Marble imagery courtesy NASA Earth Observatory"
          }
        },
        grid: { name: "GridImageryProvider", option: {} },
        mapbox: {
          name: "MapboxImageryProvider",
          option: {
            mapId: "mapbox.satellite"
          }
        },
        single: {
          name: "SingleTileImageryProvider",
          option: {
            url: "/images/world.jpg"
          }
        },
        tc: { name: "TileCoordinatesImageryProvider", option: {} },

        wms: {
          name: "WebMapServiceImageryProvider",
          option: {
            url:
              "https://sampleserver1.arcgisonline.com/ArcGIS/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer/WMSServer",
            layers: "0",
            proxy: new Cesium.DefaultProxy("/proxy/")
          }
        },
        wmts: {
          name: "WebMapTileServiceImageryProvider",
          option: {
            url:
              "http://basemap.nationalmap.gov/arcgis/rest/services/USGSShadedReliefOnly/MapServer/WMTS",
            layer: "USGSShadedReliefOnly",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "default028mm",
            // tileMatrixLabels : ['default028mm:0', 'default028mm:1', 'default028mm:2' ...],
            maximumLevel: 19,
            credit: new Cesium.Credit("U. S. Geological Survey")
          }
        },
        Warm: {
          name: "UrlTemplateImageryProvider",
          option: {
            url:
              "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}"
          }
        },

        PublishBlue: {
          name: "UrlTemplateImageryProvider",
          option: {
            url:
              "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}"
          }
        },

        高德矢量: {
          name: "UrlTemplateImageryProvider",
          option: {
            // url:
            //   "  https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"
            url:
              "http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
            subdomains: ["1", "2", "3", "4"]
          }
        },
        高德影像: {
          name: "UrlTemplateImageryProvider",
          option: {
            url:
              "https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
            subdomains: ["1", "2", "3", "4"]
          },
          road: {
            url:
              "https://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=2&style=8&ltype=11",
            subdomains: ["1", "2", "3", "4"]
          },
          label: {
            url:
              "http://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}",
            subdomains: ["1", "2", "3", "4"]
          }
        },

        腾讯影像: {
          name: "UrlTemplateImageryProvider",
          option: {
            url:
              "https://p2.map.gtimg.com/sateTiles/{z}/{sx}/{sy}/{x}_{reverseY}.jpg?version=229",
            customTags: {
              sx: function(imageryProvider, x, y, level) {
                return x >> 4;
              },
              sy: function(imageryProvider, x, y, level) {
                return ((1 << level) - y) >> 4;
              }
            }
          },
          label: {
            url:
              "https://rt3.map.gtimg.com/tile?z={z}&x={x}&y={reverseY}&styleid=2&version=297"
          }
        },
        谷歌矢量: {
          name: "UrlTemplateImageryProvider",
          option: {
            url:
              "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali"
          }
        },
        谷歌影像: {
          name: "UrlTemplateImageryProvider",
          option: {
            url:
              "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
          }
        },
        localWMS: {
          name: "WebMapServiceImageryProvider",
          option: {
            url: "http://localhost:8080/geoserver/topp/wms",
            layers: "topp:states",
            proxy: new Cesium.DefaultProxy("/proxy/")
          }
        }
      }
    };
  },
  beforeMount() {
    this.layerColor = {
      brightness: 1,
      contrast: 1,
      hue: 1,
      saturation: 1,
      gamma: 1
    };
  },
  methods: {
    getViewer(v) {
      this.viewer = v;
      this.viewerLayers = this.viewer.imageryLayers;
    },
    getImageryProvider(key) {
      this.curName = key;
      let curObj = this.imgProviders[key];
      //创建imageryProvider
      let baseLayer = new Cesium[curObj.name](curObj.option);
      //移除图层

      // this.viewerLayers.remove(this.viewer.imageryLayers.get(0));
      this.viewerLayers.removeAll();
      //添加图层
      this.viewerLayers.addImageryProvider(baseLayer);

      if (curObj.label) {
        let labelLayer = new Cesium[curObj.name](curObj.label);
        this.viewerLayers.addImageryProvider(labelLayer, 1);
      }
      if (curObj.road) {
        let labelLayer = new Cesium[curObj.name](curObj.road);
        this.viewerLayers.addImageryProvider(labelLayer, 2);
      }
      this.resetLayerColor();
    },
    resetLayerColor() {
      let layer = this.viewerLayers.get(0);
      Object.keys(this.layerColor).forEach(key => {
        layer[key] = this.layerColor[key];
      });
    }
  }
};
</script>

<style lang = 'scss' scoped >
.panel-item {
  padding: 5px;
  color: white;
  width: 290px !important;
  display: flex;
  height: 30px;
  line-height: 30px;
  label {
    width: 90px;
    text-align: right;
    margin-right: 15px;
  }
  .slider {
    width: 180px;
  }
}
</style>
<template>
  <div>
    <base-cesium @getViewer="getViewer" :options="options"></base-cesium>
  </div>
</template>

<script>
import Cesium from "cesium/Cesium";
import {BaseCesium} from "@/components";
export default {
  name: "",
  components: { BaseCesium },
  data() {
    return {
      viewer: null,
      // imgurl: "/images/world.jpg",
      options: {
        baseLayerPicker: true
      }
    };
  },

  methods: {
    getViewer(v) {
      this.viewer = v;
      this.addSelfBaseLayer();
    },
    addSelfBaseLayer() {
      var providerViewModels = [];

      let gaodev = new Cesium.UrlTemplateImageryProvider({
        url:
          "http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
        subdomains: ["1", "2", "3", "4"]
      });
      var gaodeMapModel = new Cesium.ProviderViewModel({
        name: "高德矢量",
        iconUrl: Cesium.buildModuleUrl(
          "Widgets/Images/ImageryProviders/openStreetMap.png"
        ),
        tooltip: "高德矢量 地图服务",
        creationFunction: function() {
          return gaodev;
        }
      });
      providerViewModels.push(gaodeMapModel);
      let gaode = new Cesium.UrlTemplateImageryProvider({
        url:
          "https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
        subdomains: ["1", "2", "3", "4"]
      });
      let gaodeLabel = new Cesium.UrlTemplateImageryProvider({
        url:
          "http://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}",
        subdomains: ["1", "2", "3", "4"]
      });
      var gaodeMapModel = new Cesium.ProviderViewModel({
        name: "高德影像",
        iconUrl: Cesium.buildModuleUrl(
          "Widgets/Images/ImageryProviders/mapboxSatellite.png"
        ),
        tooltip: "高德影像 地图服务",
        creationFunction: function() {
          return [gaode, gaodeLabel];
        }
      });
      providerViewModels.push(gaodeMapModel);

      let tencent = new Cesium.UrlTemplateImageryProvider({
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
      });
      let tencentLabel = new Cesium.UrlTemplateImageryProvider({
        url:
          "https://rt3.map.gtimg.com/tile?z={z}&x={x}&y={reverseY}&styleid=2&version=297"
      });
      var gaodeMapModel = new Cesium.ProviderViewModel({
        name: "腾讯影像",
        iconUrl: Cesium.buildModuleUrl(
          "Widgets/Images/ImageryProviders/mapboxSatellite.png"
        ),
        tooltip: "腾讯影像 地图服务",
        creationFunction: function() {
          return [tencent, tencentLabel];
        }
      });
      providerViewModels.push(gaodeMapModel);

      this.viewer.baseLayerPicker.viewModel.imageryProviderViewModels = providerViewModels;
      //设置默认地图源
      this.viewer.baseLayerPicker.viewModel.selectedImagery = this.viewer.baseLayerPicker.viewModel.imageryProviderViewModels[0];
    }
  }
};
</script>

<style lang = 'less' scoped >
</style>
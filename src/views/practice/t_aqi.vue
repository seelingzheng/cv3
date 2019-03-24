<template>
  <div>
    <base-cesium @getViewer="getViewer"></base-cesium>
  </div>
</template>

<script>
import Cesium from "cesium/Cesium";
import { BaseCesium } from "@/components";
import { aqi } from "@/mixins";
import * as transfer from "@/utils/transfer";

const apiJson = {
  aqi: `https://api.waqi.info/mapq/bounds/?bounds={b}&inc=placeholders&k=_2Y2EzVx9YAVscMzsPSxRWXmldZEY+ExFTFXgRLg==&_=1493729062849`
};
export default {
  name: "",
  components: {
    BaseCesium
  },
  mixins: [aqi],
  data() {
    return {
      viewer: null
    };
  },

  methods: {
    getViewer(v) {
      let vm = this;
      vm.viewer = v;
      let gaodev = new Cesium.UrlTemplateImageryProvider({
        url:
          "http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
        subdomains: ["1", "2", "3", "4"]
      });

      let viewerLayers = vm.viewer.imageryLayers;
      viewerLayers.remove(vm.viewer.imageryLayers.get(0));
      viewerLayers.addImageryProvider(gaodev);

      let center = Cesium.Cartesian3.fromDegrees(104.0666, 30.653709, 200000);
      vm.viewer.camera.flyTo({
        destination: center,
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-60),
          roll: Cesium.Math.toRadians(0)
        },
        duration: 3
      });

      vm.viewer.scene.camera.changed.addEventListener(function() {
        if (vm.getBoundsStr()) vm.getAqi(vm.getBoundsStr());
      });
    },
    addEntity(option) {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(option.lng, option.lat),

        billboard: {
          image: option.icon,
          scale: 0.4,
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5)
        },
        label: {
          text: option.name,
          scale: 0.2,
          offsetY: 200,
          // fillColor: Cesium.Color[option.color],
          // fillColor:
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 垂直方向以底部来计算标签的位置
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
          showBackground: true
          // backgroundColor: new Cesium.Color(0.5, 1, 0.5, 0.4),
          // horizontalOrigin: Cesium.HorizontalOrigin.CENTER
        }
      });
    },
    getAqi(bounds) {
      var vm = this;
      vm.viewer.entities.removeAll();
      this.loadApi(bounds).then(res => {
        vm.markers = {};
        console.log("res.data", res.data);
        res.data.forEach(function(data) {
          var aqi = data["aqi"] * 1;
          var pol = data["pol"];
          var utime = data["utime"];
          var tz = data["tz"];
          var cityName = data["city"];
          var cityName =
            cityName.indexOf("(") > -1
              ? cityName.split("(")[1].replace(")", "")
              : cityName;

          var color = vm.getAqiColor(aqi).toUpperCase();
          var text = vm.getAqiText(aqi);
          var tips = cityName + " " + aqi;

          var wgs84Point = transfer.gcj02towgs84(data["lon"], data["lat"]);

          var latlng = [data["lat"], data["lon"]];

          var option = {
            name: cityName,
            // lng: latlng[1],
            // lat: latlng[0],
            lng: wgs84Point[0],
            lat: wgs84Point[1],
            alt: 0,
            icon: vm.getIcon(aqi),
            length: vm.getAqiLength(aqi),
            color: color,
            aqi: aqi
          };
          vm.addEntity(option);
        });
      });
    },

    loadApi(bounds) {
      var url = apiJson.aqi.replace("{b}", bounds);
      return this.$http.get(url);
    },
    getBoundsStr() {
      var bounds = this.getBounds();
      if (!bounds) return "";
      var boundsStr = [
        bounds.se[1],
        bounds.nw[0],
        bounds.nw[1],
        bounds.se[0]
      ].join(",");
      return boundsStr;
    },
    getBounds() {
      var pt1 = new Cesium.Cartesian2(0, 0);
      var pt2 = new Cesium.Cartesian2(
        this.$el.firstElementChild.clientWidth,
        this.$el.firstElementChild.clientHeight
      );

      var pick1 = this.viewer.scene.globe.pick(
        this.viewer.camera.getPickRay(pt1),
        this.viewer.scene
      );
      var pick2 = this.viewer.scene.globe.pick(
        this.viewer.camera.getPickRay(pt2),
        this.viewer.scene
      );

      if (!pick1 || !pick2) return "";
      //将三维坐标转成地理坐标
      var geoPt1 = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(
        pick1
      );
      var geoPt2 = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(
        pick2
      );

      //地理坐标转换为经纬度坐标
      var point1 = [
        (geoPt1.longitude / Math.PI) * 180,
        (geoPt1.latitude / Math.PI) * 180
      ];
      var point2 = [
        (geoPt2.longitude / Math.PI) * 180,
        (geoPt2.latitude / Math.PI) * 180
      ];
      return {
        nw: point1,
        se: point2
      };
    }
  }
};
</script>

<style lang = 'less' scoped >
</style>
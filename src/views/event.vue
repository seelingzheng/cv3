<template>
  <div>
    <div class="btn-box">
      <div
        v-for="(item, index) in  eventTypes"
        :key="index"
        class="btn-box-item"
        :class="{'btn-box-item-selected':curName==item}"
        @click="rejectPickerEvent(item)"
      >{{item}}</div>
    </div>
    <div class="mouseinfo">{{mouseInfo}}</div>
    <base-cesium @getViewer="getViewer" :imgurl="imgurl"></base-cesium>
  </div>
</template>

<script>
import Cesium from "cesium/Cesium";
import BaseCesium from "../components/BaseCesium";
import { lxzx3, lxzx2 } from "@/assets/data/graphics.js";
import { gcj02towgs84 } from "@/utils/transfer.js";
export default {
  components: {
    BaseCesium
  },
  data() {
    return {
      viewer: null,
      curName: null,
      oldName: null,
      eventTypes: [
        "MOUSE_MOVE",
        "LEFT_CLICK",
        "LEFT_DOUBLE_CLICK",
        "LEFT_DOWN",
        "LEFT_UP",
        "WHEEL"
      ],
      mouseInfo: "",
      ellipsoid: null,
      handler: null,
      imgurl: "" //"/images/world.jpg"
    };
  },

  mounted() {},
  methods: {
    getViewer(v) {
      this.viewer = v;
      // this.handler = new Cesium.ScreenSpaceEventHandler(
      //   this.viewer.scene.canvas
      // );
      this.handler = this.viewer.cesiumWidget.screenSpaceEventHandler;

      let layers = this.viewer.imageryLayers;
      layers.remove(layers.get(0));
      layers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url:
            "http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
          minimumLevel: 2,
          maximumLevel: 5,
          subdomains: ["1", "2", "3", "4"]
        })
      );
      this.ellipsoid = this.viewer.scene.globe.ellipsoid; //得到当前三维场景的椭球体
    },

    rejectPickerEvent(n) {
      let vm = this;

      if (this.oldName && this.oldName !== n) {
        this.handler.removeInputAction(
          Cesium.ScreenSpaceEventType[this.oldName]
        );

        // this.handler.removeInputAction(Cesium.ScreenSpaceEventType[n]);
      }
      this.oldName = n;

      this.handler.setInputAction(movement => {
        //通过指定的椭球或者地图对应的坐标系，将鼠标的二维坐标转换为对应椭球体三维坐标
        let p = n == "MOUSE_MOVE" ? "endPosition" : "position";
        let cartesian = vm.viewer.camera.pickEllipsoid(
          movement[p],
          vm.ellipsoid
        );
        if (cartesian) {
          //将笛卡尔坐标转换为地理坐标
          let cartographic = vm.ellipsoid.cartesianToCartographic(cartesian);
          //将弧度转为度的十进制度表示
          let longitudeString = Cesium.Math.toDegrees(
            cartographic.longitude
          ).toFixed(3);
          let latitudeString = Cesium.Math.toDegrees(
            cartographic.latitude
          ).toFixed(3);
          //获取相机高度
          let height = Math.ceil(
            vm.viewer.camera.positionCartographic.height
          ).toFixed(3);
          vm.mouseInfo =
            "移动：(" +
            longitudeString +
            ", " +
            latitudeString +
            "," +
            height +
            ")";
        } else {
          vm.mouseInfo = "";
        }
      }, Cesium.ScreenSpaceEventType[n]);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.mouseinfo {
  user-select: none;
  position: absolute;
  left: 240px;
  top: 40px;
  color: red;
  z-index: 1;
  display: flex;
  background: #0c0c7566;
  border-radius: 5px;
}
</style>

